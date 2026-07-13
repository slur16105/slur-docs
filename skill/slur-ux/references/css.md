# CSS 작성 규칙

## 원칙

CSS는 구조를 표현하는 언어다. HTML 구조를 바꾸지 않고, 재사용과 유지보수를 고려해서 작성한다.

---

## 규칙

- **클래스는 한 줄로 작성한다.** 속성 개수와 상관없이 선택자 하나당 한 줄.
- 스타일을 위해 HTML 구조를 변경하지 않는다.
- 공통 스타일을 우선 작성한다.
- 선택자는 2단계를 권장하고 3단계 이상을 지양한다.
- 컴포넌트 단위로 스타일을 작성한다.
- 스타일 변형은 `m_`를 사용한다.
- 상태는 `data-state`를 사용한다.
- 재사용을 우선한다.
- 필요한 경우에만 애니메이션을 사용한다.
- 성능을 고려한다.

---

## 공통 베이스 레이어

"공통 스타일을 우선 작성한다"는 **base 레이어를 컴포넌트보다 먼저 만든다**는 뜻이다. 시스템 기본값(타이포, 색 상속, 포커스)은 base가 담당하고, 컴포넌트 CSS에는 기본값과 **다른 값(변형)**만 남긴다.

- **폼 컨트롤은 body에서 font/color를 상속받지 않는다** (브라우저 UA 스타일). 태그 레벨에서 `inherit`로 상속을 연다.
- **`outline: none`은 반드시 대체 포커스 링과 한 쌍**으로, base에서 한 번만 선언한다. 컴포넌트마다 반복하지 않는다.
- 컨트롤 기본 타이포(예: 본문 16px / 컨트롤 14px)는 시스템 규칙으로 base에 명시한다.

```css
body { margin: 0; background: var(--color-surface-page); font-family: var(--font-sans); font-size: var(--text-base); color: var(--color-text-primary); }
input, textarea, select, button { font-family: inherit; font-size: var(--text-sm); line-height: inherit; color: inherit; }
button { font-weight: var(--weight-medium); line-height: 1; }
input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible { outline: none; box-shadow: var(--color-focus-ring); }
```

```css
/* 컴포넌트에는 변형만 남긴다 — font-family/color/outline 반복 ❌ */
.btn { display: inline-flex; height: 40px; padding: 0 18px; border: 1px solid var(--color-border-default); border-radius: var(--radius-8); background: var(--color-surface-card); cursor: pointer; }
.btn.m_large { height: 48px; padding: 0 24px; font-size: var(--text-base); }
```

---

## 한 줄 작성 규칙 (중요)

클래스 선언은 **속성이 아무리 많아도 한 줄**로 작성한다. 세로로 펼치지 않는다.

이유: 스타일시트 전체를 스크롤 없이 훑을 수 있고, 어떤 클래스들이 있는지 구조가 한눈에 들어온다. 각 클래스가 "무엇인지"를 빠르게 파악하는 것이 세부 속성을 한 줄씩 읽는 것보다 유지보수에 유리하다.

```css
/* 이렇게 (한 줄) */
.btn { display: inline-flex; height: 40px; padding: 0 16px; border: none; border-radius: 4px; background: #e0e0e0; font-size: 14px; color: #333; }

/* 이렇게 하지 않는다 (블럭) */
.btn {
    display: inline-flex;
    height: 40px;
    padding: 0 16px;
    ...
}
```

---

## 속성 작성 순서

한 줄로 쓰더라도 속성은 항상 이 순서를 지킨다. 순서가 고정돼야 한 줄 안에서도 예측 가능하게 읽힌다.

```
display → width/height → margin → padding → border → border-radius
→ background → font → color → text-align → position → overflow → transform → transition
```

적용 예:

```css
.selector { display: flex; width: 100%; margin: 0 auto; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; font-size: 14px; color: #333; position: relative; overflow: hidden; transition: all 0.2s ease; }
```

---

## 선택자 깊이

```css
/* 권장 — 2단계 */
.modal_login .i_head { }
.card_product .i_title { }

/* 지양 — 3단계 이상 */
.modal_login .i_wrap .i_head .i_title { }
```

---

## 스타일 변형 — `m_`

```css
.btn { display: inline-flex; height: 40px; padding: 0 16px; border: none; border-radius: 4px; background: #e0e0e0; font-size: 14px; color: #333; }
.btn.m_primary { background: #007aff; color: #fff; }
.btn.m_outline { border: 1px solid #007aff; background: transparent; color: #007aff; }
.btn.m_large { height: 48px; padding: 0 24px; font-size: 16px; }
.btn.m_small { height: 32px; padding: 0 12px; font-size: 12px; }
```

---

## 상태 스타일 — `data-state`

```css
.modal_login { display: none; }
.modal_login[data-state="open"] { display: flex; }
.btn[data-state="loading"] { opacity: 0.6; pointer-events: none; cursor: not-allowed; }
.input_text[data-state="error"] { border-color: #ff3b30; }
.tab_item[data-state="active"] { border-bottom: 2px solid #007aff; color: #007aff; }
```

---

## 반응형

프로젝트 기준(PC-first 또는 Mobile-first)을 정하고 일관되게 적용한다.

```css
/* PC-first 예시 */
.card_product { width: 300px; }
@media (max-width: 768px) {
    .card_product { width: 100%; }
}

/* Mobile-first 예시 */
.card_product { width: 100%; }
@media (min-width: 769px) {
    .card_product { width: 300px; }
}
```

---

## 디바이스 클래스

```css
.mo_show { display: none; }
.pc_show { display: block; }

@media (max-width: 768px) {
    .mo_show { display: block; }
    .mo_hide { display: none; }
    .pc_show { display: none; }
    .pc_hide { display: block; }
}
```

---

## Next.js에서의 적용

CSS Modules 사용 시에도 동일한 네이밍 원칙과 한 줄 작성을 따른다.

```css
/* modal_login.module.css */
.modal_login { display: none; }
.modal_login[data-state="open"] { display: flex; }
.i_wrap { display: flex; width: 100%; flex-direction: column; }
.i_head { display: flex; align-items: center; justify-content: space-between; }
.btn { display: inline-flex; height: 40px; padding: 0 16px; }
.btn.m_primary { background: #007aff; color: #fff; }
```

Tailwind를 사용하더라도 컴포넌트 구조와 `data-state` 패턴은 유지한다.
