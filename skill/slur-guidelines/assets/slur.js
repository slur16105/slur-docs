/* ─────────────────────────────────────────────
   SLUR.JS — 동작 층 (slur-guidelines 동봉)
   네이티브가 해 주지 않는 키보드·포커스·알림 동작만 담는다(accessibility.md 5장의
   규칙을 그대로 구현). 룩과 무관하고 프레임워크 무관(바닐라). 이벤트는 document에
   위임하므로 나중에 추가된 요소에도 동작한다. 바인딩 기준은 클래스가 아니라
   역할·속성(role, popover, data-action) — 슬러 문법이 요구하는 이름(toast_message,
   4상태 슬롯)만 예외로 참조한다.

   · tabs    — [role="tablist"] 방향키·Home/End, roving tabindex, 자동 활성화(기본)
   · menu    — [popover][role="menu"] 트리거 기준 위치, 열리면 첫 항목 포커스, 방향키·Tab 닫기
   · tooltip — [role="tooltip"][popover="manual"] 호버+포커스로 열림, Esc 닫힘, 위치
   · toast   — .toast_message[role="status|alert"] 선존재 컨테이너에 큐·자동 소멸·닫기
   · drawer  — [data-action="drawer_open"][aria-controls] 열린 동안 형제 inert, Esc·닫기·포커스 복귀
   · theme   — <html data-theme> 전환 + localStorage 저장(깜빡임 방지 스니펫은 <head>에 따로)

   사용: <script src="slur.js" defer></script> → window.slur. 모듈 번들러면 import 'slur.js'.
   네이티브가 하는 일은 여기 없다 — 모달은 <dialog>.showModal(), 드롭다운 열고 닫기는
   popover="auto", 아코디언은 <details>, 셀렉트·날짜는 네이티브 input.
   ───────────────────────────────────────────── */
