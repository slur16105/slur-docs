import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeDir = path.join(root, 'docs-internal/appearance-themes');
const labHtmlPath = path.join(root, 'docs-internal/appearance-theme-lab.html');
const labCssPath = path.join(root, 'docs-internal/appearance-theme-lab.css');
const baseCssPath = path.join(themeDir, 'base.css');

const requiredTokens = [
  '--appearance-control-radius',
  '--appearance-item-radius',
  '--appearance-container-radius',
  '--appearance-shell-radius',
  '--appearance-card-shadow',
  '--appearance-raised-shadow',
  '--appearance-floating-shadow',
  '--appearance-border-width',
  '--appearance-border',
  '--appearance-card-hover-shift',
];
const requiredTokenSet = new Set(requiredTokens);
const failures = [];

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

if (!fs.existsSync(themeDir)) throw new Error('Appearance theme directory not found.');
const html = fs.readFileSync(labHtmlPath, 'utf8');
const labCss = fs.readFileSync(labCssPath, 'utf8');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
const themeFiles = fs.readdirSync(themeDir)
  .filter((file) => file.endsWith('.css') && file !== 'base.css')
  .sort();

if (!themeFiles.length) fail('외형 테마 CSS 파일이 없습니다.');

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
  const expectedSelector = `.theme_lab[data-appearance-theme="${themeName}"]`;
  if (selector !== expectedSelector) {
    fail(`${fileName}: 선택자는 ${expectedSelector} 이어야 합니다.`);
  }

  if (/@import|!important|url\s*\(/i.test(css)) {
    fail(`${fileName}: @import, !important, url()은 사용할 수 없습니다.`);
  }

  const entries = declarations(rules[0][2], fileName);
  const seen = new Set();
  for (const [property, value] of entries) {
    if (seen.has(property)) fail(`${fileName}: ${property}가 중복 선언됐습니다.`);
    seen.add(property);

    if (!requiredTokenSet.has(property)) {
      fail(`${fileName}: 승인되지 않은 속성 ${property}`);
    }
    if (/#[\da-f]{3,8}\b|rgba?\s*\(|hsla?\s*\(|oklch?\s*\(|\blab\s*\(|\blch\s*\(|color(?:-mix)?\s*\(/i.test(value)) {
      fail(`${fileName}: 원시 컬러값과 컬러 함수는 사용할 수 없습니다 (${property}).`);
    }
  }

  for (const token of requiredTokens) {
    if (!seen.has(token)) fail(`${fileName}: 필수 토큰 ${token}이 없습니다.`);
  }

  const border = Object.fromEntries(entries)['--appearance-border'];
  if (border && !/^var\(--color-border-(?:subtle|default|strong)\)$/.test(border)) {
    fail(`${fileName}: --appearance-border는 검증된 시맨틱 border 토큰만 참조해야 합니다.`);
  }
}

const linkedThemes = [...html.matchAll(/href="appearance-themes\/([\w-]+)\.css"/g)]
  .map((match) => match[1])
  .filter((name) => name !== 'base');
const selectableThemes = [...html.matchAll(/data-appearance="([\w-]+)"/g)].map((match) => match[1]);

for (const themeName of themeNames) {
  if (!linkedThemes.includes(themeName)) fail(`${themeName}.css: 실험실 <link>에 등록되지 않았습니다.`);
  if (!selectableThemes.includes(themeName)) fail(`${themeName}.css: 실험실 선택 목록에 등록되지 않았습니다.`);
}
for (const themeName of new Set([...linkedThemes, ...selectableThemes])) {
  if (!themeNames.includes(themeName)) fail(`${themeName}: 대응하는 외형 CSS 파일이 없습니다.`);
}

const defaultTheme = html.match(/<body[^>]+data-appearance-theme="([\w-]+)"/)?.[1];
if (!defaultTheme || !themeNames.includes(defaultTheme)) fail('실험실 기본 외형이 유효한 테마가 아닙니다.');

const consumedCss = `${baseCss}\n${labCss}`;
for (const token of requiredTokens) {
  if (!consumedCss.includes(`var(${token})`)) fail(`${token}: base 또는 lab CSS에서 사용되지 않습니다.`);
}
if (!/\.theme_lab\s+\.lab_segment\s+\.i_option:focus-visible\s*{[^}]*box-shadow\s*:\s*var\(--color-focus-ring\)/.test(withoutComments(labCss))) {
  fail('실험실 외형 선택 버튼의 포커스 링 보호 규칙이 없습니다.');
}

const schemes = [...html.matchAll(/data-scheme="([\w-]+)"/g)].map((match) => match[1]);
for (const requiredScheme of ['light', 'dark']) {
  if (!schemes.includes(requiredScheme)) fail(`컬러 모드 ${requiredScheme}가 실험실에 없습니다.`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  const combinations = themeNames.length * new Set(schemes).size;
  console.log(
    `Appearance theme contract: ${themeNames.length}/${themeNames.length} passed ` +
      `(${themeNames.join(', ')}; ${combinations} light/dark combinations gated).`,
  );
}
