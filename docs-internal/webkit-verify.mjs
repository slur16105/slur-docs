// 새 부품(메뉴·툴팁·페이지네이션·앱 셸 드로어·탭·모달·토스트·테마·4상태) WebKit/Chromium 재검증 대본 — v1.11.2(2026-08-22)
// 사용: node docs-internal/webkit-verify.mjs <출력폴더> [webkit|chromium]
//   playwright는 프로젝트 의존성이 아니므로 `npx playwright@1.62 install webkit` 뒤 npx 캐시에서 찾거나 PLAYWRIGHT_DIR로 지정
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
function findPlaywright() {
  if (process.env.PLAYWRIGHT_DIR) return process.env.PLAYWRIGHT_DIR;
  try { return dirname(createRequire(import.meta.url).resolve('playwright/package.json')); } catch {}
  const npx = join(process.env.HOME, '.npm', '_npx');
  if (existsSync(npx)) for (const d of readdirSync(npx)) { const p = join(npx, d, 'node_modules', 'playwright'); if (existsSync(p)) return p; }
  throw new Error('playwright를 찾지 못함 — PLAYWRIGHT_DIR 지정');
}
const pw = createRequire(join(findPlaywright(), 'package.json'))('playwright');
const ENGINE = process.argv[3] || 'webkit';
const OUT = process.argv[2] || join(here, '.verify-out');
mkdirSync(join(OUT, 'shots'), { recursive: true });
const DEMO = `file://${ROOT}/system/demo.html`;
const SCREENS = `file://${ROOT}/skill/slur-design/assets/patterns/screens`;
const results = [];
const R = (group, name, pass, detail='') => { results.push({ group, name, pass: !!pass, detail: String(detail) }); console.log(`${pass?'PASS':'FAIL'} [${group}] ${name} ${detail?'— '+detail:''}`); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const browser = await pw[ENGINE].launch();
const ver = browser.version();
console.log(ENGINE, ver);

async function newPage(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  return { ctx, page, errors };
}

// ---------- demo.html 1280 ----------
{
  const { ctx, page, errors } = await newPage(1280, 800);
  await page.goto(DEMO); await page.waitForLoadState('load'); await sleep(500);
  const sup = await page.evaluate(() => ({
    showPopover: 'showPopover' in HTMLElement.prototype,
    popoverOpenSel: CSS.supports('selector(:popover-open)'),
    allowDiscrete: CSS.supports('transition-behavior', 'allow-discrete'),
    startingStyle: 'CSSStartingStyleRule' in window,
    dialog: 'showModal' in HTMLDialogElement.prototype,
    inert: 'inert' in HTMLElement.prototype,
    modalSel: CSS.supports('selector(:modal)'),
    hasSel: CSS.supports('selector(:has(a))'),
    anchor: CSS.supports('anchor-name', '--a'),
    hint: (() => { const d = document.createElement('div'); d.popover = 'hint'; return d.getAttribute('popover') === 'hint' && (() => { try { document.body.append(d); d.showPopover(); const ok = d.matches(':popover-open'); d.hidePopover(); d.remove(); return ok; } catch { d.remove(); return false; } })(); })(),
  }));
  for (const [k, v] of Object.entries(sup)) R('지원', `feature: ${k}`, k === 'anchor' || k === 'hint' ? true : v, String(v));
  R('데모', 'slur 전역 존재', await page.evaluate(() => typeof slur === 'object' && slur.version), await page.evaluate(() => slur?.version));

  // Tabs
  const tabRes = await page.evaluate(async () => {
    const tl = document.querySelector('[role="tablist"]'); const tabs = [...tl.querySelectorAll('[role="tab"]')];
    tabs[0].focus(); tabs[0].click();
    const before = tabs.map(t => t.getAttribute('aria-selected'));
    return { n: tabs.length, before, focused0: document.activeElement === tabs[0] };
  });
  await page.keyboard.press('ArrowRight'); await sleep(50);
  const t1 = await page.evaluate(() => { const tabs = [...document.querySelector('[role="tablist"]').querySelectorAll('[role="tab"]')]; const i = tabs.indexOf(document.activeElement); const panel = document.getElementById(tabs[i]?.getAttribute('aria-controls')); return { i, sel: tabs[i]?.getAttribute('aria-selected'), tabindex: tabs.map(t => t.tabIndex).join(','), panelShown: panel && getComputedStyle(panel).display !== 'none' && !panel.hidden }; });
  R('탭', 'ArrowRight → 다음 탭 포커스+선택(roving tabindex)', t1.i === 1 && t1.sel === 'true' && t1.panelShown, JSON.stringify(t1));
  await page.keyboard.press('End'); await sleep(50);
  const t2 = await page.evaluate(() => { const tabs = [...document.querySelector('[role="tablist"]').querySelectorAll('[role="tab"]')]; return tabs.indexOf(document.activeElement) === tabs.length - 1 && document.activeElement.getAttribute('aria-selected') === 'true'; });
  R('탭', 'End → 마지막 탭', t2);
  await page.keyboard.press('Home'); await sleep(50);
  R('탭', 'Home → 첫 탭', await page.evaluate(() => { const tabs = [...document.querySelector('[role="tablist"]').querySelectorAll('[role="tab"]')]; return document.activeElement === tabs[0]; }));
  await page.keyboard.press('ArrowLeft'); await sleep(50);
  R('탭', 'ArrowLeft(첫 탭에서) → 마지막으로 순환', await page.evaluate(() => { const tabs = [...document.querySelector('[role="tablist"]').querySelectorAll('[role="tab"]')]; return document.activeElement === tabs[tabs.length - 1]; }));

  // Menu
  const trig = page.locator('[popovertarget="row_menu_1"]');
  await trig.scrollIntoViewIfNeeded(); await trig.click(); await sleep(250);
  const m1 = await page.evaluate(() => { const m = document.getElementById('row_menu_1'); const items = [...m.querySelectorAll('[role="menuitem"]')]; const r = m.getBoundingClientRect(); const tr = document.querySelector('[popovertarget="row_menu_1"]').getBoundingClientRect(); return { open: m.matches(':popover-open'), opacity: getComputedStyle(m).opacity, firstFocused: document.activeElement === items[0], n: items.length, inView: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, nearTrigger: Math.abs(r.top - tr.bottom) < 12 || Math.abs(tr.top - r.bottom) < 12, r: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; });
  R('메뉴', '클릭 → popover 열림(:popover-open, opacity 1)', m1.open && m1.opacity === '1', JSON.stringify(m1));
  R('메뉴', '열리면 첫 menuitem 포커스', m1.firstFocused);
  R('메뉴', '트리거 기준 위치·뷰포트 안', m1.inView && m1.nearTrigger, `rect ${m1.r}`);
  await page.screenshot({ path: `${OUT}/shots/${ENGINE}-demo-menu-1280.jpg`, type: 'jpeg', quality: 60, clip: { x: Math.max(0, m1.r[0] - 500), y: Math.max(0, m1.r[1] - 120), width: 700, height: 320 } });
  await page.keyboard.press('ArrowDown'); await sleep(50);
  R('메뉴', 'ArrowDown → 2번째 항목', await page.evaluate(() => { const items = [...document.getElementById('row_menu_1').querySelectorAll('[role="menuitem"]')]; return document.activeElement === items[1]; }));
  await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp'); await sleep(50);
  R('메뉴', 'ArrowUp(첫 항목에서) → 마지막으로 순환', await page.evaluate(() => { const items = [...document.getElementById('row_menu_1').querySelectorAll('[role="menuitem"]')]; return document.activeElement === items[items.length - 1]; }));
  await page.keyboard.press('Escape'); await sleep(350);
  const m2 = await page.evaluate(() => { const m = document.getElementById('row_menu_1'); return { open: m.matches(':popover-open'), display: getComputedStyle(m).display, focusBack: document.activeElement === document.querySelector('[popovertarget="row_menu_1"]') }; });
  R('메뉴', 'Esc → 닫힘 + display none(allow-discrete 전환 후)', !m2.open && m2.display === 'none', JSON.stringify(m2));
  R('메뉴', 'Esc → 포커스 트리거로 복귀(마우스로 연 경우)', m2.focusBack, 'activeElement=' + await page.evaluate(() => document.activeElement.tagName + '.' + document.activeElement.className));
  const hit = await page.evaluate(() => { const m = document.getElementById('row_menu_1'); const r = m.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { closedDisplay: getComputedStyle(m).display, closedOpacity: getComputedStyle(m).opacity, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], hitIsMenu: m.contains(el), hitTag: el && (el.tagName + '.' + el.className) }; });
  R('메뉴', '닫힌 메뉴가 포인터를 가로채지 않음(elementFromPoint)', !hit.hitIsMenu, JSON.stringify(hit));
  // 키보드로 연 경우: 트리거 포커스 → Enter → Esc
  await page.evaluate(() => document.querySelector('[popovertarget="row_menu_1"]').focus());
  await page.keyboard.press('Enter'); await sleep(250);
  const k1 = await page.evaluate(() => ({ open: document.getElementById('row_menu_1').matches(':popover-open'), firstFocused: document.activeElement === document.querySelector('#row_menu_1 [role="menuitem"]') }));
  R('메뉴', '키보드(Enter)로 열림 → 첫 항목 포커스', k1.open && k1.firstFocused, JSON.stringify(k1));
  await page.keyboard.press('Escape'); await sleep(350);
  R('메뉴', 'Esc → 포커스 트리거로 복귀(키보드로 연 경우)', await page.evaluate(() => document.activeElement === document.querySelector('[popovertarget="row_menu_1"]')), 'activeElement=' + await page.evaluate(() => document.activeElement.tagName + '.' + document.activeElement.className));
  await trig.click(); await sleep(200);
  await page.mouse.click(20, 20); await sleep(350);
  R('메뉴', '바깥 클릭 → 닫힘(light dismiss)', await page.evaluate(() => !document.getElementById('row_menu_1').matches(':popover-open')));
  await trig.click(); await sleep(200);
  await page.keyboard.press('Tab'); await sleep(300);
  R('메뉴', 'Tab → 닫힘', await page.evaluate(() => !document.getElementById('row_menu_1').matches(':popover-open')));
  // item select closes
  await trig.click(); await sleep(200);
  await page.keyboard.press('Enter'); await sleep(350);
  R('메뉴', '항목 선택(Enter) → 닫힘', await page.evaluate(() => !document.getElementById('row_menu_1').matches(':popover-open')));

  // Tooltip
  const tb = page.locator('[aria-describedby="tip_copy"]'); await tb.scrollIntoViewIfNeeded();
  await tb.hover(); await sleep(700);
  const tp1 = await page.evaluate(() => { const t = document.getElementById('tip_copy'); const r = t.getBoundingClientRect(); return { open: t.matches(':popover-open'), opacity: getComputedStyle(t).opacity, inView: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, role: t.getAttribute('role'), pop: t.getAttribute('popover') }; });
  R('툴팁', '호버 → 열림(popover=manual, role=tooltip)', tp1.open && tp1.opacity === '1' && tp1.inView, JSON.stringify(tp1));
  await page.mouse.move(5, 5); await sleep(600);
  R('툴팁', '호버 해제 → 닫힘', await page.evaluate(() => !document.getElementById('tip_copy').matches(':popover-open')));
  await page.evaluate(() => document.querySelector('[aria-describedby="tip_export"]').focus()); await sleep(700);
  R('툴팁', '포커스 → 열림', await page.evaluate(() => document.getElementById('tip_export').matches(':popover-open')));
  await page.keyboard.press('Escape'); await sleep(350);
  R('툴팁', 'Esc → 닫힘', await page.evaluate(() => !document.getElementById('tip_export').matches(':popover-open')));
  const tc = await page.evaluate(() => { const t = document.getElementById('tip_export'); const cs = getComputedStyle(t); return { display: cs.display, opacity: cs.opacity, pe: cs.pointerEvents }; });
  R('툴팁', '닫힌 툴팁 display(UA none vs author block)·pointer-events', tc.pe === 'none', JSON.stringify(tc));

  // Pagination
  const pg = await page.evaluate(() => { const p = document.querySelector('.pagination'); const cur = p.querySelector('[aria-current="page"]'); const cs = getComputedStyle(cur); const prev = p.querySelector('.i_prev'); return { hasCur: !!cur, fw: cs.fontWeight, border: cs.borderTopColor, bg: cs.backgroundColor, prevDisabled: prev?.disabled, prevOpacity: prev && getComputedStyle(prev).opacity }; });
  R('페이지네이션', 'aria-current=page 강조(굵기·테두리·배경)', pg.hasCur && Number(pg.fw) >= 600 && pg.border !== 'rgba(0, 0, 0, 0)', JSON.stringify(pg));

  // State switch
  await page.locator('[data-action="state"][data-value="empty"]').click(); await sleep(50);
  const st = await page.evaluate(() => { const b = document.getElementById('demoState'); const q = (s) => getComputedStyle(b.querySelector(s)).display; return { state: b.dataset.state, loading: q('.i_status > .i_loading'), empty: q('.i_status > .i_empty'), body: q('.i_body') }; });
  R('4상태', 'empty 전환 → i_empty만 보임', st.state === 'empty' && st.loading === 'none' && st.empty !== 'none' && st.body === 'none', JSON.stringify(st));
  await page.locator('[data-action="state"][data-value="loading"]').first().click(); await sleep(50);
  const sk = await page.evaluate(() => { const s = document.querySelector('.p_skel_demo .skeleton'); const cs = getComputedStyle(s); return { anim: cs.animationName, display: cs.display }; });
  R('4상태', '스켈레톤 펄스 애니메이션 적용', sk.anim === 'skeleton_pulse', JSON.stringify(sk));

  // Dialog
  await page.locator('[data-action="modal_open"]').first().click(); await sleep(400);
  const d1 = await page.evaluate(() => { const d = document.getElementById('demoModal'); return { modal: !!document.querySelector(':modal'), open: d.open, opacity: getComputedStyle(d).opacity, focusIn: d.contains(document.activeElement), backdrop: getComputedStyle(d, '::backdrop').opacity }; });
  R('모달', 'showModal → :modal·opacity 1·포커스 안', d1.modal && d1.open && d1.opacity === '1' && d1.focusIn, JSON.stringify(d1));
  // toast during modal → queued
  await page.evaluate(() => slur.toast('모달 중 토스트'));
  await sleep(100);
  R('토스트', '모달 열린 동안 토스트 대기(열리지 않음)', await page.evaluate(() => document.querySelector('.toast_message[role="status"]').dataset.state !== 'show'));
  await page.keyboard.press('Escape'); await sleep(450);
  const d2 = await page.evaluate(() => ({ open: document.getElementById('demoModal').open, toastNow: document.querySelector('.toast_message[role="status"]').dataset.state }));
  R('모달', 'Esc → 닫힘', !d2.open, JSON.stringify(d2));
  R('토스트', '모달 닫힌 뒤 대기 토스트 표시', d2.toastNow === 'show');
  await sleep(4600);
  R('토스트', 'status 토스트 4초 뒤 자동 닫힘', await page.evaluate(() => document.querySelector('.toast_message[role="status"]').dataset.state !== 'show'));
  await page.locator('[data-action="toast"][data-value="alert"]').click(); await sleep(200);
  const al = await page.evaluate(() => { const t = document.querySelector('.toast_message[role="alert"]'); const r = t.getBoundingClientRect(); return { open: t.dataset.state === 'show', bottomCentered: Math.abs((r.left + r.right) / 2 - innerWidth / 2) < 40 && r.bottom < innerHeight }; });
  R('토스트', 'alert 토스트 열림·하단 중앙', al.open && al.bottomCentered, JSON.stringify(al));
  await page.locator('.toast_message[role="alert"] .i_close').click(); await sleep(300);
  R('토스트', 'alert 닫기 버튼', await page.evaluate(() => document.querySelector('.toast_message[role="alert"]').dataset.state !== 'show'));

  // Theme
  await page.locator('[data-action="theme_toggle"]').click(); await sleep(100);
  const th = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, pressed: document.querySelector('[data-action="theme_toggle"]').getAttribute('aria-pressed'), bg: getComputedStyle(document.body).backgroundColor, stored: localStorage.getItem('theme') || localStorage.getItem('slur-theme') || Object.keys(localStorage).join(',') }));
  R('테마', '토글 → data-theme=dark·aria-pressed', th.theme === 'dark' && th.pressed === 'true', JSON.stringify(th));
  await page.screenshot({ path: `${OUT}/shots/${ENGINE}-demo-dark-1280.jpg`, type: 'jpeg', quality: 55, clip: { x: 0, y: 0, width: 1280, height: 560 } });
  await page.locator('[data-action="theme_toggle"]').click(); await sleep(100);

  R('데모', '콘솔·페이지 오류 0', errors.length === 0, errors.join(' | ').slice(0, 300));
  await ctx.close();
}

