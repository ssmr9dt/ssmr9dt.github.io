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
  const card = document.querySelector('.terminal-card');
  if (card) {
    const select = card.querySelector('.terminal-select');
    const preview = card.querySelector('pre');
    const code = preview.querySelector('code');
    const status = card.querySelector('.terminal-status');
    let fullText = '';
    let revision = 0;
    let resetTimer;
    function updateCard() {
      revision += 1;
      clearTimeout(resetTimer);
      const source = document.querySelector('#' + select.value + ' pre code');
      fullText = source.textContent;
      code.textContent = fullText.split('\n').slice(0, 8).join('\n');
      preview.setAttribute('role', 'button');
      preview.setAttribute('aria-label', select.selectedOptions[0].textContent + ' の設定全文をコピー');
      preview.title = 'クリックで設定全文をコピー（表示は抜粋）';
      status.textContent = '';
    }
    async function copyConfig() {
      const currentRevision = revision;
      const text = fullText;
      try {
        await navigator.clipboard.writeText(text);
        if (revision !== currentRevision) return;
        status.textContent = '設定全文をコピーしました';
      } catch (_) {
        if (revision !== currentRevision) return;
        code.textContent = text;
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'コピーできませんでした。選択した全文を手動でコピーしてください';
      }
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { status.textContent = ''; }, 5000);
    }
    select.addEventListener('change', updateCard);
    preview.addEventListener('click', copyConfig);
    preview.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        copyConfig();
      }
    });
    updateCard();
  }
  revealFragment();
})();
