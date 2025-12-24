---
title: 체크리스트
description: SLUR UI System을 적용한 UI 구조와 클래스 네이밍이 올바른지 점검하기 위한 체크리스트입니다.
---

이 문서는  
SLUR UI System을 적용한 UI 구조와 클래스 네이밍이  
**올바르게 설계되었는지 빠르게 점검하기 위한 실무용 체크리스트**입니다.

각 항목은  
“예 / 아니오”로 판단할 수 있어야 하며,  
하나라도 “아니오”라면 구조를 재검토해야 합니다.

---

## 컴포넌트 구조

- 컴포넌트는 하나의 책임만 가지고 있는가
- 컴포넌트 클래스에 접두사를 사용하지 않았는가
- 페이지나 레이아웃 의미가 포함되지 않았는가

```html
<div class="card">
  <h3 class="i_title">Title</h3>
  <p class="i_desc">Description</p>
</div>
```

---

## 내부 요소 사용 규칙 (i_)

- `i_` 요소가 반드시 컴포넌트 내부에서만 사용되는가
- 내부 요소가 단독으로 존재하지 않는가

```html
<div class="card">
  <button class="i_button">Action</button>
</div>
```

---

## 수정자 사용 규칙 (m_)

- 수정자가 상태나 변형만 표현하는가
- 구조를 대체하거나 단독으로 사용되지 않는가

```html
<div class="card m_selected">
  <h3 class="i_title">Title</h3>
</div>
```

---

## 페이지 구조 규칙 (page_, p_)

- 페이지가 컴포넌트를 조합하는 역할만 수행하는가
- 페이지 전용 구조가 `p_`로 구분되어 있는가

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

## 레이아웃 구조 규칙 (layout_, l_)

- 레이아웃이 전역 구조만 담당하는가
- 배치 외의 의미를 포함하지 않는가

```html
<header class="layout_header">
  <nav class="l_nav">
    <a class="l_item" href="/">Home</a>
  </nav>
</header>
```

---

## 상태 표현 방식

- 상태가 클래스가 아닌 `data-*` 속성으로 표현되는가
- 클래스 네이밍이 구조만 담당하는가

```html
<div class="accordion" data-state="open">
  <button class="i_trigger">Toggle</button>
  <div class="i_panel">Content</div>
</div>
```

---

## 구조 중첩 규칙

- 같은 구조 단위가 중첩되지 않았는가
- 구조 간 관계가 “포함”이 아닌 “조합”으로 설계되었는가

```html
<div class="card">
  <div class="card"></div>
</div>

<section class="page_home">
  <section class="page_about"></section>
</section>
```

---

## 최종 점검

다음 질문에 모두 “예”라고 답할 수 있어야 합니다.

- 클래스명만 보고 구조 범위를 판단할 수 있는가
- 구조와 상태가 명확히 분리되어 있는가
- 내부 요소와 수정자가 단독으로 존재하지 않는가
- 레이아웃, 페이지, 컴포넌트 역할이 섞이지 않았는가

이 체크리스트는  
실제 프로젝트에서 **구조 점검 기준표**로 사용됩니다.
