---
title: 디자인시스템 개요
description: SLUR Design System — 슬러 문법으로 쓴 시각 어휘(디자인 토큰·컴포넌트·패턴·화면 조립본)의 네 층과 호칭, 로드 순서, 가져오는 방법을 설명합니다.
---

SLUR UX/UI System이 **문법**(구조·네이밍·상태·CSS 작성 규칙)이라면,
SLUR Design System은 그 문법으로 쓴 **어휘**입니다 —
색·타이포·간격 토큰, 컴포넌트의 생김새, 화면을 짜는 틀, 그리고 그대로 열리는 화면 조립본.

이 섹션은 어휘 층을 다룹니다.
앞의 문서들이 정한 문법 위에서만 성립하며, 어휘의 모든 코드는 그 문법을 그대로 따릅니다.
문법만 가져다 쓰면 프로젝트의 룩은 바뀌지 않고, 어휘까지 가져오면 슬러의 룩이 됩니다.

---

## 네 층

| 층 | 내용 | 위치 | 스킬 |
|---|---|---|---|
| **guidelines** | 규칙 문서 + 공통 레이어 [`global.css`](/css/global-layer/) + 동작 층 [`slur.js`](/js/behaviors/) | `slur-guidelines/` | `slur-guidelines` |
| **tokens** | [디자인 토큰](/design/tokens/) — 색·타이포·간격·라디우스·그림자·모션·브레이크포인트·z-index | `slur-design/assets/tokens/` | `slur-design` |
| **components** | [컴포넌트 CSS](/design/components/) 15개 — 버튼·입력·셀렉트·선택·배지·카드·알림·모달·내비게이션·표·토스트·상태·메뉴·툴팁·페이지네이션 | `slur-design/assets/components/` | `slur-design` |
| **patterns** | [앱 셸 · 인증 셸 · 화면 조립본](/design/screens/) 여덟 장 | `slur-design/assets/patterns/` | `slur-design` |

- 문법(guidelines)은 **룩 무관**입니다. 기존 디자인이 있는 프로젝트에 적용해도 바뀌는 것은 코드의 구조와 표기법뿐입니다.
- 어휘(design)는 **문법이 있어야 성립**합니다. 컴포넌트 CSS는 공통 레이어의 리셋·포커스 링·4상태 스위치를 전제하고, 토큰 실명(`--color-brand` 등)에 의존합니다 — 토큰 없이 컴포넌트만 쓸 수 없습니다.
- 동작은 CSS 밖입니다 — 네이티브 → `slur.js` → 위임의 [3단 우선순위](/js/behaviors/)를 따르며, 어떤 JS 라이브러리에도 의존하지 않습니다.

---

## 호칭 — 부르는 말에 따라 들어가는 것이 다릅니다

| 부르는 말 | 뜻 | 프로젝트에 들어가는 것 |
|---|---|---|
| **슬러 시스템** | 문법만 | `global.css` + `slur.js`. 기존 디자인은 그대로 |
| **슬러 디자인** | 문법 + 어휘 전부 | `global.css` + `slur.js` + `tokens/*` + `components/*` (+ 필요한 `patterns/*`) |
| **슬러 디자인 토큰만** | 문법 + 토큰 | `global.css` + `slur.js` + `tokens/*` — 컴포넌트는 프로젝트가 토큰으로 직접 만듭니다 |

AI 도구에 말할 때도 같은 세 호칭을 씁니다 — [AI 퀵스타트](/design/ai-quickstart/).

---

## 로드 순서

전부 개별 `<link>`로 병렬 로드합니다. 런타임 `@import`는 순차 폭포를 만들므로 쓰지 않습니다(번들러를 쓰면 같은 순서로 `import`).

```html
<!-- 1. 공통 레이어 (slur-guidelines) -->
<link rel="stylesheet" href="/css/global.css">
<!-- 2. 토큰 (slur-design/tokens) — 전부 -->
<link rel="stylesheet" href="/css/tokens/colors.css">
<link rel="stylesheet" href="/css/tokens/typography.css">
<link rel="stylesheet" href="/css/tokens/spacing.css">
<link rel="stylesheet" href="/css/tokens/radius.css">
<link rel="stylesheet" href="/css/tokens/shadows.css">
<link rel="stylesheet" href="/css/tokens/motion.css">
<link rel="stylesheet" href="/css/tokens/breakpoints.css">
<link rel="stylesheet" href="/css/tokens/z-index.css">
<!-- 3. 컴포넌트 (slur-design/components) — 쓰는 것만 -->
<link rel="stylesheet" href="/css/components/button.css">
<link rel="stylesheet" href="/css/components/input.css">
<!-- 4. 패턴 (slur-design/patterns) — 대시보드면 app-shell, 로그인류면 auth-shell -->
<link rel="stylesheet" href="/css/patterns/app-shell.css">
<!-- 5. 프로젝트 CSS — 레이아웃 → 컴포넌트 → 페이지 → 반응형 -->
<link rel="stylesheet" href="/css/layout.css">
<link rel="stylesheet" href="/css/page-dashboard.css">
<!-- 동작 층 -->
<script src="/js/slur.js" defer></script>
```

