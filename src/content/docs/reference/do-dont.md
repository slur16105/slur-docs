---
title: 권장 / 비권장 사례
description: SLUR UI System에서 권장하는 UI 구조 설계 방식과 지양해야 할 사례를 비교해 설명합니다.
---

이 문서는  
SLUR UI System에서 **권장되는 UI 구조와 네이밍 방식**,  
그리고 **지양해야 할 사례**를 비교하여 설명하는 Reference 문서입니다.

이 문서의 목적은  
정답 코드를 제시하는 것이 아니라,  
**올바른 판단 기준을 명확히 하는 것**입니다.

HTML 예제는 항목별로 분리되어 있으며,  
이 문서에서는 **예제가 들어갈 위치와 의도만 설명**합니다.

---

## 컴포넌트 구조

### 권장 사례

- 컴포넌트는 하나의 책임만 가집니다
- 접두사를 사용하지 않습니다
- 내부 요소(`i_`)는 컴포넌트 내부에서만 사용됩니다

```html
<div class="card">
  <h3 class="i_title">Title</h3>
  <p class="i_desc">Description</p>
</div>
```

---

### 비권장 사례

- 하나의 컴포넌트가 여러 역할을 가집니다
- 시각적 의미가 클래스명에 포함됩니다
- 내부 요소가 단독으로 사용됩니다

```html
<h3 class="i_title">Title</h3>
<div class="card big_red">
  <p>Description</p>
</div>
```

---

## 수정자 사용

### 권장 사례

- 수정자(`m_`)는 상태나 변형만 표현합니다
- 구조는 변경하지 않습니다
- 기존 블록 클래스와 함께 사용됩니다

```html
<div class="card m_selected">
  <h3 class="i_title">Title</h3>
</div>
```

---

### 비권장 사례

- 수정자가 구조를 대체합니다
- 수정자만 단독으로 사용됩니다
- 시각적 표현만을 위한 수정자가 사용됩니다

```html
<div class="m_selected">
  <h3>Title</h3>
</div>
```

---

## 페이지와 컴포넌트 관계

### 권장 사례

- 페이지(`page_`)는 컴포넌트를 조합합니다
- 페이지 내부 요소(`p_`)는 페이지 전용으로 사용됩니다
- 컴포넌트는 페이지에 종속되지 않습니다

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

### 비권장 사례

- 페이지 전용 구조가 컴포넌트로 분리됩니다
- 컴포넌트가 특정 페이지 의미를 포함합니다

```html
<div class="home_card">
  <h3 class="i_title">Title</h3>
</div>
```

---

## 레이아웃 구조

### 권장 사례

- 레이아웃(`layout_`)은 전역 구조만 담당합니다
- 배치와 틀 역할에 집중합니다
- 페이지/컴포넌트 의미를 포함하지 않습니다

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

### 비권장 사례

- 레이아웃 안에 레이아웃이 중첩됩니다
- 레이아웃이 페이지 또는 컴포넌트 역할을 겸합니다

```html
<div class="layout_header">
  <section class="layout_main">
    <h1>Title</h1>
  </section>
</div>
```

---

## 상태 표현 방식

### 권장 사례

- 상태는 `data-*` 속성으로 표현합니다
- 클래스는 구조만 담당합니다
- CSS가 상태를 해석해 스타일을 적용합니다

```html
<div class="accordion" data-state="open">
  <button class="i_trigger">Toggle</button>
  <div class="i_panel">Content</div>
</div>
```

---

### 비권장 사례

- 상태를 클래스명으로 직접 표현합니다
- 구조 클래스가 상태 의미를 포함합니다

```html
<div class="accordion is_open">
  <button>Toggle</button>
  <div>Content</div>
</div>
```

---

## 구조 중첩

### 권장 사례

- 구조 단위는 조합으로만 사용됩니다
- 같은 구조 단위끼리 중첩되지 않습니다

```html
<header class="layout_header">
  <section class="page_home">
    <div class="card">
      <h3 class="i_title">Title</h3>
    </div>
  </section>
</header>
```

---

### 비권장 사례

- 컴포넌트 안에 같은 컴포넌트가 중첩됩니다
- 페이지 안에 다른 페이지가 중첩됩니다

```html
<div class="card">
  <div class="card"></div>
</div>

<section class="page_home">
  <section class="page_about"></section>
</section>
```

---

## 판단 기준 요약

아래 질문에 “예”라고 답할 수 없다면  
해당 구조는 재검토가 필요합니다.

- 이 클래스는 구조를 표현하고 있는가
- 상태와 역할이 분리되어 있는가
- 이 구조는 재사용 가능한가
- 접두사만 보고 구조 범위를 판단할 수 있는가

---

## 문서의 역할

이 문서는  
“이렇게 쓰세요”를 강제하는 문서가 아니라,  
**“이게 맞는 구조인가?”를 판단하기 위한 기준 문서**입니다.

SLUR UI System은  
권장 사례를 통해 방향을 제시하고,  
비권장 사례를 통해 실수를 예방합니다.
