# 대시보드 레시피 — 앱 셸부터 화면 조립본까지

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

## 4. 4상태 — 블록에 `data-state`, 슬롯은 `i_status` 상자 안

```html
<section class="table_wrap" data-state="loading">   <!-- loading | empty | error | success -->
  <div class="i_status" role="status">   <!-- 항상 렌더 — 상자가 미리 있어야 전환이 보조 기술에 읽힌다 -->
    <div class="i_loading"><span class="spinner" aria-hidden="true"></span> 불러오는 중…</div>
    <div class="i_empty"><div class="empty_state"><span class="i_title">조건에 맞는 청구서가 없습니다</span><span class="i_text">필터를 바꿔 보세요.</span></div></div>
    <div class="i_error"><div class="empty_state m_error"><span class="i_title">불러오지 못했습니다</span><div class="i_action"><button class="btn m_small" type="button">다시 시도</button></div></div></div>
  </div>
  <div class="i_body">…표·목록(정상)…</div>
</section>
```

- 어느 슬롯을 보일지는 **global.css가 블록의 `data-state`를 읽어** 결정한다(`[data-state="loading"] > .i_status > .i_loading` 식). 페이지 CSS에서 슬롯의 `display`를 건드리지 않는다.
- 로딩 기본은 **`spinner` + 읽힐 문장**(「불러오는 중…」). 표·카드 목록처럼 모양이 정해진 넓은 영역은 `skeleton`(+`m_title`·`m_circle`…)로 자리를 그려도 된다 — 뼈대 행은 페이지 CSS(`p_skel_row` 등)로 짜고, 스켈레톤만이면 읽히지 않으므로 `a11y_hidden` 문장을 하나 둔다(조립본 `list`·`detail`이 그 예). 빈·에러는 `empty_state`(+`m_error`).
- JS는 `el.dataset.state = 'loading' | 'empty' | 'error' | 'success'` 한 줄. React면 `data-state={status}`.

## 5. 토스트 — 컨테이너 선존재 + `slur.toast()`

```html
<!-- body 끝, 페이지 블록 밖. 기본 status(자동 소멸) / 긴급 alert(수동 닫기) -->
<div class="toast_message" role="status" data-state="close"><p class="i_text"></p><button class="i_close" type="button" aria-label="닫기">…</button></div>
<div class="toast_message" role="alert" data-state="close"><p class="i_text"></p><button class="i_close" type="button" aria-label="닫기">…</button></div>
```

```js
slur.toast('저장되었습니다.');                          // role=status, 4초 뒤 사라짐
slur.toast('저장에 실패했습니다.', { level: 'alert' });   // role=alert, 직접 닫을 때까지
slur.toast('내보내는 중…', { duration: 8000 });
```

한 번에 하나, 나머지는 큐. 알림은 포커스를 옮기지 않는다. 라이브 영역은 **미리 DOM에** 있어야 읽힌다 — 동적으로 만들지 않는다. **위치는 한 곳**(하단 중앙) — status/alert 모두 같은 자리, 강도 차이는 `role`과 자동 소멸뿐. `m_top`은 하단이 탭바·푸터·FAB로 막혀 토스트가 포커스를 가릴 때만, 두 컨테이너에 함께. **모달이 열려 있는 동안에는 띄우지 않는다** — 모달 안 결과는 모달 안에서(버튼 글자 변화·`alert.m_inline`), 토스트는 닫힌 뒤. `slur.toast()`는 모달이 열려 있으면 큐에 두었다가 닫히면 보여준다.

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
- 팝오버 블록(`menu_action`·`tooltip_help`)에 `display`를 직접 쓰지 않는다 — `:popover-open`에만. 기본 규칙의 `display`는 브라우저의 닫힘 숨김(`[popover]:not(:popover-open) { display: none }`)을 덮어써 닫힌 메뉴가 투명한 채 남아 그 자리의 클릭을 가로챈다.

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

