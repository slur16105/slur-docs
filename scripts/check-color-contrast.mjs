import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokenPath = path.join(root, 'skill/slur-design/assets/tokens/colors.css');
const css = fs.readFileSync(tokenPath, 'utf8');

function declarations(body) {
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
}

const light = {};
for (const match of css.matchAll(/:root\s*{([\s\S]*?)}/g)) Object.assign(light, declarations(match[1]));
const themes = { light };
for (const match of css.matchAll(/\[data-theme=["']([\w-]+)["']\]\s*{([\s\S]*?)}/g)) {
  const [, name, body] = match;
  if (themes[name]) throw new Error(`Duplicate color theme: ${name}`);
  themes[name] = { ...light, ...declarations(body) };
}
if (!themes.dark) throw new Error('Dark theme token block not found.');

function parseColor(value) {
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i)?.[1];
  if (hex) {
    const expanded = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex;
    const channels = expanded.match(/[\da-f]{2}/gi).map((channel) => parseInt(channel, 16));
    return { r: channels[0], g: channels[1], b: channels[2], a: (channels[3] ?? 255) / 255 };
  }
  const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+)%?)?\s*\)$/i);
  if (rgb) return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: rgb[4] === undefined ? 1 : Number(rgb[4]) };
  throw new Error(`Unsupported color value: ${value}`);
}

function color(theme, token, seen = new Set()) {
  if (seen.has(token)) throw new Error(`Circular token reference: ${[...seen, token].join(' -> ')}`);
  const value = themes[theme][token];
  if (!value) throw new Error(`Missing ${theme} token: ${token}`);
  const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return alias ? color(theme, alias, new Set([...seen, token])) : parseColor(value);
}

function composite(foreground, background) {
  const alpha = foreground.a + background.a * (1 - foreground.a);
  return {
    r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
    g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
    b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
    a: alpha,
  };
}

function opaque(theme, token, under = '--color-surface-card') {
  const value = color(theme, token);
  return value.a === 1 ? value : composite(value, color(theme, under));
}

function luminance({ r, g, b }) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const checks = [];
function add(theme, foreground, background, minimum, kind, backgroundUnder) {
  checks.push({
    theme,
    foreground,
    background,
    minimum,
    kind,
    ratio: contrast(opaque(theme, foreground), opaque(theme, background, backgroundUnder)),
  });
}

for (const theme of Object.keys(themes)) {
  const surfaces = ['--color-surface-page', '--color-surface-card', '--color-surface-sunken', '--color-surface-hover'];
  for (const foreground of ['--color-text-primary', '--color-text-secondary', '--color-text-muted']) {
    for (const background of surfaces) add(theme, foreground, background, 4.5, 'normal text');
  }
  for (const background of [...surfaces, '--color-brand-soft']) add(theme, '--color-text-brand', background, 4.5, 'brand text');

  const softSurfaces = ['--color-brand-soft', '--color-success-soft', '--color-warning-soft', '--color-danger-soft'];
  for (const foreground of ['--color-text-primary', '--color-text-secondary', '--color-text-muted']) {
    for (const background of softSurfaces) add(theme, foreground, background, 4.5, 'text on soft surface');
  }

  for (const status of ['success', 'warning', 'danger']) {
    for (const background of ['--color-surface-page', '--color-surface-card', '--color-surface-sunken', `--color-${status}-soft`]) {
      add(theme, `--color-${status}`, background, 4.5, 'status text');
    }
    add(theme, `--color-on-${status}`, `--color-${status}-solid`, 4.5, 'text on solid status');
    add(theme, `--color-${status}-on-inverse`, '--color-surface-inverse', 4.5, 'status on inverse');
    add(theme, `--color-${status}-solid`, '--color-surface-card', 3, 'solid status boundary');
  }

  for (const background of ['--color-brand', '--color-brand-hover', '--color-brand-active']) {
    add(theme, '--color-on-brand', background, 4.5, 'text on brand');
  }
  add(theme, '--color-text-inverse', '--color-surface-inverse', 4.5, 'inverse text');

  for (const foreground of ['--color-border-default', '--color-border-strong', '--color-border-focus']) {
    for (const background of ['--color-surface-page', '--color-surface-card', '--color-surface-sunken']) {
      add(theme, foreground, background, 3, 'UI boundary/focus');
    }
  }
  add(theme, '--color-brand', '--color-surface-card', 3, 'selected control');
  add(theme, '--color-surface-card', '--color-border-strong', 3, 'switch knob');
  for (let index = 1; index <= 5; index += 1) add(theme, `--color-chart-${index}`, '--color-surface-card', 3, 'chart mark');
}

const failures = checks.filter((check) => check.ratio + Number.EPSILON < check.minimum);
if (failures.length) {
  for (const check of failures) {
    console.error(
      `FAIL ${check.theme} ${check.kind}: ${check.foreground} / ${check.background} = ${check.ratio.toFixed(2)}:1 (needs ${check.minimum}:1)`,
    );
  }
  process.exitCode = 1;
} else {
  const textMinimum = Math.min(...checks.filter((check) => check.minimum === 4.5).map((check) => check.ratio));
  const uiMinimum = Math.min(...checks.filter((check) => check.minimum === 3).map((check) => check.ratio));
  console.log(
    `WCAG AA color contrast: ${checks.length}/${checks.length} passed ` +
      `(normal text min ${textMinimum.toFixed(2)}:1, UI/focus/chart min ${uiMinimum.toFixed(2)}:1).`,
  );
}