// ---------- demo.html 375 ----------
{
  const { ctx, page, errors } = await newPage(375, 812);
  await page.goto(DEMO); await page.waitForLoadState('load'); await sleep(400);
  const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  const cul = await page.evaluate(() => { const vw = document.documentElement.clientWidth; const sw = document.documentElement.scrollWidth; const out = []; for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (Math.round(r.right) >= sw - 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('table')) out.push(el.tagName + '.' + el.className + ' @' + Math.round(r.left)); if (Math.round(r.right) >= sw - 1 && el.closest('table') && el.matches('.a11y_hidden')) out.push('a11y_hidden in table: ' + el.textContent.trim() + ' @' + Math.round(r.left) + ' (containing=' + (el.offsetParent && el.offsetParent.className) + ')'); } return out.slice(0, 6); });
  R('데모 375', '가로 넘침 없음', ov.sw <= ov.cw, JSON.stringify(ov) + ' culprits: ' + cul.join(' ; '));
  const trig = page.locator('[popovertarget="row_menu_3"]'); await trig.scrollIntoViewIfNeeded(); await trig.click(); await sleep(250);
  const m = await page.evaluate(() => { const m = document.getElementById('row_menu_3'); const r = m.getBoundingClientRect(); return { open: m.matches(':popover-open'), inView: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight, r: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)] }; });
  R('메뉴 375', '좁은 폭에서 메뉴 뷰포트 안(가장자리 보정)', m.open && m.inView, JSON.stringify(m));
  await page.screenshot({ path: `${OUT}/shots/${ENGINE}-demo-menu-375.jpg`, type: 'jpeg', quality: 60 });
  await page.keyboard.press('Escape');
  R('데모 375', '콘솔·페이지 오류 0', errors.length === 0, errors.join(' | ').slice(0, 300));
  await ctx.close();
}

