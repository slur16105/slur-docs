# 네이밍 규칙 상세

## 기본 원칙

- 클래스명은 짧고 명확하게 작성한다.
- 언더바(`_`)를 구분자로 사용한다.
- 의미 없는 축약어를 사용하지 않는다.
- 동일한 역할은 동일한 이름을 사용한다.

---

## 구조 범위와 접두사

접두사는 **구조 범위**를 드러낸다. 블록(독립 단위)과 그 내부 요소를 접두사로 구분한다.

| 범위 | 블록 | 내부 요소 |
|------|------|-----------|
| 컴포넌트 | (접두사 없음) | `i_` |
| 팝업/모달 | `modal_` | `i_` |
| 페이지 | `page_` | `p_` |
| 레이아웃 | `layout_` | `l_` |

같은 범위 접두사는 중첩할 수 없다(`page_` 안에 `page_` ❌, 컴포넌트 안에 컴포넌트 ❌). 서로 다른 범위는 조합만 허용된다.

---

## Page — `page_` (블록) / `p_` (내부)

페이지 최상위 블록은 `page_`, 그 페이지 전용 내부 요소는 `p_`.

```html
<div class="page_main">
  <div class="p_section">...</div>
  <div class="p_aside">...</div>
</div>
```

---

## Layout — `layout_` (블록) / `l_` (내부)

레이아웃 블록은 `layout_`, 그 레이아웃 전용 내부 요소는 `l_`.

```html
<div class="layout_wrap">
  <header class="layout_header">
    <nav class="l_nav">...</nav>
  </header>
  <main class="layout_main">...</main>
  <footer class="layout_footer">...</footer>
</div>
```

---

## Component — (접두사 없음)

독립적인 UI는 컴포넌트명을 그대로 사용한다. 접두사 없음.

```html
<div class="toast_message">...</div>
<div class="tooltip_help">...</div>
<div class="drawer_menu">...</div>
<div class="card_product">...</div>
<div class="tab_menu">...</div>
```

---

## Popup / Modal — `modal_`

팝업·모달은 `modal_` 접두사로 짓는다.

```html
<div class="modal_login" data-state="close">...</div>
<div class="modal_alert" data-state="close">...</div>
```

---

## Inner — `i_`

컴포넌트 내부 요소에 사용한다. 컴포넌트 외부에서는 사용하지 않는다.

```html
<div class="modal_login">
  <div class="i_wrap">
    <div class="i_head">
      <h2 class="i_title">로그인</h2>
    </div>
    <div class="i_body">
      <p class="i_text">...</p>
    </div>
    <div class="i_foot">...</div>
  </div>
</div>
```

공통 inner 클래스:
- `i_wrap` — 내부 전체 래퍼
- `i_head` — 상단 영역
- `i_body` — 본문 영역
- `i_foot` — 하단 영역
- `i_title` — 제목
- `i_text` — 텍스트
- `i_img` — 이미지
- `i_close` — 컴포넌트 전용 닫기 버튼
- `i_btn_wrap` — 버튼 묶음

---

## Modifier — `m_`

스타일 변형에 사용한다. 단독으로 사용하지 않고 컴포넌트 클래스와 함께 사용한다.

```html
<!-- 색상 변형 -->
<button class="btn m_primary">확인</button>
<button class="btn m_outline">취소</button>
<button class="btn m_danger">삭제</button>

<!-- 크기 변형 -->
<button class="btn m_large">크게</button>
<button class="btn m_small">작게</button>
```

---

## State — `data-state`

상태는 클래스로 절대 관리하지 않는다. `data-state` 속성만 사용한다.

```html
<!-- 열림/닫힘 -->
<div class="modal_login" data-state="open">...</div>
<div class="modal_login" data-state="close">...</div>

<!-- 로딩 -->
<button class="btn" data-state="loading">저장 중...</button>

<!-- 활성화 -->
<li class="tab_item" data-state="active">메뉴</li>

<!-- 에러 -->
<input class="input_text" data-state="error">
```

CSS에서 상태 스타일:
```css
.modal_login[data-state="open"] { display: block; }
.modal_login[data-state="close"] { display: none; }
```

---

## Device — `mo_` / `pc_`

```html
<div class="mo_show">모바일에서만 보임</div>
<div class="mo_hide">모바일에서 숨김</div>
<div class="pc_show">PC에서만 보임</div>
<div class="pc_hide">PC에서 숨김</div>
```
