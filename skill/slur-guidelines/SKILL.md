---
name: slur-guidelines
description: SLUR UI Guidelines — SLUR UX/UI System의 UI 구현 규칙 스킬. HTML/CSS/JS/컴포넌트 작성, 네이밍, 상태(data-state), 접근성, 반응형 구현 등 모든 UI 작업에 사용한다. 사용자가 컴포넌트 만들기, HTML 구조 작성, CSS 스타일링, 기존 코드 리팩토링, 네이밍 규칙 적용, UI 설계, Next.js/React 컴포넌트 작성을 요청할 때 반드시 참고한다. "슬러 UI 가이드", "SLUR UI Guidelines", "슬러 규칙", "슬러 가이드라인", "규칙대로 만들어줘"는 이 스킬만 적용해 기존 디자인을 유지한다. 기존 호출어인 "슬러 시스템", "우리 시스템대로"도 같은 뜻으로 호환하되, "슬러 디자인시스템", "슬러 디자인", "슬러 룩"이면 slur-design 스킬을 함께 사용한다.
---

# SLUR UI Guidelines — SLUR UX/UI System 구현 규칙

## 적용 범위 (중요)

이 스킬은 UI 구현 **규칙**만 정한다. 쉽게 말하면 UI를 만드는 **문법**이다 — 구조, 네이밍, 상태(`data-state`), CSS 작성 규칙, 단위·토큰 운영 원칙을 다룬다. **색·크기·모양 같은 시각 디자인은 규정하지 않는다.** 문서와 예시에 등장하는 색상·수치는 설명용 예시일 뿐이며, 실제 값은 언제나 **해당 프로젝트의 기존 디자인과 토큰**을 따른다. 단, 실제 UI에 쓰는 색 조합은 WCAG 2.2 AA(일반 텍스트 4.5:1, 큰 텍스트·UI 경계·포커스·필수 그래픽 3:1)를 통과해야 하며 실패한 기존 값은 유지 대상이 아니다. 기존 디자인이 있는 프로젝트에 이 스킬을 적용해도 룩이 불필요하게 바뀌어서는 안 된다 — 바뀌는 것은 코드의 구조와 표기법뿐이다. SLUR Design System의 시각 어휘(토큰 값·컴포넌트 룩)가 필요한 경우에만 `slur-design` 스킬을 함께 쓴다.

SLUR Design System을 함께 적용할 때 기본 UI 아이콘은 **Lucide**다. 선택·출처·라이선스는 `../slur-design/references/icons.md`를 따른다. 이 가이드만 적용하는 기존 화면은 기존 아이콘 디자인을 유지한다.

### 층 구조와 이 스킬의 자리

SLUR은 네 층으로 나뉜다. 이 스킬은 **guidelines** 층이고, 나머지 셋은 `slur-design` 스킬이 담는다.

| 층 | 내용 | 스킬 |
|---|---|---|
| **guidelines** | 규칙 문서(이 파일 + `references/`) + 동봉 파일 **`assets/global.css`**(공통 레이어) · **`assets/slur.js`**(동작 층) | `slur-guidelines` |
| tokens | 디자인 토큰 CSS | `slur-design` |
| components | 컴포넌트 CSS | `slur-design` |
| patterns | 조합 레시피(후순위) | `slur-design` |

문서 사이트 `https://docs.slur.co.kr`가 두 스킬 폴더를 같은 경로로 서빙한다(`/skill/slur-guidelines/SKILL.md`, `/skill/slur-design/...`). 설치: `curl -fsSL https://docs.slur.co.kr/skill/install.sh | sh`(두 스킬 → `.claude/skills/`). 설치본의 버전은 각 스킬 폴더의 `VERSION` 파일(빌드 때 생성 — 저장소 원본에는 없다), 최신 버전은 `https://docs.slur.co.kr/skill/VERSION`. 디자인시스템 섹션 `/design/`, AI 퀵스타트 `/design/ai-quickstart/`.

### 동봉 CSS — `global.css` · `common.css`

프로젝트 CSS는 **`global.css → common.css → page.css`** 순서로 로드한다.