// ---------- dashboard.html (app shell) ----------
{
  const { ctx, page, errors } = await newPage(1280, 800);
  await page.goto(`${SCREENS}/dashboard.html`); await page.waitForLoadState('load'); await sleep(500);
  const g = await page.evaluate(() => { const a = document.querySelector('.layout_app'); const cs = getComputedStyle(a); const side = a.querySelector('.l_side'); return { cols: cs.gridTemplateColumns, sideDisplay: getComputedStyle(side).display, sidePos: getComputedStyle(side).position }; });
  R('앱 셸 1280', '2열 그리드·사이드바 고정', g.cols.split(' ').length === 2 && g.sideDisplay !== 'none', JSON.stringify(g));
  await page.screenshot({ path: `${OUT}/shots/${ENGINE}-dashboard-1280.jpg`, type: 'jpeg', quality: 55 });
  R('앱 셸 1280', '콘솔·페이지 오류 0', errors.length === 0, errors.join(' | ').slice(0, 300));
  await ctx.close();
}
{
  const { ctx, page, errors } = await newPage(375, 812);
  await page.goto(`${SCREENS}/dashboard.html`); await page.waitForLoadState('load'); await sleep(500);
  const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  R('앱 셸 375', '가로 넘침 없음', ov.sw <= ov.cw, JSON.stringify(ov));
  const side0 = await page.evaluate(() => getComputedStyle(document.querySelector('.layout_app .l_side')).display);
  R('앱 셸 375', '사이드바는 기본 숨김(드로어)', side0 === 'none', side0);
  await page.locator('[data-action="drawer_open"]').first().click(); await sleep(400);
  const dr = await page.evaluate(() => { const side = document.querySelector('.layout_app .l_side'); const panel = side.querySelector('.l_panel'); const sibs = [...side.parentElement.children].filter(c => c !== side); const pr = panel.getBoundingClientRect(); return { state: side.dataset.state, display: getComputedStyle(side).display, panelX: Math.round(pr.left), sibInert: sibs.every(s => s.inert), focusIn: side.contains(document.activeElement), expanded: document.querySelector('[data-action="drawer_open"]').getAttribute('aria-expanded') }; });
  R('드로어', '열기 → data-state=open·패널 슬라이드 인(x=0)·형제 inert·포커스 안', dr.state === 'open' && dr.panelX === 0 && dr.sibInert && dr.focusIn, JSON.stringify(dr));
  await page.screenshot({ path: `${OUT}/shots/${ENGINE}-dashboard-drawer-375.jpg`, type: 'jpeg', quality: 60 });
  await page.keyboard.press('Escape'); await sleep(450);
  const dr2 = await page.evaluate(() => { const side = document.querySelector('.layout_app .l_side'); const sibs = [...side.parentElement.children].filter(c => c !== side); return { state: side.dataset.state, display: getComputedStyle(side).display, sibInert: sibs.some(s => s.inert), focusBack: document.activeElement === document.querySelector('[data-action="drawer_open"]') }; });
  R('드로어', 'Esc → 닫힘·inert 해제·display none·포커스 복귀', dr2.state !== 'open' && dr2.display === 'none' && !dr2.sibInert && dr2.focusBack, JSON.stringify(dr2));
  R('앱 셸 375', '콘솔·페이지 오류 0', errors.length === 0, errors.join(' | ').slice(0, 300));
  await ctx.close();
}

