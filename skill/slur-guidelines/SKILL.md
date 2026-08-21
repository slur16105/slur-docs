---
name: slur-guidelines
description: SLUR Guidelines — SLUR UX/UI System의 문법(규칙) 스킬. 프론트엔드 UI 개발 표준 규칙. HTML/CSS/JS/컴포넌트 작성, 네이밍 규칙, 상태(data-state), 접근성, 반응형 구현 등 모든 UI 작업에 이 스킬을 사용한다. 사용자가 컴포넌트 만들기, HTML 구조 작성, CSS 스타일링, 기존 코드 리팩토링, 네이밍 규칙 적용, UI 설계, Next.js/React 컴포넌트 작성을 요청할 때 반드시 이 스킬을 참고한다. "슬러 시스템", "SLUR 시스템", "슬러 규칙", "슬러 가이드라인", "우리 시스템대로", "규칙대로 만들어줘" 라는 말이 나오면 무조건 이 스킬을 사용한다. 호칭 구분 — "슬러 시스템"(단독)은 이 스킬만 가리키며 기존 디자인은 그대로 두고 문법만 적용한다(동봉된 공통 레이어 assets/global.css는 룩 무관이므로 함께 쓴다). "슬러 디자인"이라고 하면 slur-design 스킬을 이 스킬과 함께 사용한다.
---

# SLUR Guidelines — SLUR UX/UI System 문법

## 적용 범위 (중요)

이 스킬은 **문법**만 규정한다 — 구조, 네이밍, 상태(`data-state`), CSS 작성 규칙, 단위·토큰 운영 원칙. **색·크기·모양 같은 시각 값(디자인)은 규정하지 않는다.** 문서와 예시에 등장하는 색상·수치는 설명용 예시일 뿐이며, 실제 값은 언제나 **해당 프로젝트의 기존 디자인과 토큰**을 따른다. 기존 디자인이 있는 프로젝트에 이 스킬을 적용해도 룩이 바뀌어서는 안 된다 — 바뀌는 것은 코드의 구조와 표기법뿐이다. SLUR Design System의 시각 어휘(토큰 값·컴포넌트 룩)가 필요한 경우에만 `slur-design` 스킬을 함께 쓴다.

### 층 구조와 이 스킬의 자리

SLUR은 네 층으로 나뉜다. 이 스킬은 **guidelines** 층이고, 나머지 셋은 `slur-design` 스킬이 담는다.

| 층 | 내용 | 스킬 |
|---|---|---|
| **guidelines** | 규칙 문서(이 파일 + `references/`) + 동봉 파일 **`assets/global.css`**(공통 레이어) · **`assets/slur.js`**(동작 층) | `slur-guidelines` |
| tokens | 디자인 토큰 CSS | `slur-design` |
| components | 컴포넌트 CSS | `slur-design` |
| patterns | 조합 레시피(후순위) | `slur-design` |

### 동봉 파일 — `assets/global.css` (공통 레이어)

규칙이 전제하는 최소 CSS를 이 스킬이 직접 동봉한다: 리셋, 폼 컨트롤 상속, **포커스 링 한 쌍**(`outline:none` + 대체 링, 링크·`[tabindex]`·`summary` 포함), `.a11y_hidden`, **4상태 스위치**(블록의 `data-state`가 `loading|empty|error`일 때만 `i_status` 상자 안의 해당 슬롯 `i_loading`/`i_empty`/`i_error`를 보이고 `i_body`를 숨김), `prefers-reduced-motion`. 색·크기는 토큰을 `var(--x, 폴백)`으로 **참조만** 하므로 토큰이 없는 프로젝트(규칙만 적용)에서도 그대로 쓸 수 있다. 룩은 바꾸지 않는다.

- 프로젝트에 넣을 때: 이 스킬 폴더의 `assets/global.css`를 프로젝트 CSS 폴더로 복사해 **가장 먼저** `<link>`한다. 로드 순서 `global.css → (tokens → components → patterns) → 레이아웃 → 컴포넌트 → 페이지 → 반응형`.
- 프로젝트에 이미 리셋 파일이 있으면 두 개를 두지 않고 **합친다**(포커스 링·`a11y_hidden`·4상태 토글·reduced-motion은 반드시 남긴다). 파일명 관례는 `global.css`. `common.css` 같은 "공통 통"은 만들지 않는다 — 공통처럼 보이는 스타일은 `layout_*` 또는 컴포넌트로 간다.

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

**상태는 클래스로 관리하지 않고 반드시 `data-state`를 사용한다.** 같은 구조 범위 접두사는 중첩할 수 없다(예: `page_` 안에 `page_`, 컴포넌트 안에 컴포넌트). 내부 요소(`i_`/`p_`/`l_`)와 수정자(`m_`)는 단독으로 쓰지 않는다.

---

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

클래스는 **속성 개수와 상관없이 항상 한 줄**로 작성한다. 세로 블럭으로 펼치지 않는다. 스타일시트 전체 구조를 스크롤 없이 훑기 위함이다.

속성 순서(한 줄 안에서도 유지):
```
display → width/height → margin → padding → border → border-radius
→ background → font → color → text-align → position → overflow → transform → transition
```

예:
```css
.btn { display: inline-flex; height: 40px; padding: 0 16px; border-radius: 4px; background: #e0e0e0; color: #333; }
.btn.m_primary { background: #007aff; color: #fff; }
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
- Safari 미지원 기능(2026-08 기준 `closedby="any"`, `popover="hint"`, `appearance: base-select` 등)은 **쓰지 않거나**, 없어도 동작이 성립할 때만 **향상 전용**으로 쓴다. Safari가 지원하면 재평가한다.

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
