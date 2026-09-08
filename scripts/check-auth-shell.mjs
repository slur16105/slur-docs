import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = path.join(root, 'skill/slur-design/assets/patterns/auth-shell.css');
const docsPath = path.join(root, 'src/content/docs/design/screens.mdx');
const skillPath = path.join(root, 'skill/slur-design/SKILL.md');
const failures = [];

function fail(message) {
  failures.push(message);
}

function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function ruleBodies(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^{}]*)\\}`, 'g'))].map((match) => match[1]);
}

function declarations(body) {
  return Object.fromEntries(
    body.split(';').map((part) => part.trim()).filter(Boolean).map((declaration) => {
      const separator = declaration.indexOf(':');
      return [declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim()];
    }),
  );
}

function expectDeclaration(rules, selector, property, expected) {
  const actual = declarations(rules[0] ?? '')[property];
  if (actual !== expected) fail(`${selector}: ${property}는 "${expected}"이어야 합니다 (현재: "${actual ?? '없음'}").`);
}

const css = withoutComments(fs.readFileSync(cssPath, 'utf8'));
const layoutRules = ruleBodies(css, '.layout_auth');
const brandRules = ruleBodies(css, '.layout_auth .l_brand');
const footRules = ruleBodies(css, '.layout_auth .l_foot');
const layoutDeclarations = declarations(layoutRules[0] ?? '');

if (!layoutRules.length) fail('auth-shell.css에 .layout_auth 규칙이 없습니다.');
if (!brandRules.length) fail('auth-shell.css에 .layout_auth .l_brand 규칙이 없습니다.');
if (!footRules.length) fail('auth-shell.css에 .layout_auth .l_foot 규칙이 없습니다.');

expectDeclaration(layoutRules, '.layout_auth', 'display', 'flex');
expectDeclaration(layoutRules, '.layout_auth', 'min-height', '100vh');
expectDeclaration(layoutRules, '.layout_auth', 'flex-direction', 'column');
expectDeclaration(layoutRules, '.layout_auth', 'align-items', 'center');
expectDeclaration(layoutRules, '.layout_auth', 'justify-content', 'center');
expectDeclaration(brandRules, '.layout_auth .l_brand', 'margin', '0 0 28px');
expectDeclaration(footRules, '.layout_auth .l_foot', 'margin', '24px 0 0');

if ('height' in layoutDeclarations) fail('.layout_auth: 긴 콘텐츠가 상단부터 흐르도록 고정 height를 사용할 수 없습니다.');
if (['hidden', 'clip'].includes(layoutDeclarations.overflow)) fail('.layout_auth: 긴 콘텐츠를 자르는 overflow 값을 사용할 수 없습니다.');

for (const [selector, bodies] of [['.layout_auth .l_brand', brandRules], ['.layout_auth .l_foot', footRules]]) {
  if (bodies.some((body) => /\bauto\b/.test(body))) fail(`${selector}: 선택 슬롯의 여백에 auto를 사용할 수 없습니다.`);
}

for (const [fileName, filePath] of [['design/screens.mdx', docsPath], ['slur-design/SKILL.md', skillPath]]) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (!source.includes('`l_main`은 필수')) fail(`${fileName}: l_main 필수 슬롯 설명이 없습니다.`);
  if (!source.includes('`l_brand`·`l_foot`은 선택')) fail(`${fileName}: l_brand·l_foot 선택 슬롯 설명이 없습니다.`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Auth shell contract: footer 유무와 무관한 중앙 정렬 및 필수·선택 슬롯 문서화 통과.');
}
