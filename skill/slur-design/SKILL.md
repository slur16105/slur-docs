---
name: slur-design
description: SLUR Design System — 시각 어휘(디자인 토큰과 컴포넌트 스타일). SLUR 룩앤필로 UI를 만들 때 이 스킬을 사용한다. "슬러 디자인", "SLUR 디자인으로", "우리 디자인시스템으로", "슬러 룩으로 만들어줘"라는 요청, 또는 SLUR 토큰(색·타이포·간격)이나 기성 컴포넌트(Button, Input, Badge 등)가 필요할 때 참고한다. 호칭 구분 — "슬러 디자인"은 이 스킬과 slur-guidelines 스킬을 **함께** 쓰라는 뜻이다(어휘만 따로 쓸 수 없고 문법이 있어야 성립). "슬러 디자인 토큰만"이라고 하면 tokens-only 모드(토큰만 쓰고 컴포넌트는 프로젝트가 직접). 반대로 "슬러 시스템"(단독)이라고 하면 slur-guidelines 만 적용하고 기존 디자인은 건드리지 않는다.
---

# SLUR Design System (시각 어휘)

이 스킬은 **어휘**를 제공한다 — 색·타이포·간격 토큰과 컴포넌트의 생김새. **문법**(클래스 네이밍, `data-state`, CSS 작성 규칙, 단위·토큰 운영 원칙)과 **공통 레이어**(`global.css`: 리셋·포커스 링·`a11y_hidden`·4상태 스위치)는 `slur-guidelines` 스킬이 담당하며, 이 시스템의 모든 코드는 그 문법을 따른다. 두 스킬은 항상 함께 쓴다.

## 층과 파일 위치 (이 스킬 폴더 기준 상대경로)

```
slur-design/
├── references/
│   └── recipes.md     # 대시보드 레시피 — 앱 셸·4상태·토스트·메뉴·툴팁·표 정렬/페이지·차트 토큰·다크 토글·위임
└── assets/
    ├── tokens/        # tokens 층 — colors(차트 5슬롯·overlay 포함), typography, spacing, radius, shadows, motion, breakpoints, z-index
    ├── components/    # components 층 — button, input, select, selection, badge, card, alert, modal, navigation, table,
    │                  #                 toast, state, menu, tooltip, pagination
    └── patterns/      # patterns 층 — app-shell(대시보드 앱 셸 layout_app)
```

공통 레이어는 `../slur-guidelines/assets/global.css`, **동작 층은 `../slur-guidelines/assets/slur.js`**(탭·메뉴·툴팁·토스트·드로어·테마 — 룩 무관이라 guidelines가 동봉). 데모·작업 메모는 레포의 `system/`(`demo.html` 컴포넌트 전체, `demo-dashboard.html` 앱 셸 한 장, `README.md`).

## 동작은 어디서 오나 — 3단 우선순위

컴포넌트의 "동작"(키보드·포커스·열고 닫기·알림)은 이 순서로 가져온다. 이 시스템은 어떤 JS 라이브러리에도 의존하지 않는다.

| 순위 | 담당 | 예 |
|---|---|---|
| 1 | **브라우저 네이티브** | 모달 `<dialog>`·`showModal()`, 드롭다운 열고 닫기 `popover="auto"`, 아코디언 `<details>`, 셀렉트 `<select>`, 날짜 `<input type="date">` |
| 2 | **slur.js** (슬러 자체, 바닐라) | 탭 방향키, 메뉴 방향키·위치, 툴팁 호버/포커스/Esc, 토스트 큐, 드로어 inert·포커스 복귀, 테마 전환 |
| 3 | **위임** (검증된 헤드리스 라이브러리) | 콤보박스(검색되는 셀렉트), 메뉴바, 범위 달력 같은 복잡 위젯 — 동작만 빌리고 모양은 이 시스템의 클래스·토큰, 상태는 `data-state` |

위임 예시·React에서의 취급은 `references/recipes.md`.

