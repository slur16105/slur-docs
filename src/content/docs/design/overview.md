---
title: 디자인시스템 개요
description: SLUR Design System — 슬러 문법으로 쓴 시각 어휘(디자인 토큰·컴포넌트·패턴·화면 조립본)의 네 층과 호칭, 로드 순서, 가져오는 방법을 설명합니다.
---

SLUR UX/UI System은 두 부분으로 이루어집니다.
**SLUR UI Guidelines**는 구조·네이밍·상태·접근성을 정하는 구현 규칙이고,
**SLUR Design System**은 색·타이포·간격 토큰, 컴포넌트의 생김새, 화면을 짜는 틀과 조립본을 제공합니다.
쉽게 말하면 UI Guidelines는 UI를 만드는 **문법**, Design System은 그 문법으로 만든 **슬러의 디자인**입니다.

이 섹션은 어휘 층을 다룹니다.
Design System은 UI Guidelines 위에서 성립하며 모든 코드가 같은 구현 규칙을 따릅니다.
UI Guidelines만 적용하면 프로젝트의 디자인은 그대로이고, Design System까지 적용하면 화면의 생김새도 슬러로 바뀝니다.

---

## 네 층

| 층 | 내용 | 위치 | 스킬 |
|---|---|---|---|
| **guidelines** | 규칙 문서 + 공통 레이어 [`global.css`](/css/global-layer/) + 동작 층 [`slur.js`](/js/behaviors/) | `slur-guidelines/` | `slur-guidelines` |
| **tokens** | [디자인 토큰](/design/tokens/) — 색·타이포·간격·라디우스·그림자·모션·브레이크포인트·z-index | `slur-design/assets/tokens/` | `slur-design` |
| **components** | [컴포넌트 CSS](/design/components/) 26개 유형(25개 CSS 파일) — 버튼·입력·셀렉트·선택·배지·카드·알림·모달·내비게이션·표·토스트·상태·메뉴·툴팁·페이지네이션 및 아바타·아코디언·입력 확장·진행 상태·드로어/시트·파일 첨부 | `slur-design/assets/components/` | `slur-design` |
| **patterns** | [앱 셸 · 인증 셸 · 화면 조립본](/design/screens/) 여덟 장 | `slur-design/assets/patterns/` | `slur-design` |

- UI Guidelines는 **룩 무관**입니다. 기존 디자인이 있는 프로젝트에 적용해도 바뀌는 것은 코드의 구조와 표기법뿐입니다.
- 어휘(design)는 **문법이 있어야 성립**합니다. 컴포넌트 CSS는 global의 리셋·포커스 링과 common의 4상태 스위치를 전제하고, 토큰 실명(`--color-brand` 등)에 의존합니다 — 토큰 없이 컴포넌트만 쓸 수 없습니다.
- 동작은 CSS 밖입니다 — 네이티브 → `slur.js` → 위임의 [3단 우선순위](/js/behaviors/)를 따르며, 기본 동작에는 외부 JS 라이브러리가 필요하지 않습니다. 커스텀 날짜 선택기에만 Vanilla Calendar Pro를 선택적으로 사용합니다.

---

## 사용법 — 대표는 두 가지입니다

| 이렇게 말하면 | 가장 쉬운 차이 | 프로젝트에 적용되는 것 |
|---|---|---|
| **슬러 UI 가이드로 적용해줘** | 디자인은 그대로, 만드는 규칙만 슬러로 | 구조·네이밍·`data-state`·접근성 규칙 + `global.css`·`slur.js` |
| **슬러 디자인시스템으로 적용해줘** | 화면의 생김새까지 슬러로 | UI Guidelines + 토큰 + 현재 프로젝트에서 실제 사용하는 컴포넌트·패턴 |

Design System을 적용해도 모든 컴포넌트를 무조건 넣지는 않습니다. 현재 프로젝트를 먼저 확인하고, 이미 사용 중이거나 이번 기능에 필요한 것만 가져옵니다. 모달을 사용하지 않는 프로젝트에는 `modal.css`와 모달 마크업을 추가하지 않습니다.

