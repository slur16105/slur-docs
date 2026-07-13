---
title: ARIA 최소 사용 원칙
description: SLUR UX/UI System에서 ARIA 속성을 최소한으로 사용하는 기준과 판단 원칙을 설명합니다.
---

ARIA는 접근성 문제의 기본 해결책이 아닙니다.
구조로 해결할 수 없는 경우에만 사용하는
**보조 수단**으로 취급합니다.

ARIA를 왜 최소화하는지는 [접근성 철학](/a11y/philosophy/)을 따릅니다.
이 문서는 ARIA를 **언제·어떻게 쓰고 무엇을 금지하는지**만 다룹니다.

---

## 원칙

다음 원칙을 기준으로 ARIA 사용 여부를 판단합니다.

- HTML 기본 요소로 의미 표현이 가능한 경우 ARIA를 사용하지 않습니다.
- 역할(role), 상태(state), 속성(property)을 중복 정의하지 않습니다.
- 보조 기술에 혼란을 줄 수 있는 ARIA 사용을 지양합니다.

ARIA는
**없어도 동작하는 구조를 전제로** 사용해야 합니다.

---

## 허용과 금지

다음과 같은 경우에 한해 ARIA 사용을 허용합니다.

- HTML 기본 요소로 의미 표현이 불가능한 경우
- 커스텀 UI 컴포넌트가 접근성 역할을 가져야 하는 경우
- 상태 변화가 시각적으로만 표현되는 경우

다음과 같은 ARIA 사용은 금지합니다.

- 이미 의미를 가진 HTML 요소에 role을 중복 지정
- 시각적 상태와 다른 ARIA 상태 전달
- 상태 변경 없이 고정된 ARIA 속성 사용

버튼이 필요하면 `<button>`을 씁니다.
`<div>`에 role과 tabindex를 얹어 버튼을 흉내내지 않습니다.

```html
<!-- ❌ 나쁜 예: div로 버튼을 흉내내면 키보드/포커스/엔터를 직접 구현해야 한다 -->
<div class="btn m_primary" role="button" tabindex="0">저장</div>

<!-- ✅ 좋은 예: button은 역할·포커스·키보드 조작을 기본 제공한다 -->
<button class="btn m_primary" type="button">저장</button>
```

이미 역할을 가진 요소에 같은 role을 다시 지정하지 않습니다.
`<button>`은 이미 `button` 역할이므로 `role="button"`은 중복입니다.

```html
<!-- ❌ 나쁜 예: 이미 가진 역할을 role로 중복 지정 -->
<button class="btn" type="button" role="button">닫기</button>
<nav role="navigation"><!-- ... --></nav>

<!-- ✅ 좋은 예: 시맨틱 요소는 role 없이 그대로 쓴다 -->
<button class="btn" type="button">닫기</button>
<nav><!-- ... --></nav>
```

시맨틱 요소로 표현할 수 없는 커스텀 컴포넌트에만
상태를 나타내는 최소 ARIA를 더합니다.
상태 자체는 `data-state`로 관리하고, ARIA는 상태를 보조 기술에 알리는 용도로만 씁니다.

```html
<!-- ✅ 좋은 예: 커스텀 아코디언에 aria-expanded만 최소로 부여 -->
<div class="accordion" data-state="open">
  <button class="i_trigger" type="button" aria-expanded="true" aria-controls="panel_notice">공지사항</button>
  <div class="i_panel" id="panel_notice">
    <p class="i_text">7월 정기 점검 안내입니다.</p>
  </div>
</div>
```

```js
// data-state를 토글하고, 같은 값을 aria-expanded에 반영한다
document.querySelector(".accordion .i_trigger").addEventListener("click", (e) => {
  const accordion = e.currentTarget.closest(".accordion");
  const open = accordion.getAttribute("data-state") === "open";
  accordion.setAttribute("data-state", open ? "close" : "open");
  e.currentTarget.setAttribute("aria-expanded", String(!open));
});
```

허용되는 경우에도 ARIA는 최소 범위로만 적용합니다.
중복된 ARIA는 접근성을 개선하지 않고 혼란만 증가시킵니다.

---

## 점검

ARIA를 추가하기 전에는 다음을 점검합니다.

- 시맨틱 HTML로 해결 가능한가
- 구조를 개선하면 ARIA 없이 해결되는가
- ARIA가 실제 사용자에게 도움이 되는가
- 상태 변경이 정확히 반영되는가

ARIA가 필요하다고 느껴질수록
먼저 [구조 모델](/core/structure-model/)을 다시 점검합니다.
