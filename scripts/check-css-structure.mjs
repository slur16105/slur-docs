// CSS 파일 책임과 실제 링크를 검사한다. 단순 파일 이동만으로 검증을 통과시키지 않는다.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const screens = 'skill/slur-design/assets/patterns/screens';
const pages = ['system/demo.html', ...readdirSync(resolve(root, screens)).filter((p) => p.endsWith('.html')).map((p) => `${screens}/${p}`)];
// 배포 전 기본 토큰의 생성 결과와 표시 형식을 확인한다.
const designGlobal = postcss.parse(read('skill/slur-design/assets/css/global.css'));
const defaultRoots = designGlobal.nodes.filter((node) => node.type === 'rule' && node.selector === ':root');
assert.equal(defaultRoots.length, 1, 'global.css: 조건 없는 기본 :root는 하나');
assert.equal(designGlobal.nodes.find((node) => node.type !== 'comment'), defaultRoots[0], '기본 토큰은 상단에 배치');
const tokenLines = new Set();
for (const decl of defaultRoots[0].nodes.filter((node) => node.type === 'decl')) {
  assert(decl.prop.startsWith('--'), '기본 :root에는 토큰만 선언');
  assert.equal(decl.source.start.line, decl.source.end.line, '토큰 선언은 한 줄');
  assert(!tokenLines.has(decl.source.start.line), '한 줄에 토큰 하나');
  tokenLines.add(decl.source.start.line);
  const line = designGlobal.source.input.css.split('\n')[decl.source.start.line - 1];
  assert(/^ {4}--/.test(line), '토큰은 공백 4칸 들여쓰기');
}
let rules = 0;
for (const htmlPath of pages) {
  const html = read(htmlPath);
  const links = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map((m) => m[1]).filter((url) => !/^https?:/.test(url));
  assert.deepEqual(links.map((p) => basename(p)), ['global.css', 'common.css', 'page.css'], `${htmlPath}: CSS 로드 순서`);
  assert(!/<style\b/i.test(html), `${htmlPath}: 페이지 스타일은 page.css에서 관리`);
  const paths = links.map((p) => resolve(root, dirname(htmlPath), p));
  for (const p of paths) assert(existsSync(p), `${htmlPath}: 누락된 CSS ${p}`);
  const pageClasses = [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((name) => name.startsWith('page_'));
  const scopes = [...new Set(pageClasses)];
  assert.equal(scopes.length, 1, `${htmlPath}: 화면의 page_ 루트 확인`);
  const scope = `.${scopes[0]}`;
  const css = postcss.parse(readFileSync(paths[2], 'utf8'), { from: paths[2] });
  css.walkAtRules('import', () => assert.fail(`${htmlPath}: 런타임 @import 금지`));
  css.walkRules((rule) => {
    // 키프레임의 from/to/%는 DOM 선택자가 아니다.
    if (rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
    for (const selector of rule.selectors) {
      const prefix = selector.replace(/^\[data-theme=["'](?:dark|light)["']\]\s+/, '');
      assert(prefix.startsWith(scope) && /^(?:$|[\s.:[>+~])/.test(prefix.slice(scope.length)), `${htmlPath}: 페이지 범위를 벗어난 선택자 ${selector}`);
    }
    rules++;
  });
  css.walkDecls((decl) => assert(!decl.prop.startsWith('--'), `${htmlPath}: 시스템 토큰 정의는 global.css에서 관리`));
}
const global = postcss.parse(read('skill/slur-guidelines/assets/global.css'));
global.walkRules((rule) => assert(!rule.selector.includes('.i_status'), '4상태 컴포넌트는 common.css에서 관리'));
const common = read('skill/slur-guidelines/assets/common.css');
assert(common.includes('[data-state="loading"] > .i_status > .i_loading'), 'common.css에 4상태 노출 규칙 필요');
console.log(`CSS responsibility contract: ${pages.length} pages, ${rules} scoped rules, load order and file paths passed.`);
