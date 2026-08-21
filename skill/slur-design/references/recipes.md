# 대시보드 레시피 — 앱 셸부터 위임까지

대시보드 한 장을 슬러 디자인(tokens + components + patterns)과 `slur.js`만으로 끝까지 만드는 조립법. Tailwind·shadcn 없이, 어떤 JS 라이브러리에도 의존하지 않는다. 동작은 **네이티브 → slur.js → 위임** 순서(SKILL.md 「동작은 어디서 오나」). 완성 예시는 레포 `system/demo-dashboard.html`.

로드 순서: `global.css → tokens/* → components/* → patterns/app-shell.css → 페이지 CSS`, 그리고 `<script src="slur.js" defer>`.

---

## 1. 앱 셸 — `layout_app` (patterns/app-shell.css)

사이드바 / 상단 바 / 본문. 레이아웃 규칙대로 내부는 `l_`로 자족하고, 컴포넌트는 `l_main` 안의 `page_*`가 조합한다. 1024 미만에서 사이드바는 드로어가 된다.

```html
<div class="layout_app">
  <div class="l_side" id="app_side" data-state="close">          <!-- 드로어 껍데기(모바일) -->
    <div class="l_panel">
      <a class="l_brand" href="/">SLUR Admin</a>
      <button class="l_close" type="button" data-action="drawer_close" aria-label="메뉴 닫기">…</button>
      <span class="l_group">워크스페이스</span>
      <nav aria-label="주 메뉴"><ul class="l_nav">
        <li><a class="l_item" href="/" aria-current="page">대시보드</a></li>      <!-- 현재 페이지 정본 = aria-current -->
        <li><a class="l_item" href="/customers">고객<span class="l_count">12</span></a></li>
      </ul></nav>
      <div class="l_foot"><a class="l_user" href="/me"><span class="l_avatar">SL</span><span class="l_user_meta">슬러<small>admin@…</small></span></a></div>
    </div>
    <div class="l_dim" data-action="drawer_close" aria-hidden="true"></div>
  </div>
  <header class="l_head">
    <button class="l_menu" type="button" data-action="drawer_open" aria-controls="app_side" aria-expanded="false" aria-label="메뉴 열기">…</button>
    <h1 class="l_title">대시보드</h1>
    <div class="l_actions">…버튼들(btn)…</div>
  </header>
  <main class="l_main"><div class="page_dash">…</div></main>
</div>
```

- 모바일 드로어 동작(열린 동안 `l_head`·`l_main`에 `inert`, 첫 포커스 이동, Esc·딤·닫기 버튼으로 닫고 연 버튼으로 복귀)은 `slur.js`의 `drawer`가 `data-action`·`aria-controls`만 보고 처리한다. 페이지 JS 0줄.
- 사이드바 안의 nav 링크는 **방향키 위젯이 아니다** — `role="menu"` 금지, Tab으로 이동(accessibility.md 5-B).

## 2. 페이지 뼈대 — `page_dash`

구조 간격(그리드 갭·섹션 여백)은 px 직접, 컴포넌트 내부 간격은 rem 토큰. 대시보드는 **PC-first**가 맞다(css.md 반응형 예외).

```css
.page_dash { display: flex; flex-direction: column; gap: 24px; }
.page_dash .p_stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.page_dash .p_charts { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
@media (max-width: 1023px) { .page_dash .p_stats { grid-template-columns: 1fr 1fr; } .page_dash .p_charts { grid-template-columns: 1fr; } }
```

## 3. 통계 카드 — `card.m_stat`

```html
<div class="card m_stat">
  <div class="i_head"><span class="i_label">월 매출</span><span class="i_icon">…svg…</span></div>
  <strong class="i_value">₩12.4M</strong>
  <div class="i_delta"><span class="badge m_success">▲ 12.5%</span>지난달 대비</div>
</div>
```

증감은 새 규칙을 만들지 않고 `badge`를 조합한다. 숫자는 `tabular-nums`(토큰 CSS에 포함).

## 4. 4상태 — 블록에 `data-state`, 슬롯은 직계 자식

```html
<section class="table_wrap" data-state="loading">   <!-- "" | loading | empty | error -->
  <div class="i_loading" aria-busy="true"><span class="skeleton m_title"></span><span class="skeleton"></span></div>
  <div class="i_empty"><div class="empty_state"><span class="i_title">조건에 맞는 청구서가 없습니다</span><span class="i_text">필터를 바꿔 보세요.</span></div></div>
  <div class="i_error"><div class="empty_state m_error"><span class="i_title">불러오지 못했습니다</span><div class="i_action"><button class="btn m_small" type="button">다시 시도</button></div></div></div>
  <div class="i_body">…표·목록(정상)…</div>
</section>
```

