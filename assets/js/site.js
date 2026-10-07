(() => {
  let carouselSelect = null;
  function revealFragment() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    if (target && target.matches('details.config-note')) {
      if (carouselSelect) carouselSelect(id);
      target.open = true;
      target.scrollIntoView({ block: 'start' });
    }
  }
  window.addEventListener('hashchange', revealFragment);
  document.querySelectorAll('.prose pre').forEach(pre => {
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', 'コード');
  });
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const card = carousel.querySelector('.terminal-card');
    const select = card.querySelector('select');
    const preview = card.querySelector('pre');
    const code = preview.querySelector('code');
    const status = carousel.querySelector('.terminal-status');
    const heading = carousel.querySelector('h1');
    const description = carousel.querySelector('#config-description');
    const dots = [...carousel.querySelectorAll('[data-config]')];
    const configs = [
      { id: 'screen', name: '.screenrc', description: '快適なターミナル環境のための設定ファイル。' },
      { id: 'proxy-ssh', name: 'proxy-ssh', description: '踏み台サーバー経由で接続するためのSSH設定。' },
      { id: 'vim', name: '.vimrc', description: 'Vimの編集環境を整えるための設定ファイル。' }
    ].map(config => ({ ...config, text: document.querySelector('#' + config.id + ' pre code').textContent }));
    let index = 0;
    let revision = 0;
    let resetTimer;
    let animation;
    function show(nextIndex, direction = 0, announce = true) {
      index = (nextIndex + configs.length) % configs.length;
      revision += 1;
      clearTimeout(resetTimer);
      const config = configs[index];
      select.value = config.id;
      heading.textContent = config.name;
      description.textContent = config.description;
      card.setAttribute('aria-label', `${index + 1} / ${configs.length}: ${config.name}`);
      preview.setAttribute('role', 'button');
      preview.setAttribute('aria-label', config.name + ' の設定全文をコピー（表示は先頭8行）');
      preview.title = 'クリックで設定全文をコピー（表示は先頭8行）';
      code.replaceChildren();
      config.text.split('\n').slice(0, 8).forEach((line, i) => {
        const row = document.createElement('span');
        row.className = 'code-line';
        row.dataset.line = i + 1;
        const match = line.match(/^(\s*\S+)(.*)$/);
        if (match) {
          const keyword = document.createElement('span');
          keyword.className = 'code-key';
          keyword.textContent = match[1];
          row.append(keyword, document.createTextNode(match[2]));
        } else row.textContent = line || '\u200b';
        code.append(row);
      });
      preview.scrollTop = preview.scrollLeft = 0;
      dots.forEach(dot => {
        if (dot.dataset.config === config.id) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      document.querySelectorAll('.site-nav a').forEach(link => {
        if (link.hash === '#' + config.id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      status.textContent = announce ? `${config.name} を表示（${index + 1} / ${configs.length}）` : '';
      if (animation) animation.cancel();
      if (direction && code.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animation = code.animate([{ transform: `translateX(${direction * 20}px)`, opacity: 0.35 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 160, easing: 'ease-out' });
      }
    }
    carouselSelect = id => {
      const next = configs.findIndex(config => config.id === id);
      if (next !== -1) show(next, Math.sign(next - index));
    };
    async function copyConfig() {
      const currentRevision = revision;
      const config = configs[index];
      try {
        await navigator.clipboard.writeText(config.text);
        if (revision !== currentRevision) return;
        status.textContent = config.name + ' の設定全文をコピーしました';
      } catch (_) {
        if (revision !== currentRevision) return;
        code.textContent = config.text;
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
    select.disabled = false;
    carousel.querySelector('.carousel-controls').hidden = false;
    card.querySelector('.copy-config').hidden = false;
    select.addEventListener('change', () => carouselSelect(select.value));
    carousel.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
      const direction = Number(button.dataset.direction);
      show(index + direction, direction);
    }));
    dots.forEach(dot => dot.addEventListener('click', () => carouselSelect(dot.dataset.config)));
    carousel.querySelector('.carousel-controls').addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        show(index + direction, direction);
      }
    });
    card.querySelector('.copy-config').addEventListener('click', copyConfig);
    preview.addEventListener('click', () => {
      if (!window.getSelection().toString()) copyConfig();
    });
    preview.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        copyConfig();
      }
    });
    show(0, 0, false);
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (carouselSelect && link.closest('.site-nav') && url.pathname === location.pathname && ['#screen', '#proxy-ssh', '#vim'].includes(url.hash)) {
      event.preventDefault();
      carouselSelect(url.hash.slice(1));
      history.replaceState(null, '', url.hash);
      carousel.scrollIntoView({ block: 'start' });
    } else if (url.pathname === location.pathname && url.hash === location.hash) revealFragment();
  });
  revealFragment();
})();
