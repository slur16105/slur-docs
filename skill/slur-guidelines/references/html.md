# HTML 작성 규칙

## 원칙

HTML은 콘텐츠의 구조를 정의하는 언어다. 화면을 그리기 위해 불필요한 태그를 추가하지 않는다.

---

## 규칙

- 시맨틱 태그를 사용한다.
- 구조를 먼저 작성한다.
- 최소한의 마크업을 유지한다.
- 필요한 요소에만 클래스를 작성한다.
- 컴포넌트 단위로 구성한다.
- `data-*` 속성을 적극 활용한다.
- 접근성을 기본으로 고려한다.
- 일관된 코드 스타일을 유지한다.

---

## 시맨틱 태그 사용

```html
<!-- 나쁜 예 -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>

<!-- 좋은 예 -->
<header class="layout_header">
  <nav class="l_nav">...</nav>
</header>
<main class="layout_main">...</main>
```

---

## 목록·반복 항목은 목록 태그로

같은 성격의 항목이 반복되면 `<ul>`/`<ol>` > `<li>`로 감싼다 — 내비게이션 링크 묶음, 카드 그리드, 태그 목록 등. 스크린리더가 **"목록, N개 항목"** 으로 읽어 그룹의 크기·경계를 알려주므로, 링크·항목을 평평하게 나열하지 않는다.

```html
<!-- 나쁜 예 — 평평하게 나열 -->
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

## 최소한의 마크업

스타일을 위해 불필요한 div를 추가하지 않는다.

```html
<!-- 나쁜 예 — 스타일 때문에 div를 남발 -->
<div class="btn_wrap">
  <div class="btn_inner">
    <span class="btn_text">확인</span>
  </div>
</div>

<!-- 좋은 예 -->
<button class="btn m_primary" type="button">확인</button>
```

---

## 컴포넌트 구조 예시

```html
<!-- 모달 컴포넌트 — 네이티브 dialog가 1순위. 상태 정본은 [open]이므로 data-state를 붙이지 않는다 (accessibility.md 5-A) -->
<dialog class="modal_login" aria-labelledby="modal_login_title">
  <div class="i_wrap">
    <div class="i_head">
      <h2 class="i_title" id="modal_login_title">로그인</h2>
      <button class="i_close" type="button" aria-label="닫기"></button>
    </div>
    <div class="i_body">
      <form>
        <div class="form_group">
          <label for="email">이메일</label>
          <input type="email" id="email" class="input_text" placeholder="이메일 입력">
        </div>
      </form>
    </div>
    <div class="i_foot">
      <div class="i_btn_wrap">
        <button class="btn m_primary" type="submit">로그인</button>
        <button class="btn m_outline" type="button">취소</button>
      </div>
    </div>
  </div>
</dialog>
```

---

## 버튼 vs 링크 구분

```html
<!-- 동작(이벤트) → button -->
<button type="button">모달 열기</button>
<button type="submit">제출</button>

<!-- 페이지 이동 → a -->
<a href="/about">소개 페이지</a>
```

---

## 폼 접근성

```html
<!-- label과 input 반드시 연결 -->
<label for="user_name">이름</label>
<input type="text" id="user_name" class="input_text">

<!-- 또는 aria-label 사용 -->
<input type="search" class="input_search" aria-label="검색어 입력">
```

---

## Next.js / React에서의 적용

JSX에서도 동일한 네이밍과 구조를 사용한다.

```jsx
// 컴포넌트 파일명은 PascalCase, 클래스명은 SLUR 규칙 그대로
export default function ModalLogin({ isOpen }) {
  return (
    <div className="modal_login" data-state={isOpen ? 'open' : 'close'}>
      <div className="i_wrap">
        <div className="i_head">
          <h2 className="i_title">로그인</h2>
        </div>
        <div className="i_body">
          {/* 내용 */}
        </div>
      </div>
    </div>
  )
}
```
