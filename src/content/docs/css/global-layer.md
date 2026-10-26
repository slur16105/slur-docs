---
title: CSS 세 파일 구조
description: global.css, common.css, page.css의 역할과 로드 순서, 원본 관리와 페이지 스타일 범위를 설명합니다.
---

"공통 스타일을 우선 작성한다"는 원칙은
**공통 레이어를 컴포넌트보다 먼저 만든다**는 뜻입니다.
파일명 관례는 `global.css`입니다.

시스템의 기본값은 global이 담당하고,
컴포넌트 CSS에는 기본값과 **다른 값(변형)만** 남깁니다.

---

## CSS 세 파일 구조

### 변경 배경과 판단 기준

`global.css → common.css → page.css`는 SLUR 작성자가 실제 작업에서 가장 효율적이라고 확인한 구조다. CSS는 선언 순서가 덮어쓰기 결과에 영향을 주므로, 어떤 스타일이 먼저 적용되고 어떤 스타일이 뒤에서 조정하는지 바로 파악할 수 있어야 한다. 토큰·컴포넌트·패턴별로 파일이 지나치게 세분화되면서 이 순서와 관계를 확인하려면 여러 파일과 로드 지점을 오가야 했고, 수정과 검토의 효율이 떨어졌다. 세 파일 구조를 선택한 핵심 이유는 적용 순서와 수정 위치를 한눈에 파악할 수 있는 작업 효율이다. 기존에 사용하던 익숙한 방식이라는 점은 부가적인 배경이다.

파일을 열어 보는 사람이 전체 기준 → 공통 요소 → 화면 전용 스타일의 흐름을 바로 읽고, 사람과 AI 모두 같은 기준으로 작성 위치와 수정 범위를 판단할 수 있어야 한다. 파일 분리 여부는 이 가독성과 작업 편의성을 기준으로 결정한다.

세 파일은 작성 책임과 기본 로드 순서를 함께 드러낸다. 실제 CSS 우선순위에는 선택자 명시도 등도 영향을 주므로, 페이지 조정은 `.page_*` 범위로 한정하고 불필요하게 높은 명시도를 만들지 않는다.

현재 구현은 개별 저작 원본을 유지하고 global·common을 자동 생성한다. 이는 로드 순서를 정리한 상태이며, 작성자가 확인해야 하는 원본 구조의 복잡성은 남아 있다. **로드 파일 세 개만으로 작성 구조의 단순화까지 완료했다고 보지 않는다.**

프로젝트는 **`global.css → common.css → page.css`** 순서로 로드합니다.

| 파일 | 역할 | 포함 예시 |
|---|---|---|
| `global.css` | 리셋, 토큰, 문서 기본값, 접근성 기본 규칙 | 색상·글꼴·간격 토큰, `html`·`body`, 폼 상속, 포커스 링, `a11y_hidden`, reduced-motion |
| `common.css` | 공통 레이아웃과 재사용 컴포넌트 | `layout_*`, 버튼·입력·표·카드·모달, 4상태 슬롯 전환 |
| `page.css` | 페이지별 배치와 해당 화면 전용 스타일 | `.page_list .p_grid`, `.page_list .table_data`의 화면 한정 배치 |

```html
<link rel="stylesheet" href="/css/global.css">
<link rel="stylesheet" href="/css/common.css">
<link rel="stylesheet" href="/css/list/page.css">
```

