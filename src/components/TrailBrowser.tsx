import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FolderTree, Link2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// ---------- Shared Types ----------
type TabNode = {
  id: string;
  title: string;
  url?: string;
  children: TabNode[];
  expanded?: boolean;
  parentId?: string | null;
};

type SamplePage = {
  id: string;
  title: string;
  body: string;
  links: { id: string; title: string }[];
};

const isExt = typeof chrome !== "undefined" && !!chrome.runtime?.id;

// ---------- Demo Content (fallback when not running as extension) ----------
const SAMPLE_PAGES: SamplePage[] = [
  {
    id: "home",
    title: "Welcome",
    body: "This demo simulates Arc's child tab trail: open links and they appear as collapsible children under the current tab.",
    links: [
      { id: "article-a", title: "Article A: Designing Trails" },
      { id: "docs-b", title: "Docs B: Hierarchical Navigation" },
    ],
  },
  { id: "article-a", title: "Article A: Designing Trails", body: "Trails preserve context by nesting related journeys beneath their origin. Collapse levels to declutter your workspace.", links: [ { id: "article-a-1", title: "A.1: Why Context Matters" }, { id: "article-a-2", title: "A.2: Patterns & Pitfalls" } ] },
  { id: "article-a-1", title: "A.1: Why Context Matters", body: "Child tabs keep you oriented. Your mental model becomes visible as structure.", links: [ { id: "docs-b", title: "Jump to Docs B" } ] },
  { id: "article-a-2", title: "A.2: Patterns & Pitfalls", body: "Avoid deep chains without summaries. Collapse and annotate when helpful.", links: [] },
  { id: "docs-b", title: "Docs B: Hierarchical Navigation", body: "A collapsible outline is a powerful way to manage tasks, research, and reading flows.", links: [ { id: "docs-b-1", title: "B.1: Collapsible Outlines" }, { id: "docs-b-2", title: "B.2: Tree vs Graph" } ] },
  { id: "docs-b-1", title: "B.1: Collapsible Outlines", body: "Toggle entire branches to quickly reduce visual noise.", links: [] },
  { id: "docs-b-2", title: "B.2: Tree vs Graph", body: "Trees are simple; graphs are expressive. Start with a tree for trails.", links: [] },
];

function findPage(id: string): SamplePage | undefined {
  return SAMPLE_PAGES.find((p) => p.id === id);
}

function useId() {
  const [i, setI] = useState(0);
  return () => {
    setI((x) => x + 1);
    return `${Date.now()}-${i}`;
  };
}

