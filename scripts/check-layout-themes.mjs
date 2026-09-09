import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeDir = path.join(root, 'docs-internal/layout-themes');
const labHtmlPath = path.join(root, 'docs-internal/appearance-theme-lab.html');
const failures = [];
const requiredTokens = [
  '--layout-shell-max-width',
  '--layout-sidebar-width',
  '--layout-stage-padding',
  '--layout-sidebar-padding',
  '--layout-brand-margin-bottom',
  '--layout-nav-item-height',
  '--layout-page-head-padding',
  '--layout-page-padding',
  '--layout-section-gap',
  '--layout-hero-min-height',
  '--layout-hero-padding',
  '--layout-stats-columns',
  '--layout-content-columns',
  '--layout-grid-gap',
  '--layout-card-head-padding',
  '--layout-card-body-padding',
  '--layout-stat-padding',
  '--layout-project-row-gap',
  '--layout-project-row-padding',
  '--layout-chart-height',
  '--layout-focus-card-min-width',
];
const requiredTokenSet = new Set(requiredTokens);

function fail(message) {
  failures.push(message);
}

function withoutComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
}

function declarations(body, fileName) {
  const entries = [];
  for (const part of body.split(';')) {
    const declaration = part.trim();
    if (!declaration) continue;
    const separator = declaration.indexOf(':');
    if (separator === -1) {
      fail(`${fileName}: 올바르지 않은 선언 "${declaration}"`);
      continue;
    }
    entries.push([declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim()]);
  }
  return entries;
}

if (!fs.existsSync(themeDir)) {
  console.error('FAIL Layout theme directory not found.');
  process.exit(1);
}

const html = fs.readFileSync(labHtmlPath, 'utf8');
const baseCssPath = path.join(themeDir, 'base.css');
if (!fs.existsSync(baseCssPath)) fail('layout-themes/base.css가 없습니다.');
const baseCss = fs.existsSync(baseCssPath) ? fs.readFileSync(baseCssPath, 'utf8') : '';
const themeFiles = fs.readdirSync(themeDir)
  .filter((file) => file.endsWith('.css') && file !== 'base.css')
  .sort();

if (!themeFiles.length) fail('레이아웃 테마 CSS 파일이 없습니다.');

const themeNames = [];
for (const fileName of themeFiles) {
  const themeName = path.basename(fileName, '.css');
  const css = withoutComments(fs.readFileSync(path.join(themeDir, fileName), 'utf8'));
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)}/g)];
  themeNames.push(themeName);

  if (rules.length !== 1 || css.replace(/([^{}]+)\{([^{}]*)}/g, '').trim()) {
    fail(`${fileName}: 테마 규칙은 정확히 하나여야 합니다.`);
    continue;
  }

  const selector = rules[0][1].replace(/\s+/g, '');
  const expectedSelector = `.theme_lab[data-layout-theme="${themeName}"]`;
  if (selector !== expectedSelector) fail(`${fileName}: 선택자는 ${expectedSelector} 이어야 합니다.`);
  if (/@import|!important|url\s*\(/i.test(css)) fail(`${fileName}: @import, !important, url()은 사용할 수 없습니다.`);

  const entries = declarations(rules[0][2], fileName);
  const seen = new Set();
  for (const [property, value] of entries) {
    if (seen.has(property)) fail(`${fileName}: ${property}가 중복 선언됐습니다.`);
    seen.add(property);
    if (!requiredTokenSet.has(property)) fail(`${fileName}: 승인되지 않은 속성 ${property}`);
    if (/#[\da-f]{3,8}\b|rgba?\s*\(|hsla?\s*\(|oklch?\s*\(|\blab\s*\(|\blch\s*\(|color(?:-mix)?\s*\(/i.test(value)) {
      fail(`${fileName}: 레이아웃 파일에는 컬러값을 사용할 수 없습니다 (${property}).`);
    }
  }
  for (const token of requiredTokens) {
    if (!seen.has(token)) fail(`${fileName}: 필수 토큰 ${token}이 없습니다.`);
  }
}

const linkedThemes = [...html.matchAll(/href="layout-themes\/([\w-]+)\.css"/g)]
  .map((match) => match[1])
  .filter((name) => name !== 'base');
const selectableThemes = [...html.matchAll(/data-layout="([\w-]+)"/g)].map((match) => match[1]);

for (const themeName of themeNames) {
  if (!linkedThemes.includes(themeName)) fail(`${themeName}.css: 실험실 <link>에 등록되지 않았습니다.`);
  if (!selectableThemes.includes(themeName)) fail(`${themeName}.css: 실험실 선택 목록에 등록되지 않았습니다.`);
}
for (const themeName of new Set([...linkedThemes, ...selectableThemes])) {
  if (!themeNames.includes(themeName)) fail(`${themeName}: 대응하는 레이아웃 CSS 파일이 없습니다.`);
}

const defaultTheme = html.match(/<body[^>]+data-layout-theme="([\w-]+)"/)?.[1];
if (!defaultTheme || !themeNames.includes(defaultTheme)) fail('실험실 기본 레이아웃이 유효한 테마가 아닙니다.');
for (const token of requiredTokens) {
  if (!baseCss.includes(`var(${token})`)) fail(`${token}: layout base CSS에서 사용되지 않습니다.`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  const appearanceCount = new Set([...html.matchAll(/data-appearance="([\w-]+)"/g)].map((match) => match[1])).size;
  const colorCount = new Set([...html.matchAll(/<button[^>]+data-color-theme="([\w-]+)"/g)].map((match) => match[1])).size;
  const schemeCount = new Set([...html.matchAll(/data-scheme="([\w-]+)"/g)].map((match) => match[1])).size;
  const combinations = themeNames.length * appearanceCount * colorCount * schemeCount;
  console.log(
    `Layout theme contract: ${themeNames.length}/${themeNames.length} passed ` +
      `(${themeNames.join(', ')}; ${combinations} total theme combinations gated).`,
  );
}