(function (global) {
  'use strict';

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const EDGE = 8;   // 뷰포트 가장자리 여백(px)
  const GAP = 4;    // 트리거와 레이어 사이(px)

  const byId = (id) => (id ? document.getElementById(id) : null);
  const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

  /* 떠 있는 레이어 위치 — position:fixed 요소를 트리거 기준으로 놓는다(최상위 레이어라 z-index 불필요).
     place: 'below'(메뉴) | 'above'(툴팁). 공간이 없으면 반대편, 가로는 뷰포트 안으로 밀어 넣는다. */
  function position(el, trigger, place) {
    const r = trigger.getBoundingClientRect();
    const w = el.offsetWidth, h = el.offsetHeight;
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    let top, left;
    if (place === 'above') {
      top = r.top - GAP - h;
      if (top < EDGE) top = r.bottom + GAP;
      left = r.left + r.width / 2 - w / 2;
    } else {
      top = r.bottom + GAP;
      if (top + h > vh - EDGE && r.top - GAP - h >= EDGE) top = r.top - GAP - h;
      left = el.dataset.align === 'end' ? r.right - w : r.left;
      if (left + w > vw - EDGE) left = r.right - w;
    }
    left = Math.max(EDGE, Math.min(left, vw - w - EDGE));
    el.style.top = Math.round(top) + 'px';
    el.style.left = Math.round(left) + 'px';
  }

  /* ── 탭 ───────────────────────────────────────
     [role="tablist"] > [role="tab"] (aria-controls → [role="tabpanel"]).
     Tab은 위젯 사이, 방향키는 위젯 안(roving tabindex). 활성화 기본값 = 자동(포커스가 가면 패널 전환),
     패널이 느리면 tablist에 data-activation="manual"(Enter/Space·클릭으로만).
     활성 상태는 aria-selected + data-state="active"를 함께 갱신한다. — APG Tabs */
  const tabs = {
    activate(tab) {
      const tablist = tab.closest('[role="tablist"]');
      if (!tablist) return;
      tablist.querySelectorAll('[role="tab"]').forEach((t) => {
        const on = t === tab;
        t.tabIndex = on ? 0 : -1;
        t.setAttribute('aria-selected', String(on));
        t.dataset.state = on ? 'active' : '';
        const panel = byId(t.getAttribute('aria-controls'));
        if (panel) panel.dataset.state = on ? 'active' : '';
      });
      emit(tab, 'slur:tabchange', { tab });
    },
    init() {
      document.addEventListener('keydown', (e) => {
        const tab = e.target.closest?.('[role="tab"]');
        const tablist = tab?.closest('[role="tablist"]');
        if (!tablist) return;
        const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
        const prev = vertical ? 'ArrowUp' : 'ArrowLeft', next = vertical ? 'ArrowDown' : 'ArrowRight';
        const list = [...tablist.querySelectorAll('[role="tab"]')].filter((t) => !t.disabled);
        let idx = list.indexOf(tab);
        if (e.key === next) idx = (idx + 1) % list.length;
        else if (e.key === prev) idx = (idx - 1 + list.length) % list.length;
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = list.length - 1;
        else return;
        e.preventDefault();
        list[idx].focus();
        if (tablist.dataset.activation !== 'manual') tabs.activate(list[idx]);
      });
      // 클릭(마우스·Enter·Space)은 항상 활성화
      document.addEventListener('click', (e) => {
        const tab = e.target.closest?.('[role="tab"]');
        if (tab && !tab.disabled) tabs.activate(tab);
      });
    }
  };

  /* ── 액션 메뉴 ─────────────────────────────────
     <button popovertarget="id" aria-haspopup="menu"> + <div id="id" popover role="menu"> > [role="menuitem"].
     열고 닫기·Esc·바깥 클릭·포커스 복귀는 popover="auto"가 한다. 여기서는 트리거 기준 위치,
     열리면 첫 항목 포커스, 방향키·Home/End 이동, Tab이면 닫기, 항목 선택 시 닫기. — APG Menu Button */
  const menu = {
    items: (m) => [...m.querySelectorAll('[role="menuitem"]')].filter((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true'),
    trigger: (m) => document.querySelector(`[popovertarget="${CSS.escape(m.id)}"]`),
    place(m) { const t = menu.trigger(m); if (t) position(m, t, 'below'); },
    init() {
      // toggle은 버블링하지 않으므로 캡처 단계에서 받는다
      document.addEventListener('toggle', (e) => {
        const m = e.target;
        if (!(m instanceof HTMLElement) || !m.matches('[popover][role="menu"]')) return;
        if (e.newState === 'open') { menu.place(m); menu.items(m)[0]?.focus(); }
        emit(m, 'slur:menutoggle', { open: e.newState === 'open' });
      }, true);
      document.addEventListener('keydown', (e) => {
        const m = e.target.closest?.('[popover][role="menu"]');
        if (!m) return;
        if (e.key === 'Tab') { m.hidePopover(); return; }          // 포커스가 안에 있었으므로 트리거로 복귀 → Tab은 거기서 이어진다
        const list = menu.items(m);
        let idx = list.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') idx = (idx + 1) % list.length;
        else if (e.key === 'ArrowUp') idx = (idx - 1 + list.length) % list.length;
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = list.length - 1;
        else return;
        e.preventDefault();
        list[idx]?.focus();
      });
      document.addEventListener('click', (e) => {
        const item = e.target.closest?.('[popover][role="menu"] [role="menuitem"]');
        if (item && !item.hasAttribute('aria-haspopup')) item.closest('[popover]').hidePopover();
      });
      const replace = () => document.querySelectorAll('[popover][role="menu"]:popover-open').forEach(menu.place);
      window.addEventListener('resize', replace);
      document.addEventListener('scroll', replace, true);
    }
  };

  /* ── 툴팁 ─────────────────────────────────────
     <button aria-describedby="tip_id"> + <span id="tip_id" role="tooltip" popover="manual">.
     호버와 포커스 모두에서 뜨고, Esc로 포커스 이동 없이 닫히며, 마우스를 툴팁 위로 옮겨도 유지된다.
     연결은 aria-describedby 하나 — JS가 트리거를 따로 등록할 필요가 없다. — WCAG 1.4.13 */
  const tooltip = {
    showDelay: 150, hideDelay: 100, timer: null,
    tipOf(target) {
      const el = target.closest?.('[aria-describedby]');
      if (!el) return null;
      for (const id of el.getAttribute('aria-describedby').split(/\s+/)) {
        const tip = byId(id);
        if (tip?.matches('[role="tooltip"][popover]')) return { el, tip };
      }
      return null;
    },
    show(el, tip) {
      clearTimeout(tooltip.timer);
      if (!tip.matches(':popover-open')) tip.showPopover();
      position(tip, el, 'above');
    },
    hide(tip) { if (tip.matches(':popover-open')) tip.hidePopover(); },
    hideAll() { document.querySelectorAll('[role="tooltip"][popover]:popover-open').forEach(tooltip.hide); },
    init() {
      document.addEventListener('pointerover', (e) => {
        const hit = tooltip.tipOf(e.target);
        if (hit) { clearTimeout(tooltip.timer); tooltip.timer = setTimeout(() => tooltip.show(hit.el, hit.tip), tooltip.showDelay); return; }
        if (e.target.closest?.('[role="tooltip"][popover]')) clearTimeout(tooltip.timer);   // 툴팁 위로 옮기면 유지
      });
      document.addEventListener('pointerout', (e) => {
        const from = tooltip.tipOf(e.target) || (e.target.closest?.('[role="tooltip"][popover]') && { tip: e.target.closest('[role="tooltip"][popover]') });
        if (!from) return;
        const to = e.relatedTarget;
        if (to && (from.el?.contains(to) || from.tip.contains(to))) return;
        clearTimeout(tooltip.timer);
        tooltip.timer = setTimeout(() => tooltip.hide(from.tip), tooltip.hideDelay);
      });
      document.addEventListener('focusin', (e) => { const hit = tooltip.tipOf(e.target); if (hit) tooltip.show(hit.el, hit.tip); });
      document.addEventListener('focusout', (e) => { const hit = tooltip.tipOf(e.target); if (hit) tooltip.hide(hit.tip); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tooltip.hideAll(); });
      window.addEventListener('scroll', tooltip.hideAll, true);
    }
  };

  /* ── 토스트 ───────────────────────────────────
     컨테이너 <div class="toast_message" role="status" data-state="close"><p class="i_text"></p><button class="i_close">…</button></div>
     가 미리 DOM에 있어야 한다(라이브 영역 선존재). slur.toast('저장되었습니다') → 텍스트를 바꾸고 show.
     기본 role="status": 4초 뒤 자동 소멸. { level: 'alert' }: role="alert" 컨테이너에, 자동 소멸 없음.
     알림은 포커스를 옮기지 않는다. 한 번에 하나, 나머지는 큐.
     모달(<dialog> showModal)이 열려 있는 동안에는 띄우지 않는다 — dialog 바깥은 inert라 토스트가
     닿지 않는다(ux-states.md). 큐에 두었다가 모달이 닫히면 이어서 보여준다. — APG Alert · WCAG 4.1.3 */
  const toast = {
    queue: [], current: null, timer: null, fade: 250, waiting: false,
    container: (level) => document.querySelector(`.toast_message[role="${level}"]`) || document.querySelector('.toast_message'),
    show(text, opts = {}) {
      const level = opts.level === 'alert' ? 'alert' : 'status';
      const el = toast.container(level);
      if (!el) { console.warn('slur.toast: .toast_message 컨테이너가 DOM에 없습니다 (role="status"|"alert")'); return; }
      toast.queue.push({ el, text, duration: opts.duration ?? (level === 'alert' ? 0 : 4000) });
      if (!toast.current) toast.next();
    },
    next() {
      const modal = document.querySelector(':modal');
      if (modal) {   // 모달 열린 동안 대기 — 닫히면 재개
        if (!toast.waiting) { toast.waiting = true; modal.addEventListener('close', () => { toast.waiting = false; toast.next(); }, { once: true }); }
        return;
      }
      const item = toast.queue.shift();
      toast.current = item || null;
      if (!item) return;
      const textEl = item.el.querySelector('.i_text') || item.el;
      textEl.textContent = item.text;
      item.el.dataset.state = 'show';
      if (item.duration > 0) toast.timer = setTimeout(() => toast.hide(item.el), item.duration);
    },
    hide(el) {
      clearTimeout(toast.timer);
      el.dataset.state = 'close';
      setTimeout(() => { const t = el.querySelector('.i_text'); if (t) t.textContent = ''; toast.next(); }, toast.fade);
    },
    init() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest?.('.toast_message .i_close');
        if (btn) toast.hide(btn.closest('.toast_message'));
      });
    }
  };

  /* ── 드로어 ───────────────────────────────────
     트리거 <button data-action="drawer_open" aria-controls="id" aria-expanded="false">,
     드로어 <div id="id" data-state="close"> … <button data-action="drawer_close">.
     열린 동안 드로어의 형제 요소에 inert(페이지로 포커스가 새지 않게), 첫 포커스 가능 요소로 이동,
     Esc·닫기 버튼·딤(data-action="drawer_close")으로 닫히며 연 버튼으로 포커스 복귀. — APG Dialog */
  const drawer = {
    stack: [],
    siblings: (el) => [...el.parentElement.children].filter((s) => s !== el && s.tagName !== 'SCRIPT'),
    open(el, trigger) {
      if (el.dataset.state === 'open') return;
      el.dataset.state = 'open';
      drawer.siblings(el).forEach((s) => { s.inert = true; });
      drawer.stack.push({ el, trigger });
      trigger?.setAttribute('aria-expanded', 'true');
      (el.querySelector(FOCUSABLE) || el).focus();
      emit(el, 'slur:drawertoggle', { open: true });
    },
    close(el) {
      const i = drawer.stack.findIndex((d) => d.el === el);
      if (i < 0) return;
      const { trigger } = drawer.stack.splice(i, 1)[0];
      el.dataset.state = 'close';
      drawer.siblings(el).forEach((s) => { s.inert = false; });
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.focus();
      emit(el, 'slur:drawertoggle', { open: false });
    },
    init() {
      document.addEventListener('click', (e) => {
        const a = e.target.closest?.('[data-action="drawer_open"], [data-action="drawer_close"]');
        if (!a) return;
        if (a.dataset.action === 'drawer_open') { const el = byId(a.getAttribute('aria-controls')); if (el) drawer.open(el, a); }
        else { const d = drawer.stack.findLast?.((d) => d.el.contains(a)) || drawer.stack[drawer.stack.length - 1]; if (d) drawer.close(d.el); }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !drawer.stack.length) return;
        if (document.querySelector('[popover]:popover-open')) return;   // 겹치면 Esc는 맨 위 하나만 — 열린 popover가 먼저
        drawer.close(drawer.stack[drawer.stack.length - 1].el);
      });
    }
  };

  /* ── 테마 ─────────────────────────────────────
     <html data-theme="dark">가 전부(토큰 시맨틱 레이어 재배선). 선택은 localStorage 'theme'.
     첫 페인트 깜빡임 방지는 <head> 인라인 한 줄이 맡는다(레시피 참고) — 이 모듈은 전환·저장만. */
  const theme = {
    key: 'theme',
    get: () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    set(mode) {
      if (mode === 'dark') document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
      try { localStorage.setItem(theme.key, mode); } catch (_) {}
      document.querySelectorAll('[data-action="theme_toggle"]').forEach((b) => b.setAttribute('aria-pressed', String(mode === 'dark')));
      emit(document.documentElement, 'slur:themechange', { mode });
    },
    toggle() { theme.set(theme.get() === 'dark' ? 'light' : 'dark'); },
    init() {
      document.addEventListener('click', (e) => { if (e.target.closest?.('[data-action="theme_toggle"]')) theme.toggle(); });
      document.querySelectorAll('[data-action="theme_toggle"]').forEach((b) => b.setAttribute('aria-pressed', String(theme.get() === 'dark')));
    }
  };

  const slur = { tabs, menu, tooltip, toast: toast.show, drawer, theme, version: '1.10.0' };
  function init() { tabs.init(); menu.init(); tooltip.init(); toast.init(); drawer.init(); theme.init(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  global.slur = slur;
  if (typeof module === 'object' && module.exports) module.exports = slur;
})(typeof window !== 'undefined' ? window : globalThis);