// ---------- Demo Tree Components (used when not in extension) ----------
function TreeNode({
  node,
  depth,
  selectedId,
  onToggle,
  onSelect,
  onRemove,
}: {
  node: TabNode;
  depth: number;
  selectedId: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children.length > 0;
  return (
    <li className="group">
      <div className="flex items-center gap-1">
        <button
          aria-label={node.expanded ? "Collapse" : "Expand"}
          onClick={() => (hasChildren ? onToggle(node.id) : onSelect(node.id))}
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
        >
          {hasChildren ? (
            node.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="inline-block w-4" />
          )}
        </button>
        <button
          onClick={() => onSelect(node.id)}
          className={`flex-1 text-left px-2 py-1 rounded-md border transition-colors ${
            isSelected
              ? "border-ring/40 bg-secondary text-foreground ring-1 ring-ring/30"
              : "border-transparent hover:bg-secondary"
          }`}
          style={{ marginLeft: depth > 0 ? depth * 16 : 0 }}
        >
          <span className="inline-flex items-center gap-2">
            {hasChildren ? <FolderTree className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            <span className="truncate">{node.title}</span>
            {depth === 0 ? (
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">Parent</span>
            ) : (
              <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs">Child</span>
            )}
          </span>
        </button>
        {depth > 0 && (
          <button
            aria-label="Close tab"
            onClick={() => onRemove(node.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {hasChildren && node.expanded && (
        <ul className="mt-1 ml-4 space-y-1 border-l-2 border-muted-foreground/30 pl-2">
          {node.children.map((c) => (
            <TreeNode
              key={c.id}
              node={c}
              depth={depth + 1}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TrailBrowser() {
  // ---------- Extension state ----------
  const [extRoot, setExtRoot] = useState<TabNode | null>(null);
  const [extSelected, setExtSelected] = useState<string>("");

  // Fetch and subscribe when running as extension (side panel)
  useEffect(() => {
    if (!isExt) return;
    const refresh = () => {
      try {
        chrome.runtime.sendMessage({ type: "getTree" }, (resp) => {
          if (!resp) return;
          setExtRoot(resp.root);
          setExtSelected(resp.selectedId);
        });
      } catch {}
    };

    refresh();
    const onMsg = (msg: any) => {
      if (msg?.type === "treeUpdated" || msg?.type === "activeTab") refresh();
    };
    chrome.runtime.onMessage.addListener(onMsg);
    return () => chrome.runtime.onMessage.removeListener(onMsg);
  }, []);

  const openChildExt = useCallback((url: string) => {
    if (!isExt) return;
    try {
      chrome.runtime.sendMessage({ type: "openChild", url });
    } catch {}
  }, []);

  const toggleExt = useCallback((tabId: string) => {
    if (!isExt) return;
    try { chrome.runtime.sendMessage({ type: "toggleNode", tabId }); } catch {}
  }, []);

  const selectExt = useCallback((tabId: string) => {
    if (!isExt) return;
    try { chrome.runtime.sendMessage({ type: "focusTab", tabId }); } catch {}
  }, []);

  const removeExt = useCallback((tabId: string) => {
    if (!isExt) return;
    try { chrome.runtime.sendMessage({ type: "closeNode", tabId }); } catch {}
  }, []);

  const collapseAllExt = useCallback(() => {
    if (!isExt) return;
    try { chrome.runtime.sendMessage({ type: "collapseAll" }); } catch {}
  }, []);

  // ---------- Demo state (web fallback) ----------
  const genId = useId();
  const [tree, setTree] = useState<TabNode>({
    id: "root",
    title: "Trail",
    children: [
      { id: "home", title: "Home", url: "home", children: [], expanded: true, parentId: "root" },
    ],
    expanded: true,
    parentId: null,
  });
  const [selectedId, setSelectedId] = useState("home");
  const selectedPage = useMemo(() => findPage(selectedId), [selectedId]);

  const mutateTree = useCallback((fn: (n: TabNode) => void) => {
    setTree((prev) => {
      const copy: TabNode = JSON.parse(JSON.stringify(prev));
      fn(copy);
      return copy;
    });
  }, []);

  const toggleDemo = useCallback((id: string) => {
    mutateTree((root) => {
      const stack: TabNode[] = [root];
      while (stack.length) {
        const n = stack.pop()!;
        if (n.id === id) {
          n.expanded = !n.expanded;
          break;
        }
        stack.push(...n.children);
      }
    });
  }, [mutateTree]);

  const selectDemo = useCallback((id: string) => setSelectedId(id), []);

  const removeDemo = useCallback((id: string) => {
    mutateTree((root) => {
      const visit = (n: TabNode) => {
        n.children = n.children.filter((c) => c.id !== id);
        n.children.forEach(visit);
      };
      visit(root);
    });
    if (selectedId === id) setSelectedId("home");
  }, [mutateTree, selectedId]);

  const openChildDemo = useCallback((parentId: string, pageId: string, forcedTitle?: string) => {
    const page = findPage(pageId);
    const title = forcedTitle ?? page?.title ?? pageId;
    const newId = genId();
    mutateTree((root) => {
      const stack: TabNode[] = [root];
      while (stack.length) {
        const n = stack.pop()!;
        if (n.id === parentId) {
          n.expanded = true;
          n.children.push({ id: newId, title, url: pageId, children: [], parentId: n.id, expanded: false });
          break;
        }
        stack.push(...n.children);
      }
    });
    setSelectedId(newId);
    toast({ title: "Child tab opened", description: title });
  }, [genId, mutateTree]);

  const collapseAllDemo = useCallback(() => {
    mutateTree((root) => {
      const visit = (n: TabNode) => {
        if (n.id !== "root") n.expanded = false;
        n.children.forEach(visit);
      };
      root.expanded = true;
      visit(root);
    });
  }, [mutateTree]);

  // ---------- Address bar ----------
  const [address, setAddress] = useState("");
  const onOpenChild = useCallback(() => {
    if (!address) return;
    if (isExt) {
      try {
        const full = new URL(address, location.href).toString();
        openChildExt(full);
      } catch {
        openChildExt(address);
      }
    } else {
      try {
        const hostname = new URL(address, window.location.href).hostname;
        openChildDemo(selectedId, address, hostname);
      } catch {
        openChildDemo(selectedId, address);
      }
    }
  }, [address, isExt, openChildExt, openChildDemo, selectedId]);

  // ---------- Derived render sources ----------
  const rootToRender: TabNode = isExt && extRoot ? extRoot : tree;
  const currentSelectedId = isExt ? extSelected : selectedId;

  const onToggle = (id: string) => (isExt ? toggleExt(id) : toggleDemo(id));
  const onSelect = (id: string) => (isExt ? selectExt(id) : selectDemo(id));
  const onRemove = (id: string) => (isExt ? removeExt(id) : removeDemo(id));
  const onCollapseAll = () => (isExt ? collapseAllExt() : collapseAllDemo());

  const currentPage = isExt ? null : selectedPage;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md" style={{ backgroundImage: "var(--gradient-primary)" }} aria-hidden />
            <span className="text-xl font-semibold">Arc-like Trail Tabs</span>
          </div>
        </div>
      </header>

      <div className="container grid md:grid-cols-[20rem_1fr] gap-0">
        <aside className="w-full md:w-80 border-r p-4 bg-card/50">
          <header className="mb-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Trail</h1>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onCollapseAll}>Collapse all</Button>
            </div>
          </header>
          <ul className="space-y-1">
            {rootToRender.children.map((n) => (
              <TreeNode
                key={n.id}
                node={n}
                depth={0}
                selectedId={currentSelectedId}
                onToggle={onToggle}
                onSelect={onSelect}
                onRemove={onRemove}
              />
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border px-3 py-2 flex-1">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isExt ? "Paste URL to open as child in your browser" : "Paste a URL or sample id (e.g., article-a)"}
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70"
                aria-label="Address bar"
              />
            </div>
            <Button onClick={onOpenChild} variant="default">
              <Plus className="h-4 w-4 mr-2" /> Open as child
            </Button>
          </div>

          {!isExt && (
            <article className="prose prose-slate max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold tracking-tight mb-2">{currentPage?.title ?? "External Page"}</h2>
              <p className="text-muted-foreground">{currentPage?.body ?? "Opened as a child tab. Content preview not available for external URLs in this demo."}</p>
              {currentPage && currentPage.links.length > 0 && (
                <section className="mt-6">
                  <h3 className="font-semibold mb-2">Links on this page</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentPage.links.map((l) => (
                      <li key={l.id}>
                        <button
                          className="underline underline-offset-4 text-foreground/90 hover:text-foreground"
                          onClick={() => openChildDemo(selectedId, l.id)}
                        >
                          {l.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>
          )}

          {isExt && (
            <div className="text-sm text-muted-foreground">
              You are running inside the extension side panel. Select items in the trail to focus tabs. Paste a URL to open as a child.
            </div>
          )}
        </main>
      </div>

      <footer className="border-t mt-6">
        <div className="container py-6 text-sm text-muted-foreground">
          {isExt
            ? "Side Panel active — child tabs open next to their parent and appear here as collapsible children."
            : "Open links as child tabs. Collapse levels to focus. This is a demo of the UX — to use as a Chrome extension, build and load the dist folder as unpacked."}
        </div>
      </footer>
    </div>
  );
}