- **웹폰트**는 시스템이 로드하지 않습니다. `--font-sans`의 선두가 Noto Sans KR이므로 소비자 페이지가 Google Fonts `<link>`(400/500/600/700)를 직접 넣습니다. 없으면 시스템 폰트로 폴백됩니다.
- **다크 모드**는 `<html data-theme="dark">` 하나로 끝납니다. 시맨틱 토큰 층만 재배선되므로 컴포넌트는 손대지 않습니다. 전환·저장은 `slur.js`의 `theme`(`data-action="theme_toggle"` 버튼), 첫 페인트 깜빡임 방지는 `<head>`의 인라인 한 줄입니다.

```html
<script>try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}</script>
```

---

## 핵심 규칙

어휘 층이 지키는 것, 그리고 어휘로 화면을 짤 때 지키는 것입니다. 문법 규칙은 [체크리스트](/reference/checklist/)에 있습니다.

- **시맨틱 토큰만** 씁니다. 번호 프리미티브(`--color-neutral-400`)는 시맨틱 층의 내부 구현이라 직접 쓰지 않고, 새 색상값(hex/rgb)도 만들지 않습니다.
- **공유 컨트롤 높이 `2 / 2.5 / 3rem`**(32/40/48 — `m_small` / 기본 / `m_large`). 버튼·입력·셀렉트가 같은 줄에서 키가 맞습니다.
- **모바일 터치 타깃은 48**이 기본입니다. 아이콘만 있는 단독 버튼은 `.btn.m_icon`(정사각, 기본 40 / `m_large` 48) 또는 햄버거 `.btn_menu`(48×48).
- **상태색 면 위 텍스트는 on-토큰**(`--color-on-brand` `-on-danger` `-on-success` `-on-warning`). 리터럴 `#fff`는 쓰지 않습니다.
- **아이콘은 `em`**(`1.125em` 기본) + `stroke="currentColor"` — 글자 크기·색을 따라갑니다.
- 포커스 링은 `global.css`가 한 곳에서 그립니다 — 컴포넌트에서 다시 선언하지 않습니다.
- 네이티브·ARIA가 상태를 갖는 요소에는 `data-state`를 겹쳐 붙이지 않습니다 — `dialog[open]`, `details[open]`, `:popover-open`, `th[aria-sort]`, `a[aria-current="page"]`, `[role=switch][aria-checked]`가 정본입니다.
- 다른 유틸리티·컴포넌트 클래스 체계와 섞지 않습니다. 헤드리스 라이브러리는 3순위 위임에서만, 그때도 모양은 슬러의 클래스와 토큰으로만.

필요한 컴포넌트가 없으면 **토큰만으로 새로 조립**합니다 — 이름은 슬러 네이밍, 위치는 프로젝트의 컴포넌트 CSS, 새 토큰·새 색상값은 만들지 않습니다. 같은 부품이 두 곳 이상에서 반복되면 그때 시스템으로 승격을 제안합니다.

---

## 가져오기

두 스킬 폴더(`slur-guidelines`, `slur-design`)가 원본입니다. 이 사이트가 같은 경로로 그대로 서빙하므로 어디서든 내려받을 수 있습니다.

```bash
curl -fsSL https://docs.slur.co.kr/skill/install.sh | sh
```

현재 폴더의 `.claude/skills/` 아래에 두 스킬이 들어갑니다(Claude Code 프로젝트 스킬). 스크립트가 하는 일은 [`manifest.txt`](/skill/manifest.txt)의 파일 목록을 같은 경로로 내려받는 것뿐이며, 내용은 [`install.sh`](/skill/install.sh)에서 확인할 수 있습니다. 다른 위치는 `SLUR_SKILLS_DIR=<폴더>`로 지정합니다.

| 원본 | 주소 |
|---|---|
| 문법 스킬 | [`slur-guidelines/SKILL.md`](/skill/slur-guidelines/SKILL.md) · [`assets/global.css`](/skill/slur-guidelines/assets/global.css) · [`assets/slur.js`](/skill/slur-guidelines/assets/slur.js) |
| 어휘 스킬 | [`slur-design/SKILL.md`](/skill/slur-design/SKILL.md) · [`assets/tokens/`](/skill/slur-design/assets/tokens/colors.css) · [`assets/components/`](/skill/slur-design/assets/components/button.css) · [`assets/patterns/`](/skill/slur-design/assets/patterns/app-shell.css) |
| 화면 조립본 목차 | [`patterns/screens/index.html`](/skill/slur-design/assets/patterns/screens/index.html) |
| 컴포넌트 데모 | [`system/demo.html`](/system/demo.html) |

프로젝트에 넣을 때는 스킬의 `assets/`를 프로젝트 CSS 폴더로 **복사**합니다(full: `tokens/` + `components/`, tokens-only: `tokens/`만). `global.css`·`slur.js`도 함께, 대시보드면 `patterns/app-shell.css`, 로그인류면 `auth-shell.css`까지. **화면을 새로 짤 때는 [조립본](/design/screens/)을 복사해 시작합니다** — 사이드바·4상태·토스트·모달·삭제 확인·보기/편집 전환·단계 전환·온보딩 체크리스트가 규칙대로 들어 있습니다.