## 모드 — tokens-only / full

| 요청 | 모드 | 프로젝트에 넣는 것 |
|---|---|---|
| "슬러 디자인으로" | **full** | `global.css` + `tokens/*` + `components/*` |
| "슬러 디자인 토큰만", "색·폰트만 슬러로" | **tokens-only** | `global.css` + `tokens/*` — 컴포넌트는 프로젝트가 토큰으로 직접 만든다 |
| "슬러 시스템으로" (단독) | — | `global.css`만 (slur-guidelines). 이 스킬을 쓰지 않는다 |

컴포넌트 CSS는 토큰 실명(`--color-brand` 등)에 의존하므로 **토큰 없이 컴포넌트만 쓸 수 없다.**

## 프로젝트에 넣는 법

1. 이 스킬 폴더의 `assets/tokens/`·`assets/components/`(full) 또는 `assets/tokens/`(tokens-only)를 프로젝트 CSS 폴더로 **복사**한다. `slur-guidelines/assets/global.css`와 `slur.js`도 함께. 대시보드면 `assets/patterns/app-shell.css`까지. (경로는 이 스킬 폴더 기준 — 심볼릭 링크라면 링크를 따라가면 된다. npm 배포는 추후.)
2. **로드 순서**: `global.css` → `tokens/*.css` → `components/*.css` → `patterns/*.css` → 프로젝트 CSS(레이아웃 → 컴포넌트 → 페이지 → 반응형). 전부 개별 `<link>`(병렬). 런타임 `@import` 금지(순차 폭포). 번들러를 쓰면 같은 순서로 import. `slur.js`는 `<script src="slur.js" defer>` 한 줄(또는 `import 'slur.js'`).
3. 웹폰트는 시스템이 로드하지 않는다 — `--font-sans` 선두가 **Noto Sans KR**이므로 소비자 페이지가 Google Fonts `<link>`(400/500/600/700)를 직접 넣는다. 없으면 시스템 폰트로 폴백.
4. 다크 모드는 `<html data-theme="dark">` 하나로 끝난다. 전환·저장은 `slur.js`의 `theme`(`data-action="theme_toggle"` 버튼), 첫 페인트 깜빡임 방지는 `<head>` 인라인 한 줄 — `references/recipes.md` 「다크 토글」.
5. 필요한 컴포넌트가 여기 없으면 **토큰만으로 새로 조립**한다 — 이름은 slur-guidelines 네이밍, 위치는 프로젝트의 컴포넌트 CSS, 새 토큰·새 hex는 만들지 않는다. 같은 부품이 두 곳 이상에서 반복되면 그때 이 시스템으로 승격을 제안한다.

## 하지 말 것

- **Tailwind·shadcn 등 다른 유틸리티/컴포넌트 클래스와 섞지 않는다.** 동작은 위 3단 우선순위(네이티브 → slur.js → 위임)로 — Radix 같은 헤드리스 라이브러리는 3순위 위임에서만, 그때도 모양은 이 시스템의 클래스와 토큰으로만.
- **새 색상값(hex/rgb)을 만들지 않는다.** 시맨틱 토큰만 쓴다. 번호 프리미티브(`--color-neutral-400` 등) 직접 사용 금지 — 프리미티브는 시맨틱 레이어의 내부 구현이다.
- **인라인 `style=`로 모양을 쓰지 않는다.** 페이지 고유 배치는 `page_*` 블록 하위 `p_*` 클래스로.
- **컴포넌트 CSS 안에서 토큰 값을 재정의하지 않는다.** 값이 바뀌어야 하면 토큰 파일에서.
- **포커스 링을 컴포넌트에서 다시 선언하지 않는다** — `global.css`가 한 곳에서 처리한다.
- `!important`, CSS `id` 선택자, 텍스트 크기의 `px` 사용 금지(slur-guidelines 규칙).

## 핵심 규칙

