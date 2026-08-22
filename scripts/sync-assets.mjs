// skill/(두 스킬 원본)과 system/demo.html을 public/으로 복사해 사이트가 같은 경로로 서빙한다 —
//   https://docs.slur.co.kr/skill/slur-design/assets/patterns/screens/login.html
//   https://docs.slur.co.kr/system/demo.html
// 원본은 한 곳(skill/, system/)에만 두고, 복사본(public/skill, public/system)은 gitignore.
// 조립본 HTML이 ../../../../slur-guidelines/... 식 상대경로로 두 스킬을 넘나들므로 트리 전체를 그대로 옮긴다.
// 함께 만드는 것: public/skill/slur-skills.tar.gz(두 스킬 폴더 묶음 — install.sh가 받아서 푼다) +
// public/skill/manifest.txt(파일 목록, 참고용) + public/skill/install.sh(scripts/install.sh 복사) —
// 저장소가 비공개라 사이트가 스킬의 공개 배포 경로다. 묶음으로 배포하는 이유: Cloudflare가 HTML 응답의
// 이메일을 난독화(email-protection)해 파일을 하나씩 받으면 조립본 HTML이 원본과 달라진다 — tar.gz는 그대로 온다.
//
// 실행 시점: astro.config.mjs의 통합(slur-sync-assets, astro:config:setup 훅)이 dev·build 시작마다 부른다 —
// 빌드 명령이 `npm run build`든 `astro build`든 같이 돈다. 수동 실행: `node scripts/sync-assets.mjs`.
import { cpSync, rmSync, mkdirSync, readdirSync, writeFileSync, copyFileSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const keep = (p) => !p.endsWith('.DS_Store');

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = join(dir, d.name);
  return d.isDirectory() ? walk(p) : keep(p) ? [p] : [];
});

/* ustar 묶음 — 의존성 없이 tar.gz를 만든다(512바이트 헤더 + 512 정렬 본문 + 끝 0블록 둘).
   항목은 파일만(tar -x가 상위 폴더를 만든다), 권한 0644, 경로는 100자 이하(넘으면 prefix 필드). */
const tarEntry = (name, body, mtime) => {
  const head = Buffer.alloc(512, 0);
  let base = name, prefix = '';
  if (Buffer.byteLength(base) > 100) { const i = name.lastIndexOf('/', 100); prefix = name.slice(0, i); base = name.slice(i + 1); }
  head.write(base, 0, 100, 'utf8');
  head.write('0000644\0', 100, 8, 'ascii');
  head.write('0000000\0', 108, 8, 'ascii');
  head.write('0000000\0', 116, 8, 'ascii');
  head.write(body.length.toString(8).padStart(11, '0') + '\0', 124, 12, 'ascii');
  head.write(mtime.toString(8).padStart(11, '0') + '\0', 136, 12, 'ascii');
  head.write('        ', 148, 8, 'ascii');
  head.write('0', 156, 1, 'ascii');
  head.write('ustar\0', 257, 6, 'ascii');
  head.write('00', 263, 2, 'ascii');
  head.write(prefix, 345, 155, 'utf8');
  let sum = 0; for (const b of head) sum += b;
  head.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii');
  const pad = Buffer.alloc((512 - (body.length % 512)) % 512, 0);
  return Buffer.concat([head, body, pad]);
};
const tarGz = (rootDir, relFiles) => gzipSync(Buffer.concat([
  ...relFiles.map((f) => tarEntry(f, readFileSync(join(rootDir, f)), Math.floor(statSync(join(rootDir, f)).mtimeMs / 1000))),
  Buffer.alloc(1024, 0),
]));

export function syncAssets() {
  const pub = join(root, 'public');
  rmSync(join(pub, 'skill'), { recursive: true, force: true });
  rmSync(join(pub, 'system'), { recursive: true, force: true });

  cpSync(join(root, 'skill'), join(pub, 'skill'), { recursive: true, filter: keep });
  mkdirSync(join(pub, 'system'), { recursive: true });
  copyFileSync(join(root, 'system', 'demo.html'), join(pub, 'system', 'demo.html'));

  // VERSION — 설치본이 몇 버전인지 알 수 있게(P2-24). package.json의 버전(= changelog 정본)을 각 스킬 폴더와 /skill/ 루트에 쓴다.
  // 저장소 원본(skill/)에는 없고 복사본·tar.gz에만 들어간다 — 버전마다 원본 파일이 바뀌지 않는다.
  const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
  for (const dir of ['slur-guidelines', 'slur-design']) writeFileSync(join(pub, 'skill', dir, 'VERSION'), version + '\n');
  writeFileSync(join(pub, 'skill', 'VERSION'), version + '\n');

  // 묶음은 복사본(public/skill)에서 만든다 — VERSION이 들어가도록. manifest·tar.gz·install.sh 자신은 제외.
  const files = walk(join(pub, 'skill')).map((p) => relative(join(pub, 'skill'), p).split('\\').join('/')).filter((f) => !/^(manifest\.txt|slur-skills\.tar\.gz|install\.sh|VERSION)$/.test(f)).sort();
  writeFileSync(join(pub, 'skill', 'manifest.txt'), files.join('\n') + '\n');
  writeFileSync(join(pub, 'skill', 'slur-skills.tar.gz'), tarGz(join(pub, 'skill'), files));
  copyFileSync(join(root, 'scripts', 'install.sh'), join(pub, 'skill', 'install.sh'));

  console.log(`[sync-assets] skill/ (${files.length} files incl. VERSION ${version}, slur-skills.tar.gz) + system/demo.html → public/`);
  return files.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) syncAssets();
