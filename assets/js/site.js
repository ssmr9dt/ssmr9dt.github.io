(() => {
  function revealFragment() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    if (target && target.matches('details.config-note')) {
      target.open = true;
      target.scrollIntoView({ block: 'start' });
    }
  }
  window.addEventListener('hashchange', revealFragment);
  // A second click on the current fragment must also reopen a closed section.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.pathname === location.pathname && url.hash === location.hash) revealFragment();
  });
  document.querySelectorAll('.prose pre').forEach(pre => {
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', 'コード');
  });
  revealFragment();
})();
