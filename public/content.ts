// Converted from content.js to TypeScript
(function () {
  function findAnchor(el: HTMLElement | null): HTMLAnchorElement | null {
    let node = el;
    while (node && node !== document.body && node.tagName !== 'A') {
      node = node.parentElement;
    }
    return node && node.tagName === 'A' ? (node as HTMLAnchorElement) : null;
  }

  function shouldIgnoreClick(e: MouseEvent, a: HTMLAnchorElement | null): boolean {
    if (e.defaultPrevented) return true;
    if (e.button !== 0) return true;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return true;
    if (!a) return true;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return true;
    if (a.hasAttribute('download')) return true;
    if (a.target && a.target.toLowerCase() === '_blank') return true;
    return false;
  }

  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const a = findAnchor(e.target as HTMLElement);
      if (shouldIgnoreClick(e, a)) return;
      const href = a?.getAttribute('href');
      try {
        const url = new URL(href || '', location.href).toString();
        e.preventDefault();
        // Detect spellcheck/autocorrect: if the anchor is inside an input or search bar, reload instead of opening a new tab
        let isSearchOrInput = false;
        if (a) {
          let parent = a.parentElement;
          while (parent) {
            if (parent.tagName === 'INPUT' || parent.tagName === 'FORM' || parent.getAttribute('role') === 'search') {
              isSearchOrInput = true;
              break;
            }
            parent = parent.parentElement;
          }
        }
        if (isSearchOrInput) {
          location.reload();
          return;
        }
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          chrome.runtime.sendMessage({ type: 'openChild', url });
        }
      } catch (_) {
        // ignore invalid URLs
      }
    },
    true
  );
})();