이 구조는 작성자가 실제 작업에서 가장 효율적이라고 확인한 방식이다. CSS의 적용 순서와 덮어쓰기 관계가 여러 파일에 흩어져 바로 파악하기 어려웠던 문제를 해결하는 것이 핵심이며, 기존 방식에 대한 익숙함은 부가적인 배경이다. 사람과 AI가 파일의 역할과 순서를 바로 파악할 수 있는지를 기준으로 삼는다. 로드 파일만 세 개로 묶어도 저작 원본이 복잡하면 이 목적을 완전히 달성한 것은 아니다.

- `global.css`: 리셋, 색상·글꼴·간격 토큰, 문서 기본값, 폼 상속, 포커스 링, `a11y_hidden`, reduced-motion. 동봉 `assets/global.css`는 토큰 폴백을 가진 기본 원본이며 프로젝트의 토큰을 여기에 합친다.
- `common.css`: 공통 레이아웃과 버튼·입력·표·카드·모달 등 재사용 컴포넌트. 동봉 `assets/common.css`의 4상태 슬롯 전환을 포함한다.
- `page.css`: 페이지별 배치와 해당 화면 전용 스타일. `.page_*`로 스코프하고 각 화면에서 자신의 파일만 로드한다. `body`·`html`·`:root` 등 전역 선택자는 두지 않으며 화면 전용 여백·배경도 페이지 블록에 선언한다.
- 기존 리셋은 중복 로드하지 않고 global에 합친다. 각 파일의 반응형 규칙은 그 파일에 둔다. 토큰·컴포넌트 원본을 별도로 유지해도 최종 로드 파일은 이 세 개다. 런타임 `@import`는 금지한다.
- SLUR 디자인을 함께 적용하면 `slur-design/scripts/build-css.mjs`로 토큰을 포함한 global과 공통 컴포넌트를 포함한 common을 생성한다. 상세 기준은 `references/css.md`의 「CSS 세 파일 구조」를 따른다.

### 동봉 파일 — `assets/slur.js` (동작 층)

네이티브가 해 주지 않는 동작만 담은 바닐라 JS(의존성 0, 프레임워크 무관, ~250줄). `references/accessibility.md` 5장의 규칙을 그대로 구현한 **참조 구현**이며, 클래스가 아니라 역할·속성(`role`, `popover`, `data-action`)에 위임 바인딩한다.

| 모듈 | 바인딩 | 하는 일 |
|---|---|---|
| `tabs` | `[role="tablist"]` | ←→(또는 ↑↓)·Home/End, roving tabindex, 자동 활성화(`data-activation="manual"`로 끔) |
| `menu` | `[popover][role="menu"]` | 트리거 기준 위치, 열리면 첫 항목 포커스, ↑↓·Home/End, Tab·항목 선택 시 닫기 |
| `tooltip` | `[role="tooltip"][popover="manual"]` + 트리거 `aria-describedby` | 호버+포커스로 열림, Esc 닫힘, 툴팁 위 유지 |
| `toast` | `.toast_message[role="status|alert"]` 선존재 컨테이너 | `slur.toast(text, { level, duration })` — 큐·자동 소멸·닫기 |
| `drawer` | `[data-action="drawer_open"][aria-controls]` | 열린 동안 형제 `inert`, 첫 포커스, Esc·`drawer_close`로 닫고 연 버튼 복귀 |
| `theme` | `[data-action="theme_toggle"]` | `<html data-theme>` 전환 + `localStorage` 저장 |

동작의 우선순위는 **네이티브 → slur.js → 위임**이다: 모달은 `<dialog>`, 드롭다운 열고 닫기는 `popover="auto"`, 아코디언은 `<details>`, 셀렉트·날짜는 네이티브 input이 먼저고, slur.js는 그 다음, 콤보박스처럼 복잡한 위젯만 검증된 헤드리스 라이브러리에 위임한다(`references/js.md`·`accessibility.md` 5-F). 프로젝트에 넣을 때는 `<script src="slur.js" defer>` 한 줄(또는 `import`).

## 핵심 철학

- 구조는 HTML, 표현은 CSS, 동작은 JavaScript가 담당한다.
- 중복보다 재사용을 우선한다.
- 일관성은 생산성을 만든다.
- 유지보수는 처음부터 고려한다.
- AI도 하나의 협업 도구이다.

---

## 네이밍 빠른 참조

접두사는 **구조 범위**를 드러낸다. 블록과 그 내부 요소를 접두사로 구분한다.

