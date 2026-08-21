---
title: 동작 층 — 네이티브 → slur.js → 위임
description: SLUR UX/UI System에서 위젯의 동작(키보드·포커스·열고 닫기·알림)을 어디서 가져오는지 — 브라우저 네이티브, 동봉 slur.js, 위임의 3단 우선순위를 설명합니다.
---

컴포넌트는 **모양**과 **동작**으로 나뉩니다.
모양은 CSS가 담당하고 슬러가 이미 규칙을 갖고 있습니다.
동작 — 버튼을 누르면 열리고, 바깥을 누르면 닫히고, 방향키로 움직이고,
보조 기술에 "메뉴 열림"을 알리는 것 — 은 JavaScript의 일입니다.

이 문서는 그 동작을 **어디서 가져오는지**를 정합니다.
규칙 자체(어떻게 동작해야 하는가)는 [키보드 내비게이션](/a11y/keyboard/)이 정하고,
이 문서는 그 규칙을 만족하는 **구현의 출처와 순서**를 정합니다.

---

## 3단 우선순위

| 순위 | 담당 | 예 |
|---|---|---|
| 1 | **브라우저 네이티브** | 모달 `<dialog>` + `showModal()`, 드롭다운 열고 닫기 `popover="auto"`, 아코디언 `<details>`, 셀렉트 `<select>`, 날짜 `<input type="date">` |
| 2 | **slur.js** (슬러 자체, 바닐라) | 탭 방향키, 메뉴 방향키·위치, 툴팁 호버·포커스·Esc, 토스트 큐, 드로어 포커스 관리, 테마 전환 |
| 3 | **위임** (검증된 헤드리스 라이브러리) | 콤보박스(검색되는 셀렉트), 메뉴바, 범위 달력처럼 동작이 수백 줄인 위젯 |

기준은 단순합니다.
**브라우저가 해 주면 만들지 않고, 작으면 우리가 만들고, 크면 빌려 옵니다.**

슬러는 어떤 JavaScript 라이브러리에도 의존하지 않습니다.
1·2순위까지가 슬러의 것이고 프레임워크와 무관하게 동작합니다.
3순위는 프로젝트의 선택이며, 빌려 올 때도 [외부 라이브러리 연동](/js/external-libraries/) 원칙대로
동작만 빌리고 구조·네이밍·`data-state`·모양은 슬러를 유지합니다.

---

## 1순위 — 네이티브가 해 주는 것

2026년의 브라우저(Chrome·Safari)는 접근성 동작의 상당 부분을 내장합니다.
[브라우저 지원 기준](/core/browser-support/)의 리트머스(Safari 지원)를 통과한 것들입니다.

- `<dialog>` + `showModal()` — 배경 차단(inert), Esc 닫기, 포커스 복귀, 최상위 레이어
- `popover="auto"` — Esc·바깥 클릭으로 닫힘, 최상위 레이어, 포커스 복귀, 트리거의 `aria-expanded`
- `<details>` — 열고 닫기와 상태(`[open]`)
- `<select>`, `<input type="date">` — 키보드·보조 기술·모바일 UI

이 요소들은 **자기 상태를 스스로 갖습니다.**
그래서 상태의 정본은 `data-state`가 아니라 네이티브 속성입니다 —
`dialog[open]`, `details[open]`, `:popover-open`.
브라우저가 관리하는 상태를 우리가 다시 관리하지 않습니다(`data-state` 중복 금지).
표준 ARIA 상태 속성이 있는 것도 같습니다 — 정렬 `th[aria-sort]`, 현재 페이지 `a[aria-current="page"]`.

---

## 2순위 — slur.js

네이티브가 해 주지 않는 동작만 담은 작은 바닐라 JavaScript입니다.
`slur-guidelines` 스킬이 `global.css`와 함께 동봉하며,
[키보드 내비게이션](/a11y/keyboard/)의 규칙을 그대로 구현한 **참조 구현**입니다.

| 모듈 | 바인딩 | 하는 일 |
|---|---|---|
| `tabs` | `[role="tablist"]` | ←→·Home/End 이동, roving tabindex, 자동 활성화 |
| `menu` | `[popover][role="menu"]` | 트리거 기준 위치, 열리면 첫 항목 포커스, ↑↓·Home/End, Tab·선택 시 닫기 |
| `tooltip` | `[role="tooltip"][popover="manual"]` | 호버와 포커스 모두에서 열림, Esc로 닫힘, 툴팁 위로 옮겨도 유지 |
| `toast` | `.toast_message[role="status\|alert"]` | `slur.toast(text, { level })` — 큐, 자동 소멸, 닫기. 포커스를 옮기지 않음 |
| `drawer` | `[data-action="drawer_open"]` | 열린 동안 배경 `inert`, 첫 포커스, Esc·닫기로 닫고 연 버튼으로 복귀 |
| `theme` | `[data-action="theme_toggle"]` | `<html data-theme>` 전환 + 저장 |

몇 가지 설계 원칙이 있습니다.