- 어느 슬롯을 보일지는 **global.css가 블록의 `data-state`를 읽어** 결정한다(`[data-state="loading"] > .i_loading` 식). 페이지 CSS에서 슬롯의 `display`를 건드리지 않는다.
- 로딩은 **스켈레톤이 기본**(실제 콘텐츠 형태를 흉내), 짧은 전환은 `spinner`. 빈·에러는 `empty_state`(+`m_error`).
- JS는 `el.dataset.state = 'loading' | '' | 'empty' | 'error'` 한 줄. React면 `data-state={status}`.

## 5. 토스트 — 컨테이너 선존재 + `slur.toast()`

```html
<!-- body 끝, 페이지 블록 밖. 기본 status(자동 소멸) / 긴급 alert(수동 닫기) -->
<div class="toast_message" role="status" data-state="close"><p class="i_text"></p><button class="i_close" type="button" aria-label="닫기">…</button></div>
<div class="toast_message m_top" role="alert" data-state="close"><p class="i_text"></p><button class="i_close" type="button" aria-label="닫기">…</button></div>
```

```js
slur.toast('저장되었습니다.');                          // role=status, 4초 뒤 사라짐
slur.toast('저장에 실패했습니다.', { level: 'alert' });   // role=alert, 직접 닫을 때까지
slur.toast('내보내는 중…', { duration: 8000 });
```

한 번에 하나, 나머지는 큐. 알림은 포커스를 옮기지 않는다. 라이브 영역은 **미리 DOM에** 있어야 읽힌다 — 동적으로 만들지 않는다.

## 6. 행 액션 메뉴 — `menu_action` (네이티브 popover)

```html
<button class="btn m_ghost m_icon m_small" type="button" popovertarget="row_menu_1" aria-haspopup="menu" aria-label="Initech 더보기">⋯</button>
<div class="menu_action" id="row_menu_1" popover role="menu" aria-label="Initech 동작" data-align="end">
  <button class="i_item" type="button" role="menuitem">편집</button>
  <button class="i_item" type="button" role="menuitem">복제<span class="i_shortcut">⌘D</span></button>
  <div class="i_divider" role="separator"></div>
  <button class="i_item m_danger" type="button" role="menuitem">삭제</button>
</div>
```

- 열고 닫기·Esc·바깥 클릭·최상위 레이어·포커스 복귀 = `popover="auto"`(네이티브, JS 0). 상태 정본은 `:popover-open` — `data-state`를 붙이지 않는다.
- 트리거 기준 위치, 열리면 첫 항목 포커스, ↑↓·Home/End, Tab으로 닫기, 항목 선택 시 닫기 = `slur.js`의 `menu`. `data-align="end"`는 트리거 오른쪽 끝 정렬.
- 항목 클릭 처리는 프로젝트가 `data-action`으로 위임한다. 테이블 한 행에 메뉴 하나씩 두어도 된다(id만 다르게).

## 7. 툴팁 — `tooltip_help`

```html
<button class="btn m_icon" type="button" aria-label="복사" aria-describedby="tip_copy">…</button>
<span class="tooltip_help" id="tip_copy" role="tooltip" popover="manual">클립보드에 복사 (⌘C)</span>
```

연결은 `aria-describedby` 하나. 호버+포커스로 열리고 Esc로 닫히며 툴팁 위로 마우스를 옮겨도 유지된다(`slur.js` tooltip). 안에 버튼·링크를 넣지 않는다. 아이콘 버튼은 `aria-label`이 이름이고 툴팁은 설명이다 — 둘 다 둔다.

## 8. 표 정렬·페이지네이션

```html
<th class="m_num m_sort" aria-sort="descending">
  <button class="i_sort" type="button" data-action="sort" data-key="amount">금액<svg>…</svg></button>
</th>
```

- 정렬 상태 정본은 `th`의 `aria-sort`(표준 속성). CSS가 그걸 읽어 아이콘 방향·색을 바꾼다. JS는 `aria-sort`만 갱신하고 정렬 자체는 데이터 층(직접 `sort()` 또는 TanStack Table)이 한다.
- 페이지네이션은 `pagination` 블록, 현재 페이지 정본은 `aria-current="page"`. URL 기반이면 `a`, 상태 전환이면 `button` — 룩은 같다. 표 아래 `table_wrap .i_foot`에 `i_count`와 나란히 둔다.

## 9. 차트 — 색만 토큰에서 주입

차트는 라이브러리(Recharts·Chart.js·D3)가 그린다. 슬러는 색 5슬롯(`--color-chart-1~5`)만 준다 — 순서 고정, 5개 초과면 "기타"로 묶거나 화면을 나눈다. 상태색(success/warning/danger)을 계열색으로 쓰지 않는다.