// ---------- detail.html tabs (3개) + list.html pagination/menus ----------
{
  const { ctx, page, errors } = await newPage(1280, 800);
  await page.goto(`${SCREENS}/detail.html`); await page.waitForLoadState('load'); await sleep(400);
  await page.evaluate(() => { const t = document.querySelector('[role="tablist"] [role="tab"]'); t.focus(); t.click(); });
  await page.keyboard.press('ArrowRight'); await sleep(50);
  const t = await page.evaluate(() => { const tabs = [...document.querySelector('[role="tablist"]').querySelectorAll('[role="tab"]')]; const i = tabs.indexOf(document.activeElement); const panel = document.getElementById(tabs[i]?.getAttribute('aria-controls')); return { n: tabs.length, i, sel: tabs[i]?.getAttribute('aria-selected'), panelShown: panel && getComputedStyle(panel).display !== 'none' && !panel.hidden }; });
  R('조립본 detail', '탭 방향키 이동·패널 전환', t.i === 1 && t.sel === 'true' && t.panelShown, JSON.stringify(t));
  R('조립본 detail', '콘솔·페이지 오류 0', errors.length === 0, errors.join(' | ').slice(0, 300));
  await page.goto(`${SCREENS}/list.html`); await page.waitForLoadState('load'); await sleep(400);
  const lp = await page.evaluate(() => { const p = document.querySelector('.pagination'); const cur = p?.querySelector('[aria-current="page"]'); const tw = document.querySelector('.table_wrap .i_scroll, .table_wrap'); return { hasPag: !!p, hasCur: !!cur, menus: document.querySelectorAll('[popover][role="menu"]').length, tableOverflow: tw && getComputedStyle(tw).overflowX }; });
  R('조립본 list', '페이지네이션 aria-current·행 메뉴 존재', lp.hasPag && lp.hasCur && lp.menus > 0, JSON.stringify(lp));
  const lt = page.locator('[popovertarget]').first(); await lt.scrollIntoViewIfNeeded(); await lt.click(); await sleep(250);
  R('조립본 list', '행 메뉴 열림·첫 항목 포커스', await page.evaluate(() => { const m = document.querySelector('[popover][role="menu"]:popover-open'); return !!m && document.activeElement === m.querySelector('[role="menuitem"]'); }));
  await page.keyboard.press('Escape'); await sleep(300);
  R('조립본 list', '콘솔·페이지 오류 0', errors.length === 0, errors.join(' | ').slice(0, 300));
  await ctx.close();
}

// ---------- reduced motion ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(DEMO); await page.waitForLoadState('load'); await sleep(300);
  const rm = await page.evaluate(() => { const s = document.querySelector('.p_skel_demo .skeleton'); const sp = document.querySelector('.spinner'); return { skel: getComputedStyle(s).animationDuration, spin: getComputedStyle(sp).animationDuration }; });
  R('reduced-motion', '스켈레톤·스피너 애니메이션 사실상 정지', parseFloat(rm.skel) <= 0.01 && parseFloat(rm.spin) <= 0.01, JSON.stringify(rm));
  await ctx.close();
}

await browser.close();
const summary = { webkit: ver, total: results.length, pass: results.filter(r => r.pass).length, results };
writeFileSync(`${OUT}/${ENGINE}-results.json`, JSON.stringify(summary, null, 2));
console.log(`\n${summary.pass}/${summary.total} pass`);
