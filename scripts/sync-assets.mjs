// skill/(두 스킬 원본)과 system/demo.html을 public/으로 복사해 사이트가 같은 경로로 서빙한다 —
//   https://docs.slur.co.kr/skill/slur-design/assets/patterns/screens/login.html
//   https://docs.slur.co.kr/system/demo.html
// 원본은 한 곳(skill/, system/)에만 두고, 복사본(public/skill, public/system)은 gitignore.
// 조립본 HTML이 ../../../../slur-guidelines/... 식 상대경로로 두 스킬을 넘나들므로 트리 전체를 그대로 옮긴다.
// 함께 만드는 것: public/skill/manifest.txt(파일 목록) + public/skill/install.sh(scripts/install.sh 복사) —
// 저장소가 비공개라 사이트가 스킬의 공개 배포 경로다.
//
// 실행 시점: astro.config.mjs의 통합(slur-sync-assets, astro:config:setup 훅)이 dev·build 시작마다 부른다 —
// 빌드 명령이 `npm run build`든 `astro build`든 같이 돈다. 수동 실행: `node scripts/sync-assets.mjs`.
import { cpSync, rmSync, mkdirSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const keep = (p) => !p.endsWith('.DS_Store');

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = join(dir, d.name);
  return d.isDirectory() ? walk(p) : keep(p) ? [p] : [];
});

export function syncAssets() {
  const pub = join(root, 'public');
  rmSync(join(pub, 'skill'), { recursive: true, force: true });
  rmSync(join(pub, 'system'), { recursive: true, force: true });

  cpSync(join(root, 'skill'), join(pub, 'skill'), { recursive: true, filter: keep });
  mkdirSync(join(pub, 'system'), { recursive: true });
  copyFileSync(join(root, 'system', 'demo.html'), join(pub, 'system', 'demo.html'));

  const files = walk(join(root, 'skill')).map((p) => relative(join(root, 'skill'), p).split('\\').join('/')).sort();
  writeFileSync(join(pub, 'skill', 'manifest.txt'), files.join('\n') + '\n');
  copyFileSync(join(root, 'scripts', 'install.sh'), join(pub, 'skill', 'install.sh'));

  console.log(`[sync-assets] skill/ (${files.length} files) + system/demo.html → public/`);
  return files.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) syncAssets();