- 각 화면은 자신의 `page.css` 하나만 로드합니다. 여러 화면의 페이지 CSS를 동시에 로드하지 않습니다.
- 공통 스타일은 `common.css` 안에서 레이아웃 → 컴포넌트 순으로 정리합니다. 각 파일의 반응형 규칙은 해당 파일에 둡니다. 별도 반응형 파일은 만들지 않습니다.
- `page.css`의 모든 선택자는 해당 `.page_*` 범위에 한정합니다. `body`·`html`·`:root`·태그·공통 클래스만으로 전역을 변경하지 않습니다. 화면 전용 여백·배경은 페이지 블록에 선언하고, 문서 기본값은 `global.css`, 재사용 레이아웃·컴포넌트는 `common.css`에 둡니다.
- 페이지의 공통 컴포넌트 조정은 `.page_*` 아래로 한정합니다. 공통 토큰을 페이지에서 전역 재정의하지 않습니다.
- 조건 없는 전역 토큰은 `global.css` 상단의 `:root` 하나에 모으고, 공백 4칸으로 들여써 한 줄에 토큰 하나씩 펼칩니다. 일반 스타일 규칙의 한 줄 작성과 구분합니다. 다크 테마·미디어쿼리처럼 적용 조건이 다른 재정의와 블록 전용 변수는 합치지 않습니다. 저작 원본을 파일별로 유지하는 경우에도 브라우저용 생성본의 기본 토큰은 하나로 모읍니다.
- 시스템 토큰 정의는 `global.css`에 모읍니다. 가이드만 적용하는 프로젝트는 기존 디자인의 토큰을 유지하고, SLUR 디자인을 쓰는 프로젝트는 디자인 토큰 원본을 합칩니다.
- 토큰·컴포넌트·패턴의 개별 파일은 **저작 원본**으로 유지할 수 있습니다. 브라우저에는 세 파일만 연결하며 원본을 중복 로드하지 않습니다. 런타임 `@import`는 사용하지 않습니다.
- 이 저장소는 `node skill/slur-design/scripts/build-css.mjs`로 `skill/slur-design/assets/css/global.css`와 `common.css`를 생성합니다. 생성본을 직접 수정하지 않습니다. dev·build에서도 자동 재생성합니다.
- 데모와 화면 예제는 `styles/<화면명>/page.css`를 사용합니다. 웹폰트 로드는 별도이며 CSS 세 파일 구조의 대상은 프로젝트 스타일입니다.

---

## global 레이어의 역할

global 레이어는 다음을 담당합니다.

- 전체 선택자 리셋 (box-sizing, margin, padding) — 리셋이 지운 네이티브 기본값 복원 포함(`dialog { margin: auto }`: `showModal()` 가운데 정렬), iOS 가로 회전 시 글자 자동 확대 방지(`text-size-adjust: 100%`)
- 본문 타이포그래피의 기준값 (글꼴, 크기, 행간, 색)
- 폼 컨트롤의 상속 개방과 기본 타이포
- 포커스 스타일의 단일 선언
- 시각 숨김(`a11y_hidden`), 움직임 줄이기(`prefers-reduced-motion`)
- 색상·글꼴·간격 등 시스템 토큰 정의

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
재사용 상태 컴포넌트의 규칙이므로 `common.css`가 한 번만 담당합니다.
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
슬롯 안의 룩(스켈레톤·빈 상태 패널·스피너)은 디자인 층의 일이며 `common.css` 안에서 노출 규칙과 슬롯 모양을 관리합니다.

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

세 파일 안에서 **구조 스케일이 큰 것 → 작은 것** 순서로 정리합니다.

`global.css → common.css(레이아웃·컴포넌트) → page.css(페이지)`

반응형 규칙은 해당 스타일을 소유한 파일 안에 둡니다.

페이지를 바깥에서 안으로 읽는 순서(틀 → 조각 → 화면)라 구조 파악이 쉽고,
가장 로컬한 페이지가 마지막이라 페이지가 레이아웃·컴포넌트를 오버라이드하기 안전합니다.

### 레이아웃 블록엔 컴포넌트를 두지 않는다

`layout_` 블록의 내부는 `l_` 내부 요소로 **자족**시키고, 재사용 컴포넌트를 직접 넣지 않습니다.

- 레이아웃 안에 공유 컴포넌트를 넣으면, 레이아웃을 고칠 때 그 컴포넌트까지 건드리게 되어 다른 사용처로 리스크가 번집니다.
- `l_` 내부 요소로 자족시키면 수정 영향이 레이아웃 안으로 **국소화**됩니다.
- 컴포넌트는 **페이지가 조합**합니다. (예: 헤더의 탭·아이콘·검색은 `l_nav`·`l_icon`·`l_searchbar`로 두고, `tab_menu`·`input` 같은 컴포넌트를 헤더에 직접 넣지 않습니다.)
