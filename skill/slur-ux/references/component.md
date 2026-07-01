# 컴포넌트 설계

## 원칙

컴포넌트는 독립적으로 관리할 수 있는 UI 단위다. 어디서든 꺼내서 쓸 수 있어야 하고, 내부 변경이 외부에 영향을 주지 않아야 한다.

---

## 규칙

- 독립적으로 동작해야 한다.
- 명확한 루트 클래스를 가진다.
- 내부 요소는 `i_`를 사용한다.
- 스타일 변형은 `m_`를 사용한다.
- 상태는 `data-state`를 사용한다.
- 재사용을 우선한다.
- 과도한 분리는 지양한다.

---

## 컴포넌트 vs 내부 요소 — 재사용 판단 기준

**가장 자주 실수하는 지점이다.** 컴포넌트 내부에 있는 요소(닫기 버튼, 아이콘 등)를 `i_`로 둘지, 독립 컴포넌트(`btn_close` 같은)로 뺄지 판단하는 문제.

### 개념적 반복 ≠ 실제 재사용

"닫기 버튼"은 여러 컴포넌트(모달, 드로어, 토스트)에 반복 등장하기 때문에 **재사용처럼 느껴진다.** 하지만 이건 "닫기"라는 **개념**이 반복되는 것이지, **코드가 재사용되는 것**이 아니다.

실제로 코드가 재사용되려면 **스타일과 동작이 같아야** 한다. 현실에서는 보통 다르다:

- 토스트 닫기 → 어두운 배경 위 작은 흰색 X
- 모달 닫기 → 밝은 배경 위 큰 회색 X, hover 효과
- 드로어 닫기 → 또 다른 위치와 크기

이걸 `btn_close` 하나로 묶으면 `m_dark`, `m_small`, `m_modal`... modifier만 잔뜩 붙어서 오히려 관리가 더 어려워진다. **개념은 같지만 구현이 다르면 그것은 재사용이 아니다.**

### 판단 기준

> **CSS 규칙 하나로 여러 곳을 그대로 서비스할 수 있으면** → 독립 컴포넌트 (`btn_close`)
> **각자 스타일을 다시 써야 하면** → 내부 요소 (`i_close`)

### 실무 지침

- **기본값은 `i_`다.** 내부 요소는 일단 `i_close`, `i_icon`처럼 내부 요소로 둔다.
- **추측으로 미리 빼지 않는다.** "나중에 재사용될 것 같아서" 미리 컴포넌트로 분리하는 것은 SLUR의 "과도한 분리는 지양한다" 원칙 위반이다.
- **실제 반복이 확인되면** (같은 스타일/동작이 2곳 이상 등장) 그때 컴포넌트로 승격한다.

### 예시

```html
<!-- 토스트 닫기: 이 컴포넌트 전용 스타일 → i_close -->
<div class="toast_message" data-state="close">
  <div class="i_wrap">
    <p class="i_text">저장되었습니다.</p>
    <button class="i_close" type="button" aria-label="닫기"></button>
  </div>
</div>
```

```html
<!-- 여러 곳에서 완전히 동일한 스타일/동작으로 반복되는 버튼 → 독립 컴포넌트 -->
<button class="btn m_primary" type="button">확인</button>
```

---

## 컴포넌트 구조 패턴

```html
<!-- 루트 클래스: 컴포넌트명 -->
<div class="[컴포넌트명]" data-state="">
  <!-- 내부: i_ -->
  <div class="i_wrap">
    <div class="i_head">
      <h2 class="i_title"></h2>
      <button class="i_close" type="button" aria-label="닫기"></button>
    </div>
    <div class="i_body">
      <p class="i_text"></p>
    </div>
    <div class="i_foot">
      <div class="i_btn_wrap">
        <!-- 변형: m_ -->
        <button class="btn m_primary" type="button"></button>
      </div>
    </div>
  </div>
</div>
```

---

## 컴포넌트 예시 모음

### 카드

```html
<article class="card_product">
  <div class="i_wrap">
    <div class="i_thumb">
      <img class="i_img" src="" alt="상품명">
    </div>
    <div class="i_body">
      <h3 class="i_title">상품명</h3>
      <p class="i_price">29,000원</p>
    </div>
    <div class="i_foot">
      <button class="btn m_primary" type="button">담기</button>
    </div>
  </div>
</article>
```

### 탭

```html
<div class="tab_menu">
  <ul class="i_list" role="tablist">
    <li class="i_item" role="none">
      <button class="i_btn" type="button" role="tab" data-state="active" aria-selected="true">전체</button>
    </li>
    <li class="i_item" role="none">
      <button class="i_btn" type="button" role="tab" data-state="" aria-selected="false">인기</button>
    </li>
    <li class="i_item" role="none">
      <button class="i_btn" type="button" role="tab" data-state="" aria-selected="false">신규</button>
    </li>
  </ul>
</div>
```

### 토스트

```html
<div class="toast_message" data-state="close" role="alert" aria-live="polite">
  <div class="i_wrap">
    <p class="i_text">저장되었습니다.</p>
    <button class="i_close" type="button" aria-label="닫기"></button>
  </div>
</div>
```

### 드로어 (모바일 메뉴)

```html
<div class="drawer_menu" data-state="close">
  <div class="i_wrap">
    <div class="i_head">
      <h2 class="i_title">메뉴</h2>
      <button class="i_close" type="button" aria-label="닫기"></button>
    </div>
    <nav class="i_body">
      <ul class="i_list">
        <li class="i_item"><a href="/">홈</a></li>
        <li class="i_item"><a href="/about">소개</a></li>
      </ul>
    </nav>
  </div>
  <div class="i_dim" aria-hidden="true"></div>
</div>
```

---

## 재사용 판단 기준 (요약)

같은 구조가 2곳 이상 **같은 스타일/동작으로** 등장하면 컴포넌트로 분리한다. 단 1곳에서만 쓰이거나, 개념만 같고 구현이 다른 UI를 억지로 분리하지 않는다.

---

## Next.js에서의 컴포넌트

파일 구조와 컴포넌트 명은 다를 수 있지만 클래스 네이밍은 SLUR 규칙을 따른다.

```
components/
  ModalLogin/
    index.tsx       → 컴포넌트 로직
    style.module.css → .modal_login, .i_wrap, .i_head ...
```

Props로 변형을 받을 때도 `m_` 클래스 방식을 활용한다.

```tsx
function Button({ variant = 'default', size = '', children, ...props }) {
  return (
    <button
      className={['btn', variant && `m_${variant}`, size && `m_${size}`].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

// 사용
<Button variant="primary" size="large">확인</Button>
// → className="btn m_primary m_large"
```