| 접두사 | 의미 | 예시 |
|--------|------|------|
| (없음) | 컴포넌트 블록 | `.card`, `.toast_message` |
| `modal_` | 팝업/모달 블록 | `.modal_login`, `.modal_alert` |
| `page_` | 페이지 블록 | `.page_main` |
| `p_` | 페이지 내부 요소 | `.p_section` |
| `layout_` | 레이아웃 블록 | `.layout_header` |
| `l_` | 레이아웃 내부 요소 | `.l_nav` |
| `i_` | 컴포넌트 내부 요소 | `.i_wrap`, `.i_head`, `.i_close` |
| `m_` | 수정자(스타일 변형) | `.m_primary`, `.m_large` |
| `data-state` | 상태 | `data-state="open"` |
| `mo_` / `pc_` | 디바이스 | `.mo_show`, `.pc_hide` |

**정적 변형은 m_, 실행 상태는 data-*로 구분한다. 네이티브·ARIA가 해당 상태를 제공하면 그 속성을 정본으로 사용하고 중복 저장하지 않는다.** 같은 구조 범위 접두사는 중첩할 수 없다(예: `page_` 안에 `page_`, 컴포넌트 안에 컴포넌트). 내부 요소(`i_`/`p_`/`l_`)와 수정자(`m_`)는 단독으로 쓰지 않는다.

---

## 변경자와 data-* 판단

- m_는 실제 기본형·변형의 차이가 있을 때 사용한다. 모든 사용처에 항상 붙는 변경자는 기본 스타일로 합치며, 가상의 기본형이나 미래 확장만으로 분리하지 않는다. 소유 구조별로 판단하고 라이브러리의 문서화된 지원 옵션과 프로젝트 전용 추상화를 구분한다(`references/naming.md`).
- data-js는 고정 대상, data-action은 기존 액션 계약, 설정 속성은 입력 정보, data-state/data-theme는 실행 상태다. data-js를 상태나 CSS 스타일 조건으로 사용하지 않는다. 기존 ID·role·ARIA·slur.js 계약은 유지한다(`references/js.md`).

## 개발 순서

1. 요구사항 분석
2. 구조 설계
3. 네이밍 설계
4. HTML 작성
5. CSS 작성
6. JavaScript 작성
7. 반응형 적용
8. 테스트 및 검토
9. 리팩토링

---

## CSS 작성 규칙 — 한 줄 + 속성 순서

일반 클래스 스타일은 **속성 개수와 상관없이 항상 한 줄**로 작성한다. 스타일시트 전체 구조를 빠르게 훑기 위함이다.

전역 토큰은 예외다. 조건 없는 기본 토큰을 global.css 상단의 :root 하나에 모으고 공백 4칸·한 줄에 토큰 하나로 펼친다. 묶음은 빈 줄/주석으로 구분한다. 테마·미디어 조건부 재정의와 블록 전용 변수는 합치지 않는다. 분리된 저작 원본을 묶을 때도 생성본은 이 형식을 따른다(`references/css.md`).

속성 순서(한 줄 안에서도 유지):
```
display → width/height → margin → padding → border → border-radius
→ background → font → color → text-align → position → overflow → transform → transition
```

예:
```css
.btn { display: inline-flex; height: 40px; padding: 0 16px; border-radius: 4px; background: #e0e0e0; color: #333; }
.btn.m_primary { background: #1d54e6; color: #fff; }
```

자세한 내용은 `references/css.md` 참고.

---

## 역할 분리 원칙

- **HTML**: 콘텐츠 구조 정의 (시맨틱 태그 사용)
- **CSS**: 표현 담당, 선택자 2단계 권장 (3단계 이상 지양)
- **JavaScript**: 동작만 담당, 이벤트는 JS에서 등록, 상태는 `data-state`로 관리

---

## 브라우저 지원 기준

- 검증은 **Chrome(크로미움 계열)과 Safari** 두 곳만 한다. **Firefox는 검증·판단 대상이 아니다**(차단이 아니라 표준 기반이라 대체로 동작한다는 전제).
- 네이티브 웹 기능 채택의 리트머스는 **Safari 지원 여부** 하나다. Firefox 미지원·지연은 무시한다(예: `@starting-style`은 채택).
- Safari 미지원 기능(2026-08 기준 `closedby="any"`, `popover="hint"`(WebKit 26.5부터 지원 — 이전 Safari가 남아 있는 동안은 같은 취급), `appearance: base-select` 등)은 **쓰지 않거나**, 없어도 동작이 성립할 때만 **향상 전용**으로 쓴다. Safari가 지원하면 재평가한다.