**토큰만 적용**은 세 번째 대표 방식이 아닙니다. 기존 컴포넌트를 반드시 유지하면서 색·타이포·간격만 슬러로 바꾸려는 사용자가 그 범위를 명시했을 때만 쓰는 제한 옵션입니다. AI 도구에도 위 두 가지를 기본 호칭으로 사용합니다 — [AI 퀵스타트](/design/ai-quickstart/).

---

## 로드 순서

[CSS 세 파일 구조](/css/global-layer/)에 따라 원본을 묶어 세 개의 `<link>`로 로드합니다. 런타임 `@import`는 순차 폭포를 만들므로 쓰지 않습니다(번들러를 쓰면 같은 순서로 `import`).

```html
<!-- 리셋·토큰·문서 기본값·접근성 -->
<link rel="stylesheet" href="/css/global.css">
<!-- 공통 레이아웃·재사용 컴포넌트 -->
<link rel="stylesheet" href="/css/common.css">
<!-- 해당 화면 전용 -->
<link rel="stylesheet" href="/css/dashboard/page.css">
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
- **모든 실제 색 조합은 WCAG 2.2 AA** — 일반 텍스트 4.5:1, UI 경계·포커스·차트 표식 3:1 이상이며 빌드 전 대비 검사를 통과해야 합니다.
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

현재 폴더의 `.claude/skills/` 아래에 두 스킬이 들어갑니다(Claude Code 프로젝트 스킬). 스크립트가 하는 일은 두 스킬 폴더를 묶은 [`slur-skills.tar.gz`](/skill/slur-skills.tar.gz) 하나를 받아 푸는 것뿐이며, 내용은 [`install.sh`](/skill/install.sh)에서, 파일 목록은 [`manifest.txt`](/skill/manifest.txt)에서, 최신 버전은 [`VERSION`](/skill/VERSION)에서 확인할 수 있습니다(설치된 버전은 각 스킬 폴더의 `VERSION`). 다른 위치는 `SLUR_SKILLS_DIR=<폴더>`로 지정합니다.

| 원본 | 주소 |
|---|---|
| UI 가이드 스킬 | [`slur-guidelines/SKILL.md`](/skill/slur-guidelines/SKILL.md) · [`assets/global.css`](/skill/slur-guidelines/assets/global.css) · [`assets/slur.js`](/skill/slur-guidelines/assets/slur.js) |
| 디자인시스템 스킬 | [`slur-design/SKILL.md`](/skill/slur-design/SKILL.md) · [`assets/tokens/`](/skill/slur-design/assets/tokens/colors.css) · [`assets/components/`](/skill/slur-design/assets/components/button.css) · [`assets/patterns/`](/skill/slur-design/assets/patterns/app-shell.css) |
| 화면 조립본 목차 | [`patterns/screens/index.html`](/skill/slur-design/assets/patterns/screens/index.html) |
| 컴포넌트 데모 | [`system/demo.html`](/system/demo.html) |

프로젝트에 넣을 때는 먼저 현재 화면과 컴포넌트를 확인합니다. 토큰과 실제 사용하는 컴포넌트만 프로젝트 CSS 폴더로 **복사**하고 기본 원본 `global.css`·`common.css`와 `slur.js`를 함께 두고 위의 세 파일로 묶습니다. 대시보드면 `patterns/app-shell.css`, 로그인류면 `auth-shell.css`처럼 필요한 패턴만 가져옵니다. **화면을 새로 짤 때는 대응하는 [조립본](/design/screens/)을 복사해 시작합니다** — 사이드바·4상태·토스트·모달·삭제 확인·보기/편집 전환·단계 전환·온보딩 체크리스트가 규칙대로 들어 있습니다. 사용자가 기존 컴포넌트 유지와 토큰만 적용을 명시한 경우에만 `tokens/`만 사용합니다.