- **시맨틱 토큰만 사용한다.**
- **다크 모드는 `<html data-theme="dark">`** — 시맨틱 레이어가 재배선되므로 컴포넌트는 손대지 않는다.
- **공유 컨트롤 높이: `2 / 2.5 / 3rem`** (32/40/48, `m_small`/기본/`m_large`).
- **모바일 터치 타깃은 48이 기본** — 아이콘만 있는 단독 버튼은 보이는 크기 = 탭 영역. `.btn.m_icon`(정사각, 기본 40 / `m_large` 48) 또는 햄버거용 `.btn_menu`(48×48 고정).
- **상태색 면 위 텍스트는 on-토큰**: `--color-on-brand` / `-on-danger` / `-on-success` / `-on-warning`. 리터럴 `#fff` 금지.
- 아이콘은 `em`(`1.125em` 기본), `stroke="currentColor"` — 텍스트 크기·색을 따라간다.

## 블록 → 파일 색인

| 블록(클래스) | 파일 |
|---|---|
| `btn`(+ `m_primary` `m_ghost` `m_danger` `m_small` `m_large` `m_full` `m_icon`), `btn_menu` | `components/button.css` |
| `field`, `input_text`(+ `m_textarea` `m_icon_left`), `input_wrap` | `components/input.css` |
| `select` | `components/select.css` |
| `check`, `radio`, `switch` | `components/selection.css` |
| `badge`(+ `m_brand` `m_success` `m_warning` `m_danger` `m_count`), `chip` | `components/badge.css` |
| `card`(+ `m_link` `m_list` `m_stat`) | `components/card.css` |
| `alert`(+ `m_inline` `m_banner`, 상태 변형) | `components/alert.css` |
| `modal_dialog` — `<dialog>` 1순위(`[open]` 정본, `i_wrap` 없이 `i_head`/`i_body`/`i_foot` 직접), `div` 대안은 `data-state` + `i_wrap` | `components/modal.css` |
| `tab_menu`(`i_list[role=tablist]` > `i_tab` + `i_panel`), `nav_side`, `breadcrumb` | `components/navigation.css` |
| `table_wrap`, `table_data`(정렬 `th.m_sort` > `i_sort`, 정본 `aria-sort`) | `components/table.css` |
| `pagination`(현재 페이지 정본 `aria-current="page"`) | `components/pagination.css` |
| `toast_message`(`role="status|alert"` 컨테이너 별도·**같은 자리**, `data-state="show|close"`, + `m_success` `m_warning` `m_danger`; `m_top`은 하단이 막힐 때만 둘 다 함께; 모달 열린 동안 금지) | `components/toast.css` |
| 4상태 슬롯 기본형(`i_status` > `i_loading`/`i_empty`/`i_error` 문장 모양), `empty_state`(+ `m_error` `m_compact`), `skeleton`(+ `m_title` `m_circle` `m_rect` `m_inline`), `spinner`(+ `m_large`) | `components/state.css` |
| `menu_action`(`popover` + `role="menu"`, 정본 `:popover-open`) | `components/menu.css` |
| `tooltip_help`(`popover="manual"` + `role="tooltip"`) | `components/tooltip.css` |
| `layout_app`(`l_side`/`l_panel`/`l_dim` · `l_head` · `l_main` …) | `patterns/app-shell.css` |

4상태 슬롯(`i_status` 안의 `i_loading`/`i_empty`/`i_error`, 그리고 `i_body`)의 **노출 스위치는 `global.css`**(slur-guidelines)가 하고, 이 시스템은 슬롯 기본형과 그 안에 넣는 `empty_state`·`skeleton`·`spinner`의 룩만 준다. 상태 값은 `loading|empty|error|success`.

## 토큰 빠른 참조 (실제 이름 — 추측 금지)

원본 파일을 읽을 수 없는 환경에서도 아래 이름을 그대로 쓴다. 여기 없는 토큰은 존재하지 않는 것이다 — 지어내지 말고 원본을 확인하거나 사용자에게 묻는다.

