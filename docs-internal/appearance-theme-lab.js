import { previewGeometry } from './device-preview.mjs?v=1';

(() => {
  const body = document.body;
  const root = document.documentElement;
  const status = document.querySelector('[data-lab-status]');
  const appearanceButtons = [...document.querySelectorAll('[data-appearance]')];
  const layoutButtons = [...document.querySelectorAll('[data-layout]')];
  const schemeButtons = [...document.querySelectorAll('[data-scheme]')];
  const colorThemeButtons = [...document.querySelectorAll('button[data-color-theme]')];
  const deviceButtons = [...document.querySelectorAll('[data-device]')];
  const scaleButtons = [...document.querySelectorAll('[data-preview-scale]')];
  let device = 'auto';
  let view = 'fit';
  let contentHeight = 900;
  let frameReady = false;

  // Keep a single sample in the source; only the preview receives a clone.
  // No toolbar or scripts enter srcdoc, so nested previews cannot be created.
  document.querySelectorAll('.lab_segment').forEach((segment) => {
    const options = document.createElement('div');
    options.className = 'lab_options';
    [...segment.children].filter((child) => !child.classList.contains('i_label'))
      .forEach((child) => options.append(child));
    segment.append(options);
  });

  const stage = document.querySelector('.lab_stage');
  const previewDocument = document.implementation.createHTMLDocument('테마 미리보기');
  previewDocument.documentElement.lang = 'ko';
  const base = previewDocument.createElement('base');
  base.href = document.baseURI;
  previewDocument.head.prepend(base);
  document.querySelectorAll('link[rel="stylesheet"], meta[name="viewport"]')
    .forEach((node) => previewDocument.head.append(node.cloneNode(true)));
  previewDocument.body.className = 'theme_lab';
  previewDocument.body.append(document.querySelector('.lab_skip').cloneNode(true), stage.cloneNode(true));
  previewDocument.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.setAttribute('href', `about:srcdoc${link.getAttribute('href')}`);
  });

  const region = document.createElement('section');
  region.className = 'lab_preview_region';
  region.setAttribute('aria-label', '디바이스 미리보기');
  region.innerHTML = '<p class="lab_preview_hint">CSS px 기준 비교 화면입니다. 너비 맞춤은 화면만 축소하며, 반응형 기준 폭은 유지합니다. 100%에서는 가로로 스크롤할 수 있습니다.</p><div class="lab_preview_scroll" role="region" aria-label="미리보기 스크롤 영역" tabindex="0"><div class="lab_preview_size"></div></div>';
  const scrollArea = region.querySelector('.lab_preview_scroll');
  const sizeBox = region.querySelector('.lab_preview_size');
  const frame = document.createElement('iframe');
  frame.className = 'lab_preview_frame';
  frame.id = 'lab_preview';
  frame.title = '샘플 서비스 — 자동 크기 미리보기';
  sizeBox.append(frame);

  const syncThemes = () => {
    if (!frameReady) return;
    const doc = frame.contentDocument;
    doc.documentElement.dataset.theme = root.dataset.theme;
    doc.documentElement.dataset.colorTheme = root.dataset.colorTheme;
    doc.body.dataset.appearanceTheme = body.dataset.appearanceTheme;
    doc.body.dataset.layoutTheme = body.dataset.layoutTheme;
  };

  const updatePreview = () => {
    const geometry = previewGeometry(device, view, scrollArea.clientWidth, contentHeight);
    const { width, height, scale, displayWidth, displayHeight } = geometry;
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    frame.style.transform = `scale(${scale})`;
    sizeBox.style.width = `${displayWidth}px`;
    sizeBox.style.height = `${displayHeight}px`;
    const label = deviceButtons.find((button) => button.dataset.device === device).textContent.trim();
    const info = `${width} × ${height} CSS px · 표시 ${Math.round(scale * 100)}%`;
    document.querySelector('[data-preview-info]').textContent = info;
    frame.title = `샘플 서비스 — ${label} 미리보기 (${info})`;
  };

  frame.addEventListener('load', () => {
    frameReady = true;
    syncThemes();
    const childStage = frame.contentDocument.querySelector('.lab_stage');
    const contentObserver = new ResizeObserver(() => {
      contentHeight = childStage.offsetHeight;
      if (device === 'auto') updatePreview();
    });
    contentObserver.observe(childStage);
    updatePreview();
  }, { once: true });
  previewDocument.documentElement.dataset.theme = root.dataset.theme;
  previewDocument.documentElement.dataset.colorTheme = root.dataset.colorTheme;
  previewDocument.body.dataset.appearanceTheme = body.dataset.appearanceTheme;
  previewDocument.body.dataset.layoutTheme = body.dataset.layoutTheme;
  frame.srcdoc = '<!doctype html>' + previewDocument.documentElement.outerHTML;
  stage.replaceWith(region);
  document.querySelector('[data-device-controls]').hidden = false;
  document.querySelector('.lab_skip').href = '#lab_preview';
  new ResizeObserver(updatePreview).observe(scrollArea);
  updatePreview();

  const selectedLabel = (buttons, dataKey, value) => (
    buttons.find((button) => button.dataset[dataKey] === value)?.textContent.trim()
    ?? value
  );

  const updateStatus = () => {
    const appearance = selectedLabel(appearanceButtons, 'appearance', body.dataset.appearanceTheme);
    const layout = selectedLabel(layoutButtons, 'layout', body.dataset.layoutTheme);
    const colorTheme = selectedLabel(colorThemeButtons, 'colorTheme', root.dataset.colorTheme);
    const scheme = selectedLabel(schemeButtons, 'scheme', root.dataset.theme);
    const deviceLabel = selectedLabel(deviceButtons, 'device', device);
    const viewLabel = selectedLabel(scaleButtons, 'previewScale', view);
    if (status) status.textContent = `${appearance} 외형, ${layout} 레이아웃, ${colorTheme} 컬러, ${scheme} 모드, ${deviceLabel}, ${viewLabel}`;
    syncThemes();
  };

  appearanceButtons.forEach((button) => button.addEventListener('click', () => {
    body.dataset.appearanceTheme = button.dataset.appearance;
    appearanceButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    updateStatus();
  }));

  layoutButtons.forEach((button) => button.addEventListener('click', () => {
    body.dataset.layoutTheme = button.dataset.layout;
    layoutButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
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

  deviceButtons.forEach((button) => button.addEventListener('click', () => {
    device = button.dataset.device;
    deviceButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    scrollArea.scrollLeft = 0;
    // Remeasure when returning from a fixed viewport to automatic height.
    if (frameReady) contentHeight = frame.contentDocument.querySelector('.lab_stage').offsetHeight;
    updatePreview();
    updateStatus();
  }));
  scaleButtons.forEach((button) => button.addEventListener('click', () => {
    view = button.dataset.previewScale;
    scaleButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    scrollArea.scrollLeft = 0;
    updatePreview();
    updateStatus();
  }));
})();