```js
const css = getComputedStyle(document.documentElement);
const series = [1, 2, 3, 4, 5].map((n) => css.getPropertyValue(`--color-chart-${n}`).trim());
// Recharts: <Bar fill={series[0]} /> · Chart.js: backgroundColor: series
// 다크 전환 시 다시 읽는다: document.documentElement.addEventListener('slur:themechange', redraw)
```

라이트 면에서 3·4·5번은 대비 3:1 미만 — 색만으로 계열을 구분시키지 말고 **범례 + 직접 라벨(또는 표)** 을 함께 둔다. 차트 설계 일반(형태 선택·마크·툴팁)은 `dataviz` 스킬.

## 10. 다크 토글

```html
<head>
  <!-- 첫 페인트 전에 복원 — slur.js보다 먼저, 인라인 한 줄(깜빡임 방지) -->
  <script>try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}</script>
</head>
<button class="btn m_ghost m_icon" type="button" data-action="theme_toggle" aria-pressed="false" aria-label="다크 모드 전환">…</button>
```

전환·저장·`aria-pressed` 갱신은 `slur.js`의 `theme`. 토큰 시맨틱 레이어가 재배선되므로 컴포넌트는 손대지 않는다. Next.js면 인라인 스크립트는 `app/layout.tsx`의 `<head>`에 `dangerouslySetInnerHTML`로.

## 11. 모달 — `<dialog class="modal_dialog">`

```html
<dialog class="modal_dialog" id="modal_invoice" aria-labelledby="modal_invoice_title">
  <div class="i_head"><h2 class="i_title" id="modal_invoice_title">새 청구서</h2><button class="i_close" type="button" data-action="modal_close" aria-label="닫기">…</button></div>
  <div class="i_body">…</div>
  <div class="i_foot"><button class="btn" type="button" data-action="modal_close">취소</button><button class="btn m_primary" type="button">만들기</button></div>
</dialog>
```

`showModal()` / `close()`만 부른다. 배경 inert·Esc·포커스 복귀·`::backdrop`은 브라우저. 파괴적 확인은 초기 포커스를 취소 버튼에 두고 바깥 클릭으로 닫지 않는다.

## 12. 필터 — 네이티브 먼저

셀렉트 `<select class="input_text">`(`select` 블록), 검색 `input_text m_icon_left`, 기간 `<input type="date">`(브라우저 달력·키보드·접근성 제공). 범위 선택·휴일 표시처럼 네이티브로 안 되는 요구가 실제로 생길 때만 13으로.

## 13. 위임 — 3순위

콤보박스(검색되는 셀렉트)·메뉴바·범위 달력처럼 동작이 수백 줄인 위젯만 검증된 헤드리스 라이브러리에 맡긴다. 원칙은 「외부 라이브러리 연동」 그대로 — 라이브러리는 상태 트리거일 뿐, 구조·네이밍·`data-state`·모양은 슬러.

```tsx
// 예: React 프로젝트에서 콤보박스만 Radix/Base UI 등에 위임 — 클래스는 슬러, 상태는 data-state
<Combobox.Content className="menu_action">            {/* 동작: 라이브러리, 모양: components/menu.css */}
  <Combobox.Item className="i_item" />                 {/* 라이브러리가 data-state="checked" 등을 내보내면 그대로 CSS가 읽는다 */}
</Combobox.Content>
```

위임은 **프로젝트의 선택**이고 슬러는 어떤 라이브러리도 요구하지 않는다. 라이브러리가 `data-state`가 아닌 속성(`data-open` 등)을 내보내면 CSS에 그 선택자를 한 줄 덧붙인다.

## 14. React에서 slur.js

`slur.js`는 `document`에 위임해 동작하므로 React가 렌더한 DOM에도 그대로 붙는다(`app/layout.tsx`에서 `<Script src="/slur.js" strategy="afterInteractive" />`).

- **그대로 쓰는 것**: 메뉴·툴팁·토스트·드로어·테마 — React 상태와 겹치지 않는 DOM 속성(popover 열림, 포커스, 라이브 영역)만 만진다.
- **React가 정본인 것**: 탭처럼 선택 상태를 React가 들고 있으면 `data-state`·`aria-selected`를 React가 렌더하고, 키 규칙(←→·Home/End, roving tabindex)은 같은 규칙으로 컴포넌트 안에서 구현한다. `slur.js`의 `tabs` 코드가 그 참조 구현이다. 둘이 동시에 같은 속성을 쓰지 않게 한다.
- 프로젝트 `CLAUDE.md`/`AGENTS.md` 한 줄: "이 프로젝트는 **슬러 디자인**으로 만든다. Tailwind·shadcn 클래스를 쓰지 않는다. 동작은 네이티브 → slur.js → 위임, 모양은 슬러 클래스와 토큰, 상태는 `data-state`."
