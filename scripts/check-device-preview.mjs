import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { devices, previewGeometry } from '../docs-internal/device-preview.mjs';

let checks = 0;
for (const available of [288, 390, 720, 970, 1440, 1920]) {
  for (const [name, preset] of Object.entries(devices)) {
    for (const view of ['fit', 'actual']) {
      const result = previewGeometry(name, view, available, 2500);
      assert.equal(result.width, preset.width);
      assert.equal(result.height, preset.height);
      assert.equal(result.displayWidth, result.width * result.scale);
      assert.equal(result.displayHeight, result.height * result.scale);
      assert.ok(result.scale > 0 && result.scale <= 1);
      if (view === 'fit') assert.ok(result.displayWidth <= available + 1e-9);
      else assert.equal(result.scale, 1);
      checks++;
    }
  }
  const auto = previewGeometry('auto', 'fit', available, 1800.4);
  assert.equal(auto.width, Math.max(320, available));
  assert.equal(auto.height, 1801);
  assert.equal(auto.scale, Math.min(1, available / 320));
  checks++;
}
assert.equal(previewGeometry('desktop', 'fit', 0).width, 1440);
const html = readFileSync(new URL('../docs-internal/appearance-theme-lab.html', import.meta.url), 'utf8');
assert.deepEqual([...html.matchAll(/data-device="([\w-]+)"/g)].map((match) => match[1]), ['auto', ...Object.keys(devices)]);
assert.deepEqual([...html.matchAll(/data-preview-scale="([\w-]+)"/g)].map((match) => match[1]), ['fit', 'actual']);
console.log(`Device preview geometry: ${checks} cases passed.`);
