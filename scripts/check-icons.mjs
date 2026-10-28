// Verify SLUR's inline icons against the pinned upstream SVG geometry.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const screens = 'skill/slur-design/assets/patterns/screens';
const files = ['system/demo.html', 'skill/slur-design/assets/js/file-upload.js',
  ...readdirSync(join(root, screens)).filter(n => n.endsWith('.html')).map(n => `${screens}/${n}`)];
const vendor = join(root, 'skill/slur-design/assets/vendor/lucide/1.63.0');
const normalize = s => s.replace(/\s+/g, ' ').trim();
let count = 0;
const errors = [];
for (const file of files) {
  const text = readFileSync(join(root, file), 'utf8');
  for (const [, attrs, body] of text.matchAll(/<svg\b([^>]*)>(.*?)<\/svg>/gs)) {
    const name = attrs.match(/data-icon="([a-z0-9-]+)"/)?.[1];
    if (!name) { errors.push(`${file}: inline SVG has no official icon name`); continue; }
    try {
      const source = readFileSync(join(vendor, 'icons', `${name}.svg`), 'utf8');
      const expected = source.match(/<svg\b[^>]*>(.*?)<\/svg>/s)[1];
      if (normalize(body) !== normalize(expected)) errors.push(`${file}: ${name} geometry differs from upstream`);
    } catch { errors.push(`${file}: missing source for ${name}`); }
    for (const attr of ['viewBox="0 0 24 24"', 'fill="none"', 'stroke="currentColor"', 'stroke-width="2"', 'stroke-linecap="round"', 'stroke-linejoin="round"', 'aria-hidden="true"', 'focusable="false"']) {
      if (!attrs.includes(attr)) errors.push(`${file}: ${name} missing ${attr}`);
    }
    if (/\s(?:width|height)=/.test(attrs)) errors.push(`${file}: ${name} uses fixed dimensions`);
    count++;
  }
}
const license = readFileSync(join(vendor, 'LICENSE'), 'utf8');
if (!license.includes('ISC License') || !license.includes('The MIT License')) errors.push('Missing upstream license notices');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${count} inline Lucide icons against 1.63.0 sources and license notices.`);
