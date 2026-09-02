(() => {
  const body = document.body;
  const root = document.documentElement;
  const status = document.querySelector('[data-lab-status]');
  const appearanceButtons = [...document.querySelectorAll('[data-appearance]')];
  const schemeButtons = [...document.querySelectorAll('[data-scheme]')];
  const colorThemeButtons = [...document.querySelectorAll('button[data-color-theme]')];

  const selectedLabel = (buttons, dataKey, value) => (
    buttons.find((button) => button.dataset[dataKey] === value)?.textContent.trim()
    ?? value
  );

  const updateStatus = () => {
    const appearance = selectedLabel(appearanceButtons, 'appearance', body.dataset.appearanceTheme);
    const colorTheme = selectedLabel(colorThemeButtons, 'colorTheme', root.dataset.colorTheme);
    const scheme = selectedLabel(schemeButtons, 'scheme', root.dataset.theme);
    if (status) status.textContent = `${appearance} 외형, ${colorTheme} 컬러, ${scheme} 모드`;
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

  colorThemeButtons.forEach((button) => button.addEventListener('click', () => {
    root.dataset.colorTheme = button.dataset.colorTheme;
    colorThemeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    updateStatus();
  }));
})();
