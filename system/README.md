# SLUR Design System — 데모·작업 메모

클로드디자인 프로젝트 [SLUR Design System](https://claude.ai/design/p/c9449985-b8f5-40fc-8ef6-128b40f79649)을 **slur-guidelines 문법으로 구현**한 결과물의 데모와 운영 메모. CSS 원본은 v1.5.0부터 **스킬 폴더에 동봉**된다 — 이 폴더에는 데모, 화면 전용 `styles/demo/page.css`, 이 문서를 둔다.

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
- 시스템 토큰 정의는 `global.css`에 모읍니다. 가이드만 적용하는 프로젝트는 기존 디자인의 토큰을 유지하고, SLUR 디자인을 쓰는 프로젝트는 디자인 토큰 원본을 합칩니다.
- 토큰·컴포넌트·패턴의 개별 파일은 **저작 원본**으로 유지할 수 있습니다. 브라우저에는 세 파일만 연결하며 원본을 중복 로드하지 않습니다. 런타임 `@import`는 사용하지 않습니다.
- 이 저장소는 `node skill/slur-design/scripts/build-css.mjs`로 `skill/slur-design/assets/css/global.css`와 `common.css`를 생성합니다. 생성본을 직접 수정하지 않습니다. dev·build에서도 자동 재생성합니다.
- 데모와 화면 예제는 `styles/<화면명>/page.css`를 사용합니다. 웹폰트 로드는 별도이며 CSS 세 파일 구조의 대상은 프로젝트 스타일입니다.

## 사이트에서 보기

문서 사이트가 `skill/`과 `system/demo.html`을 dev·build 시작 때 `public/`으로 복사해(`scripts/sync-assets.mjs`, `astro.config.mjs`의 통합 훅) 같은 경로로 서빙한다 — 데모 `https://docs.slur.co.kr/system/demo.html`, 조립본 목차 `https://docs.slur.co.kr/skill/slur-design/assets/patterns/screens/index.html`, 스킬 원본 `https://docs.slur.co.kr/skill/slur-guidelines/SKILL.md`. 사이트의 「디자인시스템」 섹션(`/design/`)이 토큰·컴포넌트·조립본을 프레임으로 보여 주고, `/skill/install.sh`가 두 스킬을 `.claude/skills/`에 설치한다(`slur-skills.tar.gz` 하나를 받아 푼다 — 저장소가 비공개라 사이트가 공개 배포 경로. 파일을 하나씩 받지 않는 이유: Cloudflare 이메일 난독화가 HTML 응답을 바꾼다).

## 동작 — 네이티브 → slur.js → 위임

모달은 `<dialog>`(`[open]` 정본), 드롭다운 열고 닫기는 `popover="auto"`(`:popover-open` 정본), 아코디언은 `<details>`. 남는 동작(탭 방향키·메뉴 방향키와 위치·툴팁·토스트 큐·드로어 inert·테마)은 `slur.js`. 서버 검색·다중 선택 콤보박스처럼 복잡한 위젯만 검증된 헤드리스 라이브러리에 위임하되 모양·네이밍·`data-state`는 슬러. 기본 동작에는 외부 JS 라이브러리가 필요 없으며 커스텀 날짜 선택기는 동봉한 Vanilla Calendar Pro를 선택적으로 사용한다. 위치 계산은 slur.js가 한다 — CSS anchor positioning은 Safari 26에서 지원되나 popover 트리거의 암묵적 앵커 지원이 확인되지 않아 보류(확인되면 CSS로 이전).

## 파일 분할과 로드

- 소스(저작)는 카테고리별 파일로 나눈다. 브라우저 로드는 `global.css → common.css → page.css` 세 개의 `<link>`로 한다 — **`@import`가 브라우저에 도달하면 순차 폭포가 생기므로 런타임 사용 금지.**
- `skill/slur-design/scripts/build-css.mjs`가 저작 원본을 묶는다. dev·build는 배포 복사 전에 이를 실행한다.
- 웹폰트(**Noto Sans KR**)는 시스템이 강제 로드하지 않는다 — 소비자 페이지가 Google Fonts `<link>`로 직접 넣는다 (demo.html 참고).

## 단위·토큰 기준

- **rem**: 글자 크기, 컨트롤 높이·패딩(2/2.5/3rem = 32/40/48), 텍스트 주변 간격(space 토큰). 기준 질문: "글자 크기를 키웠을 때 함께 커져야 정보 전달이 유지되는가" — https://blog.slur.co.kr/260107-rem/
- **px**: 라디우스, 1px 보더, 그림자, 브레이크포인트, 레이아웃 구조 간격(페이지 콘텐츠 기본 좌우 거터 16px·섹션 여백·그리드 갭). 16px 거터는 4px 그리드 정합성, 좁은 화면의 유효 폭, 화면 간 시작선 일관성을 위한 값이며 카드 내부 패딩에는 강제하지 않음
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
- [ ] 다음 후보: 서버 검색·다중 선택 콤보박스 위임 예시(실제 프로젝트에서 요구가 생기면), 앵커 포지셔닝 전환(Safari 확인 후)

주의: 내부 요소(`i_`/`p_`/`l_`) 선택자는 반드시 블록 하위로 스코프한다(`.page_demo .p_head` ✅, `.p_head` 단독 ❌ — `css/internal-elements.md` 참고). 데모도 같은 규칙을 따른다 — 인라인 `style=`·CSS `id` 선택자 없음.

## 원본과의 의도적 차이

- **WCAG AA 색 대비가 배포 기준**: 일반 텍스트 4.5:1, UI 경계·포커스·차트 표식 3:1 이상. 상태 전경과 솔리드 면을 별도 토큰으로 분리하고, 라이트·다크 최종 합성색 140쌍을 `npm run check:contrast`로 빌드 전에 검사한다. 클로드디자인에는 이 토큰 계약을 역반영한다.

## 동기화 원칙

클로드디자인 프로젝트와 `assets/`는 계층이 다르다:

- **클로드디자인 = 디자인 토큰(전체 팔레트).** 디자이너의 탐색·실험을 위한 작업대이므로 전체 스케일을 유지한다 — 미사용처럼 보여도 "재고"다.
- **`skill/slur-design/assets/` = UI 토큰(실사용 서브셋).** usage-driven 원칙은 여기에만 적용한다. 새 역할이 필요하면 팔레트에서 꺼내온다.

토큰 값이 바뀌면 클로드디자인 쪽을 먼저 수정하고 여기로 내려받는다(DesignSync). 컴포넌트 CSS는 이 레포가 원본이다 — 클로드디자인의 `.dc.html`은 갤러리/미리보기 용도.


## 헤더 배경 — 2026-10-27

공통 앱 셸의 `.layout_app .l_head`는 `--color-surface-header`를 사용한다. 카드 면 색상의 85%와 투명을 혼합하고 `backdrop-filter: blur(12px)`를 적용해 스크롤 콘텐츠가 은은하게 비치도록 한다. 라이트·다크 모두 현재 카드 면 토큰을 따른다. 글자와 로고 자체의 opacity는 바꾸지 않는다.

불투명 `--color-surface-card`를 기본 배경으로 두고, `@supports`에서 블러와 color-mix 지원 시에만 효과를 켠다. WebKit 접두사를 함께 선언한다. 새 sticky 헤더도 이 토큰과 효과를 사용하며, 불필요한 m_ 변경자를 추가하지 않는다. 사이드바·본문 카드·인증 화면에는 자동 확대 적용하지 않는다.

## 확장 컴포넌트 정식 편입 — 2026-10-28

로컬 가이드의 추가 10개 유형과 파일 첨부를 정식 원본으로 편입했다. 총 26개 유형, 25개 CSS 파일(드로어·시트 공유)이다. 저작 원본은 `skill/slur-design/assets/components/`, 선택적 동작은 `assets/js/{components,file-upload,date-time}.js`, 날짜 라이브러리는 `assets/vendor/vanilla-calendar-pro/3.3.1/`에 둔다. 기존 sync-assets 경로를 통해 사이트·설치 패키지에 함께 포함된다.

드로어/시트는 로컬의 페이지 종속 구현 대신 native dialog로 배경 차단·포커스를 관리한다. 날짜/시간은 고정 데모 ID를 제거해 여러 인스턴스를 지원한다. 기본 동작에는 외부 JS가 필요 없고 커스텀 날짜 선택기만 동봉 라이브러리를 선택적으로 로드한다. 로컬 가이드는 참고용이며 정식 수정은 위 원본에서 진행한다.

## 기본 아이콘 — Lucide (2026-10-28)

UI 아이콘은 Lucide를 사용한다. 공식 `lucide-static@1.63.0` SVG 서브셋·전체 라이선스는 `skill/slur-design/assets/vendor/lucide/1.63.0/`에 보관한다. 기능별 매핑과 적용 기준은 `skill/slur-design/references/icons.md`, 공개 문서는 `/design/icons/`다. 컴포넌트 데모·화면 조립본·파일 업로드 삭제 버튼에 정적 인라인으로 적용한다. `node scripts/check-icons.mjs`로 공식 경로 일치와 속성을 검사한다.
