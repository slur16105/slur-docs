import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokenPath = path.join(root, 'skill/slur-design/assets/tokens/colors.css');
const colorThemeDir = path.join(root, 'docs-internal/color-themes');
const colorBasePath = path.join(colorThemeDir, 'base.css');
const labHtmlPath = path.join(root, 'docs-internal/appearance-theme-lab.html');
const css = fs.readFileSync(tokenPath, 'utf8');

function declarations(body) {
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
}

const baseLight = {};
for (const match of css.matchAll(/:root\s*{([\s\S]*?)}/g)) Object.assign(baseLight, declarations(match[1]));
const colorBaseCss = fs.readFileSync(colorBasePath, 'utf8');
for (const match of colorBaseCss.matchAll(/:root\s*{([\s\S]*?)}/g)) Object.assign(baseLight, declarations(match[1]));
const darkBlock = css.match(/\[data-theme=["']dark["']\]\s*{([\s\S]*?)}/);
if (!darkBlock) throw new Error('Dark theme token block not found.');
const baseDark = declarations(darkBlock[1]);
for (const match of colorBaseCss.matchAll(/:root\[data-theme=["']dark["']\]\s*{([\s\S]*?)}/g)) Object.assign(baseDark, declarations(match[1]));

const requiredLightTokens = [
  '--color-brand-50',
  '--color-brand-300',
  '--color-brand-400',
  '--color-brand-500',
  '--color-brand-600',
  '--color-brand-700',
  '--color-brand-soft',
];
const requiredDarkTokens = ['--color-brand-soft'];
const requiredChipTokens = ['--color-theme-chip-light', '--color-theme-chip-dark'];
const accentTokens = ['--color-accent', '--color-accent-soft', '--color-text-accent', '--color-chart-accent'];
const accentChipTokens = ['--color-theme-chip-accent-light', '--color-theme-chip-accent-dark'];
const contractFailures = [];

function contractFail(message) {
  contractFailures.push(message);
}

function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').trim();
}

function normalizedSelector(selector) {
  return selector.replace(/\s+/g, '');
}

function validateTokenSet(fileName, selector, values, requiredTokens) {
  const names = Object.keys(values);
  for (const token of requiredTokens) {
    if (!names.includes(token)) contractFail(`${fileName}: ${selector}에 필수 토큰 ${token}이 없습니다.`);
  }
  for (const token of names) {
    if (!requiredTokens.includes(token)) contractFail(`${fileName}: ${selector}에 승인되지 않은 토큰 ${token}이 있습니다.`);
  }
}

if (!fs.existsSync(colorThemeDir)) throw new Error('Color theme directory not found.');
const labHtml = fs.readFileSync(labHtmlPath, 'utf8');
const colorThemeFiles = fs.readdirSync(colorThemeDir).filter((file) => file.endsWith('.css') && file !== 'base.css').sort();
const themes = {};
const colorThemeNames = [];

for (const fileName of colorThemeFiles) {
  const themeName = path.basename(fileName, '.css');
  const source = withoutComments(fs.readFileSync(path.join(colorThemeDir, fileName), 'utf8'));
  const rules = [...source.matchAll(/([^{}]+)\{([^{}]*)}/g)];
  const residual = source.replace(/([^{}]+)\{([^{}]*)}/g, '').trim();
  colorThemeNames.push(themeName);

  if (rules.length !== 3 || residual) {
    contractFail(`${fileName}: Light, Dark, 컬러칩 규칙이 각각 하나씩 있어야 합니다.`);
    continue;
  }
  if (/@import|!important|url\s*\(/i.test(source)) {
    contractFail(`${fileName}: @import, !important, url()은 사용할 수 없습니다.`);
  }

  const ruleMap = new Map(rules.map((match) => [normalizedSelector(match[1]), declarations(match[2])]));
  const lightSelector = normalizedSelector(`:root[data-color-theme="${themeName}"]`);
  const darkSelector = normalizedSelector(`:root[data-color-theme="${themeName}"][data-theme="dark"]`);
  const chipSelector = normalizedSelector(`.theme_lab .i_color_option[data-color-theme="${themeName}"]`);
  const lightOverrides = ruleMap.get(lightSelector);
  const darkOverrides = ruleMap.get(darkSelector);
  const chipValues = ruleMap.get(chipSelector);

  if (!lightOverrides) contractFail(`${fileName}: ${lightSelector} 규칙이 없습니다.`);
  if (!darkOverrides) contractFail(`${fileName}: ${darkSelector} 규칙이 없습니다.`);
  if (!chipValues) contractFail(`${fileName}: ${chipSelector} 규칙이 없습니다.`);
  if (!lightOverrides || !darkOverrides || !chipValues) continue;

  const isMultiColor = accentTokens.some((token) => token in lightOverrides || token in darkOverrides)
    || accentChipTokens.some((token) => token in chipValues);
  validateTokenSet(fileName, 'Light', lightOverrides, [...requiredLightTokens, ...(isMultiColor ? accentTokens : [])]);
  validateTokenSet(fileName, 'Dark', darkOverrides, [...requiredDarkTokens, ...(isMultiColor ? accentTokens : [])]);
  validateTokenSet(fileName, '컬러칩', chipValues, [...requiredChipTokens, ...(isMultiColor ? accentChipTokens : [])]);

  const buttonBody = labHtml.match(new RegExp(`<button[^>]+data-color-theme="${themeName}"[^>]*>([\\s\\S]*?)<\\/button>`))?.[1] ?? '';
  const chipCount = [...buttonBody.matchAll(/class="i_swatch(?: m_accent)?"/g)].length;
  if (chipCount !== (isMultiColor ? 2 : 1) || (isMultiColor && !buttonBody.includes('class="i_swatch m_accent"'))) {
    contractFail(`${fileName}: 단색은 컬러칩 1개, 조합 테마는 주색·보조색 컬러칩 2개를 등록해야 합니다.`);
  }

  for (const [token, value] of [...Object.entries(lightOverrides), ...Object.entries(darkOverrides), ...Object.entries(chipValues)]) {
    try {
      parseColor(value);
    } catch {
      contractFail(`${fileName}: ${token}은 지원되는 원시 컬러값이어야 합니다 (${value}).`);
    }
  }

  themes[`${themeName}-light`] = { ...baseLight, ...lightOverrides };
  themes[`${themeName}-dark`] = { ...baseLight, ...baseDark, ...lightOverrides, ...darkOverrides };
}

const linkedThemes = [...labHtml.matchAll(/href="color-themes\/([\w-]+)\.css"/g)].map((match) => match[1]).filter((name) => name !== 'base');
if (!labHtml.includes('href="color-themes/base.css"')) contractFail('보조색 기본값을 연결하는 color-themes/base.css 링크가 없습니다.');
const selectableThemes = [...labHtml.matchAll(/<button[^>]+data-color-theme="([\w-]+)"/g)].map((match) => match[1]);
for (const themeName of colorThemeNames) {
  if (!linkedThemes.includes(themeName)) contractFail(`${themeName}.css: 실험실 <link>에 등록되지 않았습니다.`);
  if (!selectableThemes.includes(themeName)) contractFail(`${themeName}.css: 실험실 선택 목록에 등록되지 않았습니다.`);
}
for (const themeName of new Set([...linkedThemes, ...selectableThemes])) {
  if (!colorThemeNames.includes(themeName)) contractFail(`${themeName}: 대응하는 컬러 테마 CSS 파일이 없습니다.`);
}
const defaultColorTheme = labHtml.match(/<html[^>]+data-color-theme="([\w-]+)"/)?.[1];
if (!defaultColorTheme || !colorThemeNames.includes(defaultColorTheme)) {
  contractFail('실험실 기본 컬러 테마가 유효하지 않습니다.');
}

if (contractFailures.length) {
  for (const failure of contractFailures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

function parseColor(value) {
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i)?.[1];
  if (hex) {
    const expanded = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex;
    const channels = expanded.match(/[\da-f]{2}/gi).map((channel) => parseInt(channel, 16));
    return { r: channels[0], g: channels[1], b: channels[2], a: (channels[3] ?? 255) / 255 };
  }
  const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+)%?)?\s*\)$/i);
  if (rgb) return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: rgb[4] === undefined ? 1 : Number(rgb[4]) };
  throw new Error(`Unsupported color value: ${value}`);
}

function color(theme, token, seen = new Set()) {
  if (seen.has(token)) throw new Error(`Circular token reference: ${[...seen, token].join(' -> ')}`);
  const value = themes[theme][token];
  if (!value) throw new Error(`Missing ${theme} token: ${token}`);
  const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return alias ? color(theme, alias, new Set([...seen, token])) : parseColor(value);
}

function composite(foreground, background) {
  const alpha = foreground.a + background.a * (1 - foreground.a);
  return {
    r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
    g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
    b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
    a: alpha,
  };
}

function opaque(theme, token, under = '--color-surface-card') {
  const value = color(theme, token);
  return value.a === 1 ? value : composite(value, color(theme, under));
}

function luminance({ r, g, b }) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const checks = [];
function add(theme, foreground, background, minimum, kind, backgroundUnder) {
  checks.push({
    theme,
    foreground,
    background,
    minimum,
    kind,
    ratio: contrast(opaque(theme, foreground), opaque(theme, background, backgroundUnder)),
  });
}

for (const theme of Object.keys(themes)) {
  const surfaces = ['--color-surface-page', '--color-surface-card', '--color-surface-sunken', '--color-surface-hover'];
  for (const foreground of ['--color-text-primary', '--color-text-secondary', '--color-text-muted']) {
    for (const background of surfaces) add(theme, foreground, background, 4.5, 'normal text');
  }
  for (const background of [...surfaces, '--color-brand-soft']) add(theme, '--color-text-brand', background, 4.5, 'brand text');
  for (const background of [...surfaces, '--color-accent-soft']) add(theme, '--color-text-accent', background, 4.5, 'accent text');

  const softSurfaces = ['--color-brand-soft', '--color-accent-soft', '--color-success-soft', '--color-warning-soft', '--color-danger-soft'];
  for (const foreground of ['--color-text-primary', '--color-text-secondary', '--color-text-muted']) {
    for (const background of softSurfaces) add(theme, foreground, background, 4.5, 'text on soft surface');
  }

  for (const status of ['success', 'warning', 'danger']) {
    for (const background of ['--color-surface-page', '--color-surface-card', '--color-surface-sunken', `--color-${status}-soft`]) {
      add(theme, `--color-${status}`, background, 4.5, 'status text');
    }
    add(theme, `--color-on-${status}`, `--color-${status}-solid`, 4.5, 'text on solid status');
    add(theme, `--color-${status}-on-inverse`, '--color-surface-inverse', 4.5, 'status on inverse');
    add(theme, `--color-${status}-solid`, '--color-surface-card', 3, 'solid status boundary');
  }

  for (const background of ['--color-brand', '--color-brand-hover', '--color-brand-active']) {
    add(theme, '--color-on-brand', background, 4.5, 'text on brand');
  }
  add(theme, '--color-text-inverse', '--color-surface-inverse', 4.5, 'inverse text');

  for (const foreground of ['--color-border-default', '--color-border-strong', '--color-border-focus']) {
    for (const background of ['--color-surface-page', '--color-surface-card', '--color-surface-sunken']) {
      add(theme, foreground, background, 3, 'UI boundary/focus');
    }
  }
  add(theme, '--color-brand', '--color-surface-card', 3, 'selected control');
  for (const background of ['--color-surface-page', '--color-surface-card', '--color-surface-sunken', '--color-accent-soft']) {
    add(theme, '--color-accent', background, 3, 'accent progress');
  }
  add(theme, '--color-chart-accent', '--color-surface-card', 3, 'accent chart mark');
  add(theme, '--color-surface-card', '--color-border-strong', 3, 'switch knob');
  for (let index = 1; index <= 5; index += 1) add(theme, `--color-chart-${index}`, '--color-surface-card', 3, 'chart mark');
}

const failures = checks.filter((check) => check.ratio + Number.EPSILON < check.minimum);
if (failures.length) {
  for (const check of failures) {
    console.error(
      `FAIL ${check.theme} ${check.kind}: ${check.foreground} / ${check.background} = ${check.ratio.toFixed(2)}:1 (needs ${check.minimum}:1)`,
    );
  }
  process.exitCode = 1;
} else {
  const textMinimum = Math.min(...checks.filter((check) => check.minimum === 4.5).map((check) => check.ratio));
  const uiMinimum = Math.min(...checks.filter((check) => check.minimum === 3).map((check) => check.ratio));
  console.log(
    `WCAG AA color contrast: ${checks.length}/${checks.length} passed across ${Object.keys(themes).length} variants ` +
      `(${colorThemeNames.join(', ')} × light/dark; normal text min ${textMinimum.toFixed(2)}:1, ` +
      `UI/focus/chart min ${uiMinimum.toFixed(2)}:1).`,
  );
}
