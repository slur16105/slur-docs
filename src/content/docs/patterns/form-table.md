---
title: 폼 및 테이블 패턴
description: SLUR UX/UI System에서 입력 폼과 테이블 UI를 구조적으로 설계하는 기준을 설명합니다.
---

폼(Form)과 테이블(Table)은
데이터를 입력·표현하기 위한 **구조 중심 UI 패턴**입니다.
폼 및 테이블 패턴은 시각적 정렬이 아니라,
역할과 책임을 명확히 분리하기 위한 기준입니다.

---

## 폼과 테이블의 역할

폼과 테이블은 다음 역할을 담당합니다.

- 폼: 사용자 입력 수집
- 테이블: 데이터 구조화 및 표현

이 두 패턴은
구조와 의미가 명확해야 하며,
시각적 표현보다 **데이터 흐름**을 우선합니다.

---

## 폼 패턴 설계 기준

폼을 설계할 때는 다음 기준을 따릅니다.

- 입력 요소는 의미 있는 구조로 그룹화합니다.
- 레이블과 입력 요소의 관계를 명확히 합니다.
- 오류 상태와 안내 메시지는 구조적으로 분리합니다.
- 단일 폼은 하나의 목적만 수행합니다.

폼은
레이아웃을 맞추기 위한 구조가 아니라,
입력 흐름을 표현하는 구조입니다.

`<label for>`와 `<input id>`를 연결하고, 오류는 `data-state="error"`와 `i_error` 메시지로 표현합니다.

```html
<form class="form_login">
  <div class="i_field">
    <label class="i_label" for="login_email">이메일</label>
    <input class="i_input" id="login_email" type="email" name="email" required />
  </div>
  <div class="i_field" data-state="error">
    <label class="i_label" for="login_pw">비밀번호</label>
    <input class="i_input" id="login_pw" type="password" name="password" required />
    <p class="i_error">비밀번호를 입력해 주세요.</p>
  </div>
  <button class="btn m_primary" type="submit">로그인</button>
</form>
```

```css
.i_field {display:flex; flex-direction:column;}
.i_error {display:none; margin-top:4px; font-size:13px; color:#b91c1c;}
.i_field[data-state="error"] .i_error {display:block;}
```

---

## 테이블 패턴 설계 기준

테이블은
데이터의 관계를 표현하는 데에만 사용합니다.

- 레이아웃 목적으로 테이블을 사용하지 않습니다.
- 열과 행의 의미가 명확해야 합니다.
- 반복 구조는 내부 요소 기준으로 관리합니다.
- 테이블 내부에 불필요한 구조 중첩을 지양합니다.

테이블은
데이터 구조를 그대로 드러내야 합니다.

데이터 표현에는 `<thead>`와 `scope`가 있는 `<th>`로 열·행의 의미를 명확히 합니다.

```html
<table class="table_order">
  <thead>
    <tr>
      <th scope="col">주문번호</th>
      <th scope="col">상품명</th>
      <th scope="col">금액</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">A-1024</th>
      <td>무선 키보드</td>
      <td>39,000원</td>
    </tr>
  </tbody>
</table>
```

레이아웃 정렬 목적으로 테이블을 쓰지 않습니다.

```html
<!-- ❌ 나쁜 예: 화면 배치를 위해 table 사용 -->
<table><tr><td>메뉴</td><td>본문</td></tr></table>

<!-- ✅ 좋은 예: 배치는 레이아웃 요소로 -->
<div class="layout_wrap"><nav class="l_nav">메뉴</nav><main class="l_main">본문</main></div>
```

---

## 폼과 테이블의 구조 분리

폼과 테이블은
다음 기준으로 구조를 분리합니다.

- 입력 영역과 설명 영역 분리
- 데이터 영역과 제어 영역 분리
- 상태 표시 영역과 콘텐츠 영역 분리

구조 분리가 명확할수록
상태 처리와 스타일 적용이 단순해집니다.

---

## 상태 관리 기준

폼과 테이블의 상태는
상태 기반 UI 원칙을 따릅니다.

- 유효성 상태
- 오류 상태
- 비활성 상태

상태는 데이터 속성 또는 수정자로 표현하며,
CSS는 상태를 해석해 스타일을 적용합니다.

---

## 폼 및 테이블 패턴의 목적

폼 및 테이블 패턴은
데이터 흐름을 명확히 하고,
구조적 안정성을 유지하기 위한 기준입니다.

입력과 데이터 표현이 명확할수록
UI는 더 예측 가능하고 유지보수하기 쉬워집니다.