## 15. 화면 조립본 — `assets/patterns/screens/`

처음부터 짜지 말고 **조립본을 복사해 시작**한다. 여덟 장 모두 그대로 열리는 HTML(마크업 + 페이지 CSS + 페이지 JS)이고, 위젯 동작은 전부 `slur.js`에 위임돼 있어 페이지 스크립트는 그 화면의 데이터 흐름만 담는다. 화면끼리는 실제 흐름대로 연결돼 있다(로그인 ↔ 가입·재설정, 목록 행 메뉴 → 상세). 목차는 `index.html`.

| 파일 | 틀 | 들어 있는 것 |
|---|---|---|
| `dashboard.html` | `layout_app` | 기간 탭·필터 툴바, `card.m_stat` 4개, 차트 색 토큰, 4상태 표(`i_status`), 행 메뉴, 페이지네이션, 새 청구서 `<dialog>`, 토스트 |
| `login.html` | `layout_auth` | 이메일·비밀번호(보기 토글 `input_wrap .i_action`), 인라인 오류(`field[data-state=error]` + `i_help` + `aria-invalid`), 폼 상단 실패 `alert.m_inline`, 로딩 버튼(스피너), 소셜 버튼, 하단 링크 |
| `list.html` | `layout_app` | 제목+카운트 배지, 상태 탭(필터 → 4상태 전환), 검색·플랜 셀렉트, **선택 바**(`page_list[data-state="selected"]`), 전체 선택 `indeterminate`, 정렬(`aria-sort`), 행 메뉴 → **삭제 확인 `<dialog>`**(초기 포커스 취소) → 토스트, 빈/에러 상태, 좁은 화면 가로 스크롤 |
| `settings.html` | `layout_app` | 구역 내비(`aria-current`, `scroll-margin-top`), 카드 섹션(프로필·알림·보안·위험 구역), 라벨/컨트롤 2열 행(`p_row`), `role="switch"` + `aria-checked`, **변경 추적 저장 바**(`p_savebar[data-state="open"]`, 취소=초기값 복원), 비밀번호 규칙 인라인 오류, 위험 구역(`card.p_danger`) → 이름 입력 게이트 삭제 확인 |
| `signup.html` | `layout_auth` | 이름·이메일·비밀번호·확인, **강도 막대**(`p_strength[data-state=weak|fair|good|strong]`, 장식 — 읽히는 문장은 `i_help`) + **규칙 체크리스트**(`li[data-state=pass]` + 숨은 "충족/미충족"), 약관 `fieldset.field`(전체 동의 ↔ 개별, `indeterminate`, 필수 미동의는 `i_help` 오류), 중복 이메일은 폼 상단 `alert`, 성공 → `page_signup[data-state="sent"]` 인증 메일 안내(`empty_state`, 제목으로 포커스, 재전송 60초 잠금) |
| `reset.html` | `layout_auth` | **네 단계 한 파일** — `page_reset[data-state="request|sent|new|done"]`로 `p_step_*` 블록 전환, 단계가 바뀌면 새 단계의 `h1`(tabindex=-1)로 포커스. 요청(이메일 — 계정 유무 노출 없음) → 메일 확인(`empty_state`, 재전송 잠금, 데모용 "메일 링크 열기") → 새 비밀번호(규칙 체크리스트 + 확인, 이전 비밀번호 재사용은 상단 `alert`) → 완료(다른 기기 로그아웃 안내, 로그인으로) |
| `detail.html` | `layout_app` | 정체 헤더(아바타·이름·상태/플랜 badge·메타 + 편집·`mailto:`·더보기 `menu_action`), **탭**(`tab_menu` 기본형, 개요/청구서/활동 — 방향키는 `slur.js`), **보기↔편집 전환** `page_detail[data-state="view|edit"]`(같은 카드 안에서 `p_dl` ↔ `p_fields` 교대, 편집 중엔 헤더 동작 숨김·저장 바만 출구), 변경 추적(라디오는 그룹 단위) + **변경 버리기 확인 `<dialog>`**(초기 포커스 "계속 편집"), 저장 → dl·헤더·브레드크럼 갱신 → 토스트, 청구서 탭은 처음 열 때 4상태 `loading→success`, 활동 타임라인(`p_timeline`, `<time>`), 휴면 처리(되돌릴 수 있어 확인 없음) vs 삭제(확인, 초기 포커스 취소) |
| `onboarding.html` | `layout_app` | 빈 워크스페이스 첫 화면 — **히어로 = `empty_state`**(페이지 스코프에서 크기만 키움, 첫 고객 CTA), **진행 체크리스트**(네이티브 `<progress>` 룩만 입힘 + `aria-label`, 항목 `li[data-state=done]` + 숨은 "완료", 전부 끝나면 `p_checklist[data-state=done]` 푸터 교체), 첫 고객·팀원 초대 `<dialog>` 폼 → 단계 완료·사이드바 카운트·`page_onboarding[data-state="started"]`(히어로 내려감), **4상태 활동 블록** `empty → success`(카드 안 `p_feed[data-state]`에 `i_status`/`i_body` 직계), 둘러보기 `card.m_list` 링크 행 |

