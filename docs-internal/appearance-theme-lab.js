(() => {
  const body = document.body;
  const root = document.documentElement;
  const status = document.querySelector('[data-lab-status]');
  const appearanceButtons = [...document.querySelectorAll('[data-appearance]')];
  const schemeButtons = [...document.querySelectorAll('[data-scheme]')];

  const updateStatus = () => {
    const appearance = body.dataset.appearanceTheme === 'flat' ? 'Flat' : 'Standard';
    const scheme = root.dataset.theme === 'dark' ? 'Dark' : 'Light';
    if (status) status.textContent = `${appearance} 외형, ${scheme} 모드`;
  };

  appearanceButtons.forEach((button) => button.addEventListener('click', () => {
    body.dataset.appearanceTheme = button.dataset.appearance;
    appearanceButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    updateStatus();
  }));

  schemeButtons.forEach((button) => button.addEventListener('click', () => {
    root.dataset.theme = button.dataset.scheme;
    schemeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    updateStatus();
  }));
})();
