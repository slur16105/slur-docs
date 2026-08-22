---
title: 공통 레이어 (global.css)
description: 컴포넌트보다 먼저 작성하는 공통 스타일 레이어(global.css)의 리셋, 폼 컨트롤 상속, 포커스 전략을 설명합니다.
---

"공통 스타일을 우선 작성한다"는 원칙은
**공통 레이어를 컴포넌트보다 먼저 만든다**는 뜻입니다.
파일명 관례는 `global.css`입니다.

시스템의 기본값은 global이 담당하고,
컴포넌트 CSS에는 기본값과 **다른 값(변형)만** 남깁니다.

---

## global 레이어의 역할

global 레이어는 다음을 담당합니다.

- 전체 선택자 리셋 (box-sizing, margin, padding) — 리셋이 지운 네이티브 기본값 복원 포함(`dialog { margin: auto }`: `showModal()` 가운데 정렬), iOS 가로 회전 시 글자 자동 확대 방지(`text-size-adjust: 100%`)
- 본문 타이포그래피의 기준값 (글꼴, 크기, 행간, 색)
- 폼 컨트롤의 상속 개방과 기본 타이포
- 포커스 스타일의 단일 선언
- 시각 숨김(`a11y_hidden`), 움직임 줄이기(`prefers-reduced-motion`)
- [4상태](/ux/screen-states/) 스위치 (`data-state` 값에 따라 `i_status` 안의 `i_loading` / `i_empty` / `i_error`와 `i_body` 노출 전환)

컴포넌트가 이 값들을 반복 선언하면
수정 지점이 흩어지고 드리프트가 생깁니다.

---

## 전체 선택자 리셋

박스 모델과 기본 여백은 전체 선택자로 리셋합니다.

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
```

- `border-box`는 "선언한 너비 = 실제 너비"를 만드는 표준 동작입니다.
- 간격을 부모의 `gap`으로 관리하는 구조에서
  요소가 스스로 갖고 나오는 UA 기본 마진·패딩은 전부 소음입니다.
- 전체 선택자(`*`)의 성능 비용은 모던 브라우저에서 없습니다.
  성능을 이유로 리셋을 피하지 않습니다.

리셋이 없으면 컴포넌트마다 `margin: 0`을
반복 선언하게 됩니다 — 공통 레이어 부재의 신호입니다.

---

## 폼 컨트롤 상속

`input` · `textarea` · `select` · `button`은
브라우저 UA 스타일 때문에 **body에서 font와 color를 상속받지 않습니다.**

태그 레벨에서 `inherit`를 선언해 상속을 엽니다.
이후 글꼴과 글자색은 body 한곳에서 관리됩니다.

```css
body { font-family: var(--font_sans); font-size: var(--text_base); color: var(--color_text); }
input, textarea, select, button { font-family: inherit; line-height: inherit; color: inherit; }
```

크기가 본문과 다른 값이 시스템 규칙이라면
(예: 본문 16px / 컨트롤 14px)
상속 대신 global의 태그 레벨에 명시합니다.

```css
input, textarea, select, button { font-size: var(--text_sm); }
button { font-weight: var(--weight_medium); line-height: 1; }
```

---

## 포커스 스타일

`outline: none`은 **반드시 대체 포커스 링과 한 쌍**으로 사용합니다.
global에서 한 번만 선언하고, 컴포넌트마다 반복하지 않습니다.

```css
input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible { outline: none; box-shadow: var(--color_focus_ring); }
```

대체 링 없이 outline만 제거하는 것은
접근성을 해치므로 허용하지 않습니다.

---

## 4상태 스위치

[화면 상태 설계](/ux/screen-states/)의 `loading / empty / error / success` 전환은
룩과 무관한 순수 노출 규칙이므로 global이 한 번만 담당합니다.
블록마다 다시 쓰지 않습니다.

```css
[data-state] > .i_status > .i_loading, [data-state] > .i_status > .i_empty, [data-state] > .i_status > .i_error { display: none; }
[data-state="loading"] > .i_status > .i_loading { display: block; }
[data-state="empty"] > .i_status > .i_empty { display: block; }
[data-state="error"] > .i_status > .i_error { display: block; }
[data-state="loading"] > .i_body, [data-state="empty"] > .i_body, [data-state="error"] > .i_body { display: none; }
```

내부 요소를 블록 대신 `[data-state]`로 스코프하는 **유일한 예외**입니다 —
이 넷은 문법이 전역으로 예약한 이름이라 어느 블록에서나 같은 뜻이기 때문입니다.
`i_status` 상자와 `i_body`는 블록의 **직계 자식**이어야 하고, 블록에는 `data-state`(`loading|empty|error|success`)가 선언되어 있어야 합니다.
슬롯 안의 룩(스켈레톤·빈 상태 패널·스피너)은 디자인 층의 일이며 global은 노출만 정합니다.

---

## 컴포넌트에는 변형만

global이 기본값을 담당하면
컴포넌트 선언은 짧아지고 의도가 드러납니다.

```css
/* 이렇게 — 변형만 남긴다 */
.btn { display: inline-flex; height: 2.5rem; padding: 0 var(--space_md); border: 1px solid var(--color_border); border-radius: var(--radius_md); background: var(--color_surface); cursor: pointer; }
.btn.m_large { height: 3rem; padding: 0 var(--space_lg); font-size: var(--text_base); }

/* 이렇게 하지 않는다 — global이 담당하는 값을 반복 */
.btn { margin: 0; box-sizing: border-box; font-family: var(--font_sans); color: var(--color_text); outline: none; }
```

컴포넌트에서 `margin: 0`, `box-sizing`, font-family,
기본 글자색, outline 제거를 다시 선언하고 있다면
공통 레이어 부재의 신호입니다.

---

## 파일 구성 순서

global(공통 레이어) 다음의 배치 순서는 **구조 스케일이 큰 것 → 작은 것**입니다.

`global → 레이아웃(layout_) → 컴포넌트 → 페이지(page_) → 반응형`

페이지를 바깥에서 안으로 읽는 순서(틀 → 조각 → 화면)라 구조 파악이 쉽고,
가장 로컬한 페이지가 마지막이라 페이지가 레이아웃·컴포넌트를 오버라이드하기 안전합니다.

### 레이아웃 블록엔 컴포넌트를 두지 않는다

`layout_` 블록의 내부는 `l_` 내부 요소로 **자족**시키고, 재사용 컴포넌트를 직접 넣지 않습니다.

- 레이아웃 안에 공유 컴포넌트를 넣으면, 레이아웃을 고칠 때 그 컴포넌트까지 건드리게 되어 다른 사용처로 리스크가 번집니다.
- `l_` 내부 요소로 자족시키면 수정 영향이 레이아웃 안으로 **국소화**됩니다.
- 컴포넌트는 **페이지가 조합**합니다. (예: 헤더의 탭·아이콘·검색은 `l_nav`·`l_icon`·`l_searchbar`로 두고, `tab_menu`·`input` 같은 컴포넌트를 헤더에 직접 넣지 않습니다.)
