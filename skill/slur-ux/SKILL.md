---
name: slur-ux
description: SLUR UX/UI System v1.0 — 프론트엔드 UI 개발 표준 시스템. HTML/CSS/JS/컴포넌트 작성, 네이밍 규칙, 접근성, 반응형 구현 등 모든 UI 작업에 이 스킬을 사용한다. 사용자가 컴포넌트 만들기, HTML 구조 작성, CSS 스타일링, 기존 코드 리팩토링, 네이밍 규칙 적용, UI 설계, Next.js/React 컴포넌트 작성을 요청할 때 반드시 이 스킬을 참고한다. "SLUR 시스템", "슬러 규칙", "우리 시스템대로", "규칙대로 만들어줘" 라는 말이 나오면 무조건 이 스킬을 사용한다.
---

# SLUR UX/UI System v1.0

## 적용 범위 (중요)

이 스킬은 **문법**만 규정한다 — 구조, 네이밍, 상태(`data-state`), CSS 작성 규칙, 단위·토큰 운영 원칙. **색·크기·모양 같은 시각 값(디자인)은 규정하지 않는다.** 문서와 예시에 등장하는 색상·수치는 설명용 예시일 뿐이며, 실제 값은 언제나 **해당 프로젝트의 기존 디자인과 토큰**을 따른다. 기존 디자인이 있는 프로젝트에 이 스킬을 적용해도 룩이 바뀌어서는 안 된다 — 바뀌는 것은 코드의 구조와 표기법뿐이다. SLUR Design System의 시각 어휘(토큰 값·컴포넌트 룩)가 필요한 경우에만 디자인시스템(slur-docs의 `system/` 또는 클로드디자인 프로젝트)을 별도로 가져와 쓴다.

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
- **JavaScript 규칙** → `references/js.md`
- **컴포넌트 설계 + 재사용 판단** → `references/component.md`
- **접근성** (alt·ARIA·키보드) → `references/accessibility.md`
- **이미지·성능** (포맷·반응형·로딩) → `references/media.md`
- **화면 상태·피드백** (빈/로딩/에러/정상, 토스트·모달) → `references/ux-states.md`
- **검토 체크리스트** → `references/checklist.md`

---

## 리팩토링 시 접근법

기존 코드에 SLUR 시스템을 적용할 때:

1. 네이밍 규칙 우선 변환 (클래스명 → SLUR 체계)
2. `class="active"` 등 상태 클래스 → `data-state` 변환
3. CSS 선택자 깊이 정리
4. JS에서 상태 관리 방식 변환
5. 시맨틱 구조 검토

파일/컴포넌트 단위로 진행하며 한 번에 전체를 바꾸려 하지 않는다.