- **클래스가 아니라 역할·속성에 바인딩합니다.** `role="tablist"`, `popover`, `data-action` — 모양과 무관하므로
  슬러 디자인이 아닌 프로젝트(규칙만 적용)에서도 그대로 동작합니다.
- **`document`에 위임합니다.** `<script src="slur.js" defer>` 한 줄이면 나중에 추가된 요소에도 붙습니다.
- **상태는 `data-state`와 표준 ARIA를 함께 갱신합니다.** 탭이면 `aria-selected` + `data-state="active"` + `tabindex`.
- **후처리는 커스텀 이벤트로** — `slur:tabchange`, `slur:menutoggle`, `slur:drawertoggle`, `slur:themechange`.

```html
<!-- 탭 — 마크업만 맞추면 방향키·활성화는 slur.js -->
<div class="tab_menu">
  <div class="i_list" role="tablist" aria-label="보기">
    <button class="i_tab" type="button" role="tab" id="tab_all" aria-controls="panel_all" aria-selected="true" tabindex="0" data-state="active">전체</button>
    <button class="i_tab" type="button" role="tab" id="tab_new" aria-controls="panel_new" aria-selected="false" tabindex="-1" data-state="">신규</button>
  </div>
  <div class="i_panel" id="panel_all" role="tabpanel" aria-labelledby="tab_all" tabindex="0" data-state="active">…</div>
  <div class="i_panel" id="panel_new" role="tabpanel" aria-labelledby="tab_new" tabindex="0" data-state="">…</div>
</div>

<!-- 액션 메뉴 — 열고 닫기는 popover(네이티브), 방향키·위치는 slur.js -->
<button class="btn m_icon" type="button" popovertarget="row_menu_1" aria-haspopup="menu" aria-label="더보기">⋯</button>
<div class="menu_action" id="row_menu_1" popover role="menu">
  <button class="i_item" type="button" role="menuitem">편집</button>
  <button class="i_item m_danger" type="button" role="menuitem">삭제</button>
</div>
```

```js
slur.toast('저장되었습니다.');                           // role="status" 컨테이너, 4초 뒤 소멸
slur.toast('저장에 실패했습니다.', { level: 'alert' });    // role="alert" 컨테이너, 직접 닫을 때까지
```

React처럼 프레임워크가 상태를 들고 있는 위젯(탭 선택 등)은
`data-state`·ARIA를 프레임워크가 렌더하고, 키 규칙은 `slur.js`의 해당 모듈을 참조해 컴포넌트 안으로 옮깁니다.
둘이 같은 속성을 동시에 쓰지 않게 합니다.
메뉴·툴팁·토스트·드로어·테마는 프레임워크 상태와 겹치지 않으므로 그대로 씁니다.

---

## 3순위 — 위임

콤보박스(타이핑으로 거르는 셀렉트), 메뉴바, 범위를 고르는 달력처럼
키보드·ARIA 동작이 수백 줄인 위젯은 직접 만들지 않고 검증된 헤드리스 라이브러리에 맡깁니다.
원칙은 [외부 라이브러리 연동](/js/external-libraries/) 그대로입니다.

- 라이브러리는 **동작(상태 트리거)** 만 담당합니다.
- 구조·네이밍·`data-state`·모양은 슬러가 담당합니다.
- 헤드리스 라이브러리 다수가 상태를 `data-state`로 내보내므로 슬러 CSS와 그대로 맞물립니다.
  다른 속성(`data-open` 등)을 내보내면 CSS에 그 선택자를 한 줄 덧붙입니다.

위임은 **프로젝트의 선택**입니다. 슬러가 특정 라이브러리를 요구하거나 전제하지 않습니다.

---

## 왜 이 순서인가

- **네이티브 우선**은 [접근성 설계 철학](/a11y/philosophy/)("구조가 명확하면 접근성은 따라온다")과
  [브라우저 지원 기준](/core/browser-support/)의 직접적인 귀결입니다. 브라우저가 검증한 동작을 다시 만들 이유가 없습니다.
- **slur.js가 2순위**인 이유는 남는 동작이 작기 때문입니다. 탭 40줄, 메뉴 60줄, 툴팁 40줄 — 이 정도는 라이브러리에
  묶이는 비용보다 직접 갖는 편이 쌉니다. 그리고 그 코드가 곧 규칙의 교재가 됩니다.
- **위임이 3순위**인 이유는 [기능 절제 원칙](/ux/feature-restraint/)과 같습니다. 콤보박스가 정말 필요한지 먼저 묻고,
  네이티브 `<select>`로 안 될 때만 빌립니다.

---

## 동작 층의 목적

동작 층 기준은
슬러가 "규칙 + 모양"에 더해 **동작까지 갖춘 완결된 시스템**이 되되,
어떤 라이브러리에도 묶이지 않게 하기 위한 기준입니다.

네이티브가 늘어날수록 slur.js는 줄어듭니다.
그것이 이 층이 지향하는 방향입니다.