- **텍스트**: `--color-text-primary` `-secondary` `-muted` `-inverse` `-brand`
- **면**: `--color-surface-page` `-card` `-sunken` `-hover` `-inverse`
- **보더**: `--color-border-subtle` `-default` `-strong` `-focus`
- **브랜드**: `--color-brand` `-hover` `-active` `-soft`, `--color-on-brand`, `--color-focus-ring`
- **상태**: `--color-success` `-warning` `-danger` (+ 각 `-soft`), `--color-on-danger` `-on-success` `-on-warning`
- **오버레이**: `--color-surface-overlay` (모달 `::backdrop`·드로어 딤)
- **차트**: `--color-chart-1` ~ `-5` (범주형 계열, 순서 고정·5개 초과 금지·상태색 재사용 금지. 라이트에서 3·4·5는 대비 3:1 미만이라 직접 라벨·범례·표 필수). 차트 라이브러리(Recharts·Chart.js 등)에는 `getComputedStyle(document.documentElement).getPropertyValue('--color-chart-1')`로 읽어 주입
- **타이포**: `--font-sans`, `--text-xs`(12) `-sm`(14) `-base`(16) `-lg`(18) `-2xl`(24) `-3xl`(30) `-4xl`(36), `--weight-medium`(500) `-semibold`(600) `-bold`(700), `--leading-normal`(1.5) `-relaxed`(1.7, 장문), `--tracking-tight` `-snug` `-wide`
- **간격**: `--space-4` `-8` `-12` `-16` `-20` `-24` (rem, 이름 = px 환산값). **레이아웃 구조 간격(섹션 여백·그리드 갭)은 토큰이 아니라 px 직접** — `--space-32` 같은 토큰은 없다
- **라디우스**: `--radius-4` `-8` `-12` `-full` (px)
- **그림자**: `--shadow-xs` `-sm` `-md` `-lg`
- **모션**: `--duration-fast`(120ms) `-base`(200ms) `-slow`(280ms), `--ease-standard` `-in` `-out` `-spring`
- **z-index**: `--z-base` `-dropdown` `-sticky` `-overlay` `-modal` `-popover` `-toast` (0~600, 100 간격)
- **브레이크포인트**(참조용): `--breakpoint-sm`(640) `-md`(768) `-lg`(1024) `-xl`(1280) — 미디어쿼리에는 px 리터럴 직접 사용

## 완성 후 점검 (디자인 층)

- [ ] 생 색상값(hex/rgb) 0개, 번호 프리미티브 직접 참조 0개
- [ ] 상태색 면 위 텍스트가 on-토큰인가
- [ ] 컴포넌트에 포커스 링 재선언이 없는가
- [ ] `data-theme="dark"`로 바꿔도 깨지는 곳이 없는가(양쪽 확인)
- [ ] 인라인 `style=` 0개, CSS `id` 선택자 0개
- [ ] 로드 순서가 `global → tokens → components → patterns → 프로젝트`인가, `slur.js`가 로드되는가
- [ ] 네이티브가 상태를 갖는 요소(`dialog[open]`·`details[open]`·`:popover-open`·`aria-sort`·`aria-current`)에 `data-state`를 중복해 붙이지 않았는가
- [ ] 토스트 컨테이너(`.toast_message[role=status]`)가 미리 DOM에 있는가, 4상태 블록에 `data-state`가 선언돼 있는가

## 원본과의 관계

- **클로드디자인 프로젝트**(SLUR Design System)는 전체 팔레트를 가진 **디자인 작업대** — 새 역할·컴포넌트 탐색은 거기서 하고, 확정된 것을 `assets/`로 내려받는다(DesignSync).
- **`assets/`는 실사용 서브셋** — usage-driven 원칙 적용. 여기 없는 토큰이 필요하면 임의로 만들지 말고 클로드디자인 팔레트에서 꺼내온다.
