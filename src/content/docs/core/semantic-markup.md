---
title: 시맨틱 마크업
description: SLUR UX/UI System에서 HTML을 콘텐츠의 구조와 의미로 작성하는 기준입니다.
---

HTML은 화면을 그리기 위한 수단이 아니라, **콘텐츠의 구조와 의미를 정의하는 언어**입니다.
보이는 결과는 CSS가 담당하므로, 마크업은 "무엇인가"만 드러냅니다.

---

## 콘텐츠에 맞는 태그를 쓴다

의미를 가진 콘텐츠에는 그 의미에 맞는 시맨틱 태그를 사용합니다.
`div`는 의미가 없을 때의 마지막 선택지입니다.

- 영역: `header` · `nav` · `main` · `section` · `article` · `aside` · `footer`
- 제목: `h1`~`h6` (→ [제목 구조](/a11y/headings/))
- 목록: `ul` · `ol` · `li`
- 표: `table` · `thead` · `tbody` · `th` · `td`

```html
<!-- 나쁜 예 -->
<div class="header">…</div>
<div class="nav">…</div>

<!-- 좋은 예 -->
<header class="layout_header">
  <nav class="l_nav">…</nav>
</header>
<main class="layout_main">…</main>
```

---

## 목록·반복 항목은 목록 태그로

같은 성격의 항목이 반복되면 `ul`/`ol` > `li`로 감쌉니다.
내비게이션 링크 묶음, 카드 그리드, 태그 목록 등이 해당합니다.
스크린리더가 **"목록, N개 항목"** 으로 읽어 그룹의 크기와 경계를 알리므로, 링크나 항목을 평평하게 나열하지 않습니다.

```html
<!-- 나쁜 예 — 링크를 평평하게 나열 -->
<nav class="p_meganav">
  <a class="p_link" href="#">Social</a>
  <a class="p_link" href="#">Business</a>
</nav>

<!-- 좋은 예 — 목록으로 묶음 -->
<nav class="p_meganav">
  <ul class="p_list">
    <li><a class="p_link" href="#">Social</a></li>
    <li><a class="p_link" href="#">Business</a></li>
  </ul>
</nav>
```

---

## 버튼과 링크를 구분한다

- **동작(이벤트)** → `button`
- **페이지 이동(URL)** → `a`

모양이 비슷해도 역할이 다르면 태그가 다릅니다.
`div`에 클릭 이벤트를 붙여 버튼을 흉내 내지 않습니다(포커스·키보드가 사라짐 → [키보드 내비게이션](/a11y/keyboard/)).

```html
<button type="button">모달 열기</button>   <!-- 동작 -->
<a href="/about">소개 페이지</a>            <!-- 이동 -->
```

---

## 최소한의 마크업

스타일을 위해 불필요한 `div`를 추가하지 않습니다. 한 요소로 표현되는 것을 여러 겹으로 감싸지 않습니다.

```html
<!-- 나쁜 예 -->
<div class="btn_wrap"><div class="btn_inner"><span>확인</span></div></div>

<!-- 좋은 예 -->
<button class="btn m_primary" type="button">확인</button>
```

---

## 접근성은 시맨틱에서 시작한다

올바른 태그를 쓰면 접근성의 상당 부분이 자동으로 확보됩니다. 세부 규칙은 접근성 문서를 따릅니다.

- 대체 텍스트 → [대체 텍스트 규칙](/a11y/alt-rules/)
- 제목 구조 → [제목 구조](/a11y/headings/)
- 폼 레이블·ARIA → [ARIA 최소 사용 원칙](/a11y/aria-policy/)
- 키보드 → [키보드 내비게이션](/a11y/keyboard/)
