// 저작 원본을 브라우저용 두 공통 파일로 묶는다. 설치된 두 스킬에서도 실행 가능.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const base = new URL('../assets/', import.meta.url);
const read = (path) => readFileSync(new URL(path, base), 'utf8');
const tokens = ['colors', 'typography', 'spacing', 'radius', 'shadows', 'motion', 'breakpoints', 'z-index'];
const components = ['button', 'input', 'select', 'selection', 'badge', 'card', 'alert', 'navigation', 'table', 'modal', 'toast', 'state', 'menu', 'tooltip', 'pagination'];
// 중첩 조건·문자열·주석 안의 :root를 기본 토큰으로 합치지 않는다.
function topLevelRoots(css) {
  const offsets = new Set();
  let depth = 0, quote = '', comment = false;
  for (let i = 0; i < css.length; i++) {
    const c = css[i], next = css[i + 1];
    if (comment) {
      if (c === '*' && next === '/') { comment = false; i++; }
      continue;
    }
    if (quote) {
      if (c === '\\') { i++; continue; }
      if (c === quote) quote = '';
      continue;
    }
    if (c === '/' && next === '*') { comment = true; i++; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (depth === 0 && css.startsWith(':root', i)) offsets.add(i);
    if (c === '{') depth++;
    if (c === '}') depth--;
  }
  return offsets;
}
export function buildCss() {
  const files = {
    global: ['../../slur-guidelines/assets/global.css', ...tokens.map((name) => `tokens/${name}.css`)],
    common: ['../../slur-guidelines/assets/common.css', 'patterns/app-shell.css', 'patterns/auth-shell.css', ...components.map((name) => `components/${name}.css`)],
  };
  mkdirSync(new URL('css/', base), { recursive: true });
  for (const [name, sources] of Object.entries(files)) {
    let css = '/* 자동 생성: skill/slur-design/scripts/build-css.mjs — 원본을 수정한 뒤 재생성하세요. */\n' + sources.map((path) => `\n/* SOURCE: ${path} */\n${read(path)}`).join('\n');
    if (name === 'global') {
      // 동봉 토큰 원본의 최상위 기본 :root만 합친다. 조건부/테마 선택자는 그대로 둔다.
      // 원본 계약: 기본 :root는 평평한 사용자 정의 속성 선언과 주석만 포함한다.
      const groups = [];
      const roots = topLevelRoots(css);
      css = css.replace(/^:root[ \t]*\{([^{}]*)\}/gm, (block, body, offset) => {
        if (!roots.has(offset)) return block;
        const declarations = body.replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (!declarations.split(';').filter((part) => part.trim()).every((part) => /^\s*--[\w-]+\s*:/.test(part))) {
          throw new Error('기본 :root에는 토큰 선언만 사용할 수 있습니다.');
        }
        groups.push(body.trim().split('\n').map((line) => line.trim() ? '    ' + line.trim() : '').join('\n'));
        return '';
      });
      if (groups.length) css = ':root {\n' + groups.join('\n\n') + '\n}\n\n' + css.trimEnd() + '\n';
    }
    writeFileSync(new URL(`css/${name}.css`, base), css);
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) buildCss();
