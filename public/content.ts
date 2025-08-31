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
        // Always track new tabs opened from a parent for virtual nested grouping
        if (e.button === 0) {
          // If the link opens in a new tab (target=_blank or user action), let browser handle it
          // Extension will track the openerTabId in background.js for virtual grouping
        }
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
        // Otherwise, do nothing by default
      } catch (_) {
        // ignore invalid URLs
      }
    },
    true
  );
})();