조립본에서 지키는 공통 규칙(새 화면도 같게):

- 페이지 블록 하나(`page_*`)가 컴포넌트를 조합하고, 틀(`layout_app`/`layout_auth`)은 `l_`로 자족한다. 페이지 CSS는 `<style>`에 `.page_x .p_*`로만 — 컴포넌트 내부를 덮을 땐 페이지 스코프에서(`.page_list .table_data { min-width: 760px; }`).
- 상태는 `data-state`(선택 바·저장 바·4상태), 네이티브·ARIA 상태가 있으면 그 속성이 정본(`[open]`·`:popover-open`·`aria-sort`·`aria-current`·`aria-checked`·`aria-invalid`).
- 파괴적 확인은 `<dialog>` + 초기 포커스 취소(또는 이름 입력 게이트), 성공 알림은 **모달이 닫힌 뒤** 토스트 — `slur.toast()`가 순서를 보장한다.
- 인라인 오류는 그 자리(`field` + `i_help` + `aria-invalid`), 폼 전체 실패는 폼 상단 `alert.m_inline`(`role="alert"`), 포커스는 첫 오류 필드로.
- 컨트롤 이름 규칙: 아이콘만 있는 버튼은 `aria-label`, 스위치는 `aria-labelledby`로 행 라벨과 연결, 검색·셀렉트의 숨은 라벨은 `a11y_hidden`.
- 한 페이지 안에서 **화면(단계·모드)이 바뀌면 포커스를 옮긴다** — 새 단계의 제목(`h1[tabindex=-1]`)이나 편집의 첫 입력으로, 나갈 때는 들어온 버튼으로(`reset.html`·`signup.html`·`detail.html`). 모달·팝오버는 네이티브가 복귀시키므로 손대지 않는다.
- 확인 대화상자는 **되돌릴 수 없는 것에만** — 휴면 처리처럼 되돌릴 수 있는 변경은 바로 적용하고 결과만 토스트, 삭제·변경 버리기는 `<dialog>`로 확인(초기 포커스는 안전한 쪽).
- 색만으로 상태를 전하지 않는다 — 강도 막대·체크 아이콘은 `aria-hidden`, 읽히는 문장(`i_help`·`a11y_hidden` "충족"/"완료")을 함께 둔다. 진행률은 네이티브 `<progress>` + `aria-label`.

React/Next로 옮길 때는 페이지 CSS를 CSS Module(같은 클래스명)로, 페이지 JS의 `data-action` 분기를 핸들러로 옮기고, `slur.js`는 `<Script>`로 그대로 로드한다(14절).
