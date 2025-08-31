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
}

// ...existing code...

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
  store.nodes[tab.id] = ensureNodeDefaults({
    tabId: tab.id,
    parentId: tab.openerTabId ?? null,
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
  const toDelete = new Set([tabId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [idStr, n] of Object.entries(nodes)) {
      const id = Number(idStr);
      const node = n as TrailNode;
      if (!toDelete.has(id) && node.parentId != null && toDelete.has(node.parentId)) {
        toDelete.add(id);
        changed = true;
      }
    }
  }
  for (const id of toDelete) delete nodes[id];
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
      const winId = sender.tab?.windowId || (await chrome.windows.getCurrent()).id;
      const store = await getStore(winId);
  Object.values(store.nodes).forEach((n) => ((n as TrailNode).expanded = false));
      await setStore(winId, store);
      sendResponse({ ok: true });
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
