# SLUR Design System — 데모·작업 메모

클로드디자인 프로젝트 [SLUR Design System](https://claude.ai/design/p/c9449985-b8f5-40fc-8ef6-128b40f79649)을 **slur-guidelines 문법으로 구현**한 결과물의 데모와 운영 메모. CSS 원본은 v1.5.0부터 **스킬 폴더에 동봉**된다 — 이 폴더에는 데모와 이 문서만 남는다.

## 층과 위치

| 층 | 위치 | 스킬 |
|---|---|---|
| **guidelines** (규칙) + 동봉 `global.css`(공통 레이어) | `skill/slur-guidelines/` · `skill/slur-guidelines/assets/global.css` | `slur-guidelines` |
| **tokens** (디자인 토큰) | `skill/slur-design/assets/tokens/` | `slur-design` |
| **components** (컴포넌트 CSS) | `skill/slur-design/assets/components/` | `slur-design` |
| **patterns** (조합 레시피) | `skill/slur-design/assets/patterns/`(`app-shell.css`) · `skill/slur-design/references/recipes.md` | `slur-design` |
| **브랜드** (logo.svg · favicon.svg) | `skill/slur-design/assets/brand/` — 화면·데모의 `l_logo`(라이트/다크 img)와 파비콘 | `slur-design` |
| **동작 층** (slur.js — 탭·메뉴·툴팁·토스트·드로어·테마) | `skill/slur-guidelines/assets/slur.js` | `slur-guidelines` |
| 데모·메모 | `system/demo.html`(컴포넌트 전체) · `system/README.md` | — |
| **화면 조립본**(dashboard · login · list · settings · signup · reset · detail · onboarding) | `skill/slur-design/assets/patterns/screens/*.html` — 그대로 열리는 HTML(마크업+페이지 CSS+JS) | `slur-design` |

- **디자인시스템(어휘)**: 색·타이포·간격 등 토큰과 컴포넌트 생김새 — 클로드디자인이 원본(source of truth)
- **slur-guidelines(문법)**: 클래스 네이밍(`i_`/`m_`), 상태(`data-state`), CSS 한 줄 작성 규칙 — 이 레포의 `skill/slur-guidelines/`가 원본

두 시스템의 결합 규칙:

| 클로드디자인 원본 | slur-guidelines 변환 |
|---|---|
| 인라인 스타일 `style="..."` | 컴포넌트 클래스 + 한 줄 CSS 규칙 |
| 변형(기본/보조/고스트/위험, 크기) | `m_primary` `m_ghost` `m_danger` `m_small` `m_large` |
| 상태(loading, disabled) | `data-state="loading"`, `disabled` 속성 |
| 시맨틱 토큰만 사용 (numbered primitive 금지) | 동일 — 그대로 유지 |
| 다크 모드 `[data-theme="dark"]` | 동일 — 그대로 유지 |

## 로드 순서

`global.css` → `tokens/*.css` → `components/*.css` → `patterns/*.css` → 프로젝트 CSS(레이아웃 → 컴포넌트 → 페이지 → 반응형), 그리고 `<script src="slur.js" defer>`. 전부 개별 `<link>`(병렬). 리셋·포커스 링·`a11y_hidden`·4상태 슬롯 토글은 global이 담당하고, 컴포넌트 CSS에는 기본값과 다른 변형만 남긴다. `demo.html`과 `patterns/screens/*.html`이 이 순서의 실례다(상대경로). 로컬 확인: 레포 루트에서 `python3 -m http.server 4173` → `http://localhost:4173/system/demo.html`, 화면 조립본은 `http://localhost:4173/skill/slur-design/assets/patterns/screens/index.html`(목차 — 여덟 장).

## 사이트에서 보기

문서 사이트가 `skill/`과 `system/demo.html`을 dev·build 시작 때 `public/`으로 복사해(`scripts/sync-assets.mjs`, `astro.config.mjs`의 통합 훅) 같은 경로로 서빙한다 — 데모 `https://docs.slur.co.kr/system/demo.html`, 조립본 목차 `https://docs.slur.co.kr/skill/slur-design/assets/patterns/screens/index.html`, 스킬 원본 `https://docs.slur.co.kr/skill/slur-guidelines/SKILL.md`. 사이트의 「디자인시스템」 섹션(`/design/`)이 토큰·컴포넌트·조립본을 프레임으로 보여 주고, `/skill/install.sh`가 두 스킬을 `.claude/skills/`에 설치한다(`slur-skills.tar.gz` 하나를 받아 푼다 — 저장소가 비공개라 사이트가 공개 배포 경로. 파일을 하나씩 받지 않는 이유: Cloudflare 이메일 난독화가 HTML 응답을 바꾼다).

## 동작 — 네이티브 → slur.js → 위임

모달은 `<dialog>`(`[open]` 정본), 드롭다운 열고 닫기는 `popover="auto"`(`:popover-open` 정본), 아코디언은 `<details>`. 남는 동작(탭 방향키·메뉴 방향키와 위치·툴팁·토스트 큐·드로어 inert·테마)은 `slur.js`. 콤보박스처럼 복잡한 위젯만 검증된 헤드리스 라이브러리에 위임하되 모양·네이밍·`data-state`는 슬러. 어떤 JS 라이브러리에도 의존하지 않는다. 위치 계산은 slur.js가 한다 — CSS anchor positioning은 Safari 26에서 지원되나 popover 트리거의 암묵적 앵커 지원이 확인되지 않아 보류(확인되면 CSS로 이전).

## 파일 분할과 로드

- 소스(저작)는 카테고리별 파일로 나눈다. 로드는 개별 `<link>`로 한다 — **`@import`가 브라우저에 도달하면 순차 폭포가 생기므로 런타임 사용 금지.**
- 번들 파이프라인(npm 패키징 등)이 생기면 그때 진입점 `index.css`를 빌드 전용으로 재도입한다. `@import`는 빌드 타임에 해석될 때만 허용.
- 웹폰트(**Noto Sans KR**)는 시스템이 강제 로드하지 않는다 — 소비자 페이지가 Google Fonts `<link>`로 직접 넣는다 (demo.html 참고).

## 단위·토큰 기준

- **rem**: 글자 크기, 컨트롤 높이·패딩(2/2.5/3rem = 32/40/48), 텍스트 주변 간격(space 토큰). 기준 질문: "글자 크기를 키웠을 때 함께 커져야 정보 전달이 유지되는가" — https://blog.slur.co.kr/260107-rem/
- **px**: 라디우스, 1px 보더, 그림자, 브레이크포인트, 레이아웃 구조 간격(데모 페이지의 섹션 여백·그리드 갭)
- 루트 폰트 100% 유지(% 환산 트릭 금지), rem 토큰에는 px 환산 주석
- 토큰은 실제 사용처가 생길 때만 추가(미사용 스케일 삭제됨), 반복 생값은 스케일로 스냅. z-index만 레이어 계약으로 전체 유지
- **em**: 텍스트와 나란히 의미를 전달하는 아이콘 크기 — 부모 font-size에 비례, SVG width/height 속성 고정 금지

## 변환 현황

- [x] tokens (colors, typography, spacing, radius, shadows, motion, breakpoints, z-index)
- [x] Button (+ `m_icon` 정사각 변형)
- [x] Input
- [x] Selection
- [x] Badge
- [x] Card
- [x] Alert
- [x] Modal
- [x] Navigation (탭은 `i_list`/`i_panel` 구조로, 1.7.0)
- [x] Table (+ 정렬 `aria-sort`, 1.7.0) · Pagination (1.7.0)
- [x] Modal — `<dialog>` 1순위로 재작성, div 대안 유지 (1.7.0)
- [x] Toast · State(empty_state/skeleton/spinner) · Menu · Tooltip (1.7.0)
- [x] Card `m_stat`, 차트 토큰 `--color-chart-1~5`, `--color-surface-overlay` (1.7.0)
- [x] patterns/app-shell (`layout_app`) (1.7.0) · auth-shell (`layout_auth`) (1.9.0)
- [x] 화면 조립본 screens/ — dashboard(1.8.0, system/demo-dashboard에서 이동) · login · list · settings (1.9.0) · signup · reset · detail · onboarding (1.10.0)
- [ ] 다음 후보: 콤보박스 위임 예시(실제 프로젝트에서 요구가 생기면), 앵커 포지셔닝 전환(Safari 확인 후)

주의: 내부 요소(`i_`/`p_`/`l_`) 선택자는 반드시 블록 하위로 스코프한다(`.page_demo .p_head` ✅, `.p_head` 단독 ❌ — `css/internal-elements.md` 참고). 데모도 같은 규칙을 따른다 — 인라인 `style=`·CSS `id` 선택자 없음.

## 원본과의 의도적 차이

- **상태색 면 위 텍스트**: 원본의 리터럴 `#fff`를 색상별 on-토큰으로 교체. `on-danger`/`on-success`는 흰색(red 4.8:1 ✓ / green 3.3:1 — AA 미달이지만 룩 통일 우선, Slur 결정), `on-warning`은 진한색(5.9:1 ✓). 클로드디자인에 역반영됨.

## 동기화 원칙

클로드디자인 프로젝트와 `assets/`는 계층이 다르다:

- **클로드디자인 = 디자인 토큰(전체 팔레트).** 디자이너의 탐색·실험을 위한 작업대이므로 전체 스케일을 유지한다 — 미사용처럼 보여도 "재고"다.
- **`skill/slur-design/assets/` = UI 토큰(실사용 서브셋).** usage-driven 원칙은 여기에만 적용한다. 새 역할이 필요하면 팔레트에서 꺼내온다.

토큰 값이 바뀌면 클로드디자인 쪽을 먼저 수정하고 여기로 내려받는다(DesignSync). 컴포넌트 CSS는 이 레포가 원본이다 — 클로드디자인의 `.dc.html`은 갤러리/미리보기 용도.
