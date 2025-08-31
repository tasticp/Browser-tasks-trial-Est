// Converted from background.js to TypeScript
const KEY = (winId: number) => `trail:${winId}`;

interface TrailNode {
  tabId: number;
  parentId: number | null;
  title: string;
  url: string;
  expanded?: boolean;
}

interface TrailStore {
  nodes: Record<number, TrailNode>;
  childLimit?: number;
}


function ensureNodeDefaults(node: Partial<TrailNode>): TrailNode {
  return Object.assign({ expanded: false, title: "", url: "" }, node) as TrailNode;
}

async function getStore(windowId: number): Promise<TrailStore> {
  const key = KEY(windowId);
  const res = await chrome.storage.local.get(key);
  return res[key] || { nodes: {}, childLimit: 10 };
}

async function setStore(windowId: number, store: TrailStore) {
  const key = KEY(windowId);
  await chrome.storage.local.set({ [key]: store });
}

function toTree(storeNodes: Record<number, TrailNode>, activeTabId?: number) {
  const map: Record<string, any> = {};
  Object.values(storeNodes).forEach((n) => {
    map[n.tabId] = {
      id: String(n.tabId),
      title: n.title || n.url || "Tab",
      url: n.url,
      expanded: !!n.expanded,
      children: [],
      parentId: n.parentId != null ? String(n.parentId) : null,
    };
  });
  Object.values(map).forEach((n) => {
    if (n.parentId && map[n.parentId]) {
      map[n.parentId].children.push(n);
    }
  });
  const roots = Object.values(map).filter((n) => !n.parentId);
  return {
    root: { id: "root", title: "Trail", children: roots, expanded: true, parentId: null },
    selectedId: activeTabId ? String(activeTabId) : "",
  };
}

chrome.runtime.onInstalled.addListener(async () => {
  const win = await chrome.windows.getCurrent();
  if (!win || !win.id) return;
  const tabs = await chrome.tabs.query({ windowId: win.id });
  const store = await getStore(win.id);
  tabs.forEach((t) => {
    if (!t.id) return;
    store.nodes[t.id] = ensureNodeDefaults({
      tabId: t.id,
      parentId: t.openerTabId ?? null,
      title: t.title || "",
      url: t.url || "",
    });
  });
  await setStore(win.id, store);
});

chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.id || tab.windowId == null) return;
  const store = await getStore(tab.windowId);
  const parentId = tab.openerTabId ?? null;
  // Enforce child tab limit if set
  if (parentId != null && store.childLimit) {
    const childCount = Object.values(store.nodes).filter(n => n.parentId === parentId).length;
    if (childCount >= store.childLimit) {
      // Optionally notify user or just do nothing
      return;
    }
  }
  store.nodes[tab.id] = ensureNodeDefaults({
    tabId: tab.id,
    parentId,
    title: tab.title || "",
    url: tab.url || "",
  });
  await setStore(tab.windowId, store);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab || tab.windowId == null) return;
  const store = await getStore(tab.windowId);
  const node = store.nodes[tabId];
  if (node) {
    if (changeInfo.title) node.title = changeInfo.title;
    if (changeInfo.url) node.url = changeInfo.url;
    await setStore(tab.windowId, store);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const store = await getStore(removeInfo.windowId);
  const nodes = store.nodes;
  // Recursively find all child tabs of tabId
  function collectChildren(id: number, acc: Set<number>) {
    for (const n of Object.values(nodes)) {
      if (n.parentId === id && !acc.has(n.tabId)) {
        acc.add(n.tabId);
        collectChildren(n.tabId, acc);
      }
    }
  }
  const toDelete = new Set([tabId]);
  collectChildren(tabId, toDelete);
  for (const id of toDelete) {
    try { await chrome.tabs.remove(id); } catch {}
    delete nodes[id];
  }
  await setStore(removeInfo.windowId, store);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.runtime.sendMessage({ type: "activeTab", tabId: activeInfo.tabId, windowId: activeInfo.windowId }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === "getTree") {
      let currentTab = sender.tab;
      if (!currentTab) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tabs[0];
      }
      const windowId = currentTab?.windowId;
      if (windowId == null) return sendResponse({ root: { id: "root", title: "Trail", children: [] }, selectedId: "" });
      const store = await getStore(windowId);
      const { root, selectedId } = toTree(store.nodes, currentTab?.id);
      sendResponse({ root, selectedId });
    } else if (msg.type === "openChild") {
      const parentId = sender.tab?.id;
      if (!parentId) return sendResponse({ ok: false });
      const parentIndex = sender.tab?.index ?? 0;
      const store = await getStore(sender.tab?.windowId ?? 0);
      const limit = store.childLimit ?? 10;
      const childCount = Object.values(store.nodes).filter(n => n.parentId === parentId).length;
      if (childCount >= limit) {
        return sendResponse({ ok: false, error: "Child tab limit reached" });
      }
      const created = await chrome.tabs.create({ url: msg.url, openerTabId: parentId, index: parentIndex + 1 });
      sendResponse({ ok: true, tabId: created.id });
    } else if (msg.type === "toggleNode") {
      const tabId = Number(msg.tabId);
      const winId = sender.tab?.windowId;
      if (winId == null) return sendResponse({ ok: false });
      const store = await getStore(winId);
      const node = store.nodes[tabId];
      if (node) node.expanded = !node.expanded;
      await setStore(winId, store);
      sendResponse({ ok: true });
    } else if (msg.type === "collapseAll") {
      let winId = sender.tab?.windowId;
      if (typeof winId !== "number") {
        const win = await chrome.windows.getCurrent();
        winId = win.id;
      }
      if (typeof winId === "number") {
        const store = await getStore(winId);
        Object.values(store.nodes).forEach((n) => ((n as TrailNode).expanded = false));
        await setStore(winId, store);
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false });
      }
    } else if (msg.type === "closeNode") {
      const tabId = Number(msg.tabId);
      try {
        await chrome.tabs.remove(tabId);
      } catch {}
      sendResponse({ ok: true });
    } else if (msg.type === "focusTab") {
      const tabId = Number(msg.tabId);
      try {
        await chrome.tabs.update(tabId, { active: true });
      } catch {}
      sendResponse({ ok: true });
    }
  })();
  return true;
});
