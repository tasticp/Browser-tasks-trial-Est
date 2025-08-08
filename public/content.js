(function () {
  function findAnchor(el) {
    let node = el;
    while (node && node !== document && node.tagName !== 'A') {
      node = node.parentElement;
    }
    return node && node.tagName === 'A' ? node : null;
  }

  function shouldIgnoreClick(e, a) {
    if (e.defaultPrevented) return true;
    if (e.button !== 0) return true; // only left click
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return true; // honor modifiers
    if (!a) return true;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return true;
    if (a.hasAttribute('download')) return true;
    // Allow explicit new tab behavior; opener will be set by the browser and we'll still map it
    if (a.target && a.target.toLowerCase() === '_blank') return true;
    return false;
  }

  document.addEventListener(
    'click',
    (e) => {
      const a = findAnchor(e.target);
      if (shouldIgnoreClick(e, a)) return;
      const href = a.getAttribute('href');
      try {
        const url = new URL(href, location.href).toString();
        e.preventDefault();
        chrome.runtime.sendMessage({ type: 'openChild', url });
      } catch (_) {
        // ignore invalid URLs
      }
    },
    true // capture early
  );
})();