---

## 컴포넌트 vs 내부 요소 판단 (자주 실수하는 지점)

내부 요소인데 재사용될 것 같아서 성급하게 독립 컴포넌트로 빼지 않는다. **개념적 반복(닫기, 아이콘 등)은 실제 재사용이 아니다.**

- **CSS 규칙 하나로 여러 곳을 서비스할 수 있으면** → 독립 컴포넌트 (`btn_close`)
- **각자 스타일을 다시 써야 하면** → 내부 요소 (`i_close`)

예: 토스트 닫기 버튼은 대부분 모달/드로어 닫기와 스타일이 달라서 `i_close`가 맞다. 자세한 기준은 `references/component.md` 참고.

---

## 상세 규칙 참조

작업 성격에 따라 아래 파일을 참고한다.

- **네이밍 상세** → `references/naming.md`
- **HTML 규칙** → `references/html.md`
- **CSS 규칙** → `references/css.md`
- **JavaScript 규칙** (동작 우선순위 · slur.js) → `references/js.md`
- **컴포넌트 설계 + 재사용 판단** → `references/component.md`
- **접근성** (alt·ARIA·키보드·복합 위젯 동작) → `references/accessibility.md`
- **이미지·성능** (포맷·반응형·로딩) → `references/media.md`
- **화면 상태·피드백** (빈/로딩/에러/정상, 토스트·모달) → `references/ux-states.md`
- **모바일 헤더** (고정 여부, 숨김·재노출, 헤더·로고 크기) → `references/mobile-header.md`
- **기존 프로젝트 이관** (SLUR 도입 시 실패 지점과 검증법) → `references/migration.md`
- **검토 체크리스트** → `references/checklist.md`

---

## 리팩토링 시 접근법

기존 코드에 SLUR 시스템을 적용할 때. **작업 전에 `references/migration.md`를 먼저 읽는다** — 접두사 소유권 판단, 손대면 안 되는 이름, 검증 방법이 거기 있다.

1. 네이밍 규칙 우선 변환 (클래스명 → SLUR 체계)
2. `class="active"` 등 상태 클래스 → `data-state` 변환
3. JS에서 상태 관리 방식 변환 + 인라인 이벤트 제거 (`data-action` + 위임)
4. 시맨틱 구조·접근성 검토 (제목 구조, 로고, 버튼/링크 구분)
5. 중복 재선언 정리 (태그 기본값과 겹치는 지역 규칙 → global 또는 컴포넌트)

**선택자 깊이는 이관 범위에 넣지 않는다.** 특이도가 떨어져 다른 규칙에 밀릴 수 있어, 화면이 그대로여야 하는 이관의 전제를 깬다 (`references/css.md` 참고).

파일/컴포넌트 단위로 진행하며 한 번에 전체를 바꾸려 하지 않는다.

### 블록 단위로 끝까지 (부분 적용 금지)

작업 단위를 **파일/블록**으로 쪼개는 것과, **규칙의 일부만** 적용하는 것은 다르다. 한 블록에 손을 댔으면 그 블록의 이름·내부 요소(`l_`/`p_`/`i_`)·상태(`data-state`)를 같은 작업에서 끝낸다. `layout_header`로 바꿔놓고 그 안의 `.logo`·`.inner_box`를 남기면, 나중에 보면 어디까지 이관됐는지 알 수 없어 두 배로 비싸진다.

`inner_box`·`cont`·`list`처럼 **여러 스코프에서 같은 이름이 재사용되는 경우가 반드시 있다.** 전역 치환으로는 못 바꾸므로 부모 블록을 따라가며 문맥별로 바꾼다. 도구가 번거롭다고 규칙 적용 범위를 줄이지 않는다.

구 접두사(`sub_`)와 `popup_`은 이관 시 각각 `layout_`/`page_`, `modal_`로 바꾼다. 이때 `page_` 안에 `page_`가 생기면(공용 껍데기 + 페이지 고유 블록) 공용 껍데기 쪽을 `layout_`으로 돌린다.

완료 판정은 `references/checklist.md`의 「리팩토링」 항목으로 확인한다.
