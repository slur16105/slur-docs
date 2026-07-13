---
title: 클래스 네이밍 예제
description: SLUR UX/UI System에서 정의한 클래스 네이밍 규칙을 실제 UI 구조 기준으로 설명합니다.
---

이 문서는
SLUR UX/UI System에서 정의한 클래스 네이밍 규칙을
**실제 UI 구조 기준으로 설명하는 Reference 문서**입니다.

HTML 예제는 각 항목별로 분리되어 있으며,
이 문서에서는 **예제가 들어갈 위치와 의도만 설명**합니다.

---

## 컴포넌트 네이밍 (접두사 없음)

컴포넌트는
재사용 가능한 UI의 기본 단위입니다.

- 컴포넌트 클래스에는 접두사를 사용하지 않습니다
- 하나의 컴포넌트는 하나의 책임만 가집니다
- 페이지나 레이아웃에 종속되지 않습니다

```html
<div class="card">
  <h3 class="i_title">Title</h3>
  <p class="i_desc">Description</p>
</div>
```

---

## 내부 요소 네이밍 (i_)

내부 요소는
특정 컴포넌트 내부에서만 의미를 가지는 요소입니다.

- `i_` 접두사를 사용합니다
- 반드시 상위 컴포넌트 블록과 함께 사용됩니다
- 단독으로 사용하지 않습니다

```html
<div class="card">
  <button class="i_button">Action</button>
</div>
```

---

## 수정자 네이밍 (m_)

수정자는
구조를 변경하지 않고 상태나 변형을 표현하기 위한 규칙입니다.

- `m_` 접두사를 사용합니다
- 구조가 아닌 조건을 의미합니다
- 단독으로 사용하지 않습니다

```html
<div class="card m_selected">
  <h3 class="i_title">Title</h3>
</div>
```

---

## 페이지 네이밍 (page_)

페이지는
하나의 화면 단위를 구성하는 구조입니다.

- `page_` 접두사를 사용합니다
- 특정 화면에만 사용됩니다
- 컴포넌트를 조합하는 역할만 수행합니다

```html
<section class="page_home">
  <div class="p_section">
    <div class="card">
      <h3 class="i_title">Title</h3>
    </div>
  </div>
</section>
```

---

## 페이지 내부 요소 네이밍 (p_)

페이지 내부 요소는
해당 페이지에서만 의미를 가지는 구조 요소입니다.

- `p_` 접두사를 사용합니다
- 페이지 블록 내부에서만 사용됩니다
- 컴포넌트로 분리하지 않습니다

이 구조는
페이지 전용 맥락에서만 유지됩니다.

---

## 레이아웃 네이밍 (layout_)

레이아웃은
전역 UI 구조를 담당하는 최상위 구조 단위입니다.

- `layout_` 접두사를 사용합니다
- 페이지나 컴포넌트의 의미를 포함하지 않습니다
- 배치 구조만 담당합니다


```html
<header class="layout_header">
  <nav class="l_nav">
    <ul class="l_list">
      <li class="l_item"><a href="/">Home</a></li>
      <li class="l_item"><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
```

---

## 상태 표현 (data-* 속성)

상태는
구조가 아닌 **조건**으로 취급합니다.

- 상태는 `data-*` 속성으로 표현합니다
- CSS는 상태를 해석해 스타일을 적용합니다
- 클래스 네이밍은 구조만 담당합니다

```html
<div class="accordion" data-state="open">
  <button class="i_trigger">Toggle</button>
  <div class="i_panel">Content</div>
</div>
```

---

## 구조 중첩에 대한 해석 기준

구조 단위 간의 관계는 **포함이 아닌 조합**으로 해석합니다.

- 레이아웃 안에 페이지 또는 컴포넌트는 배치될 수 있습니다
- 페이지 안에 컴포넌트는 배치될 수 있습니다
- 같은 구조 단위끼리의 중첩은 허용하지 않습니다

```html
<!-- 잘못된 예: 컴포넌트 중첩 -->
<div class="card">
  <div class="card"></div>
</div>

<!-- 잘못된 예: 페이지 중첩 -->
<section class="page_home">
  <section class="page_about"></section>
</section>
```

---

## 네이밍 판단 기준 요약

다음 질문에 모두 “예”라고 답할 수 있어야 합니다.

- 클래스명만 보고 구조 범위를 판단할 수 있는가
- 구조와 상태가 명확히 분리되어 있는가
- 내부 요소와 수정자가 단독으로 존재하지 않는가
- 레이아웃, 페이지, 컴포넌트 역할이 섞이지 않았는가

이 기준은
네이밍 규칙의 판단 기준으로 사용됩니다.

---

## 문서의 역할

이 문서는
네이밍 규칙을 나열하는 문서가 아니라,
**실제 코드가 올바른 구조인지 판단하기 위한 기준 문서**입니다.

SLUR UX/UI System은
네이밍을 통해 구조를 강제하고,
구조를 통해 유지보수성을 확보합니다.
