// 저작 원본을 브라우저용 두 공통 파일로 묶는다. 설치된 두 스킬에서도 실행 가능.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const base = new URL('../assets/', import.meta.url);
const read = (path) => readFileSync(new URL(path, base), 'utf8');
const tokens = ['colors', 'typography', 'spacing', 'radius', 'shadows', 'motion', 'breakpoints', 'z-index'];
const components = ['button', 'input', 'select', 'selection', 'badge', 'card', 'alert', 'navigation', 'table', 'modal', 'toast', 'state', 'menu', 'tooltip', 'pagination'];
export function buildCss() {
  const files = {
    global: ['../../slur-guidelines/assets/global.css', ...tokens.map((name) => `tokens/${name}.css`)],
    common: ['../../slur-guidelines/assets/common.css', 'patterns/app-shell.css', 'patterns/auth-shell.css', ...components.map((name) => `components/${name}.css`)],
  };
  mkdirSync(new URL('css/', base), { recursive: true });
  for (const [name, sources] of Object.entries(files)) {
    const css = '/* 자동 생성: skill/slur-design/scripts/build-css.mjs — 원본을 수정한 뒤 재생성하세요. */\n' + sources.map((path) => `\n/* SOURCE: ${path} */\n${read(path)}`).join('\n');
    writeFileSync(new URL(`css/${name}.css`, base), css);
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) buildCss();
