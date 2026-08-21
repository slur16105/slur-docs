# JavaScript 작성 규칙

## 원칙

JavaScript는 HTML과 CSS를 존중한다. 동작만 담당하고 구조나 표현을 침범하지 않는다.

---

## 규칙

- JavaScript는 동작만 담당한다.
- 이벤트는 JavaScript에서 등록한다. (HTML에 인라인 이벤트 사용 금지)
- 상태는 `data-state`로 관리한다.
- HTML과 CSS의 역할을 침범하지 않는다.
- 컴포넌트 단위로 작성한다.
- 전역 사용을 최소화한다.
- 재사용 가능한 구조를 만든다.
- 성능을 고려한다.

---

## 이벤트 등록 방식

```js
// 나쁜 예 — HTML에 인라인 이벤트
<button onclick="openModal()">열기</button>

// 좋은 예 — JavaScript에서 등록
const btnOpen = document.querySelector('.btn_open');
btnOpen.addEventListener('click', openModal);
```

---

## 상태 관리 — `data-state`

클래스로 상태를 관리하지 않는다. `data-state`만 사용한다.

```js
// 나쁜 예 — 클래스로 상태 관리
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('open');

// 좋은 예 — data-state로 상태 관리
element.dataset.state = 'open';
element.dataset.state = 'close';
element.dataset.state = 'loading';
```

---

## 컴포넌트 단위 구조

각 컴포넌트는 독립적인 함수/객체로 관리한다.

```js
// 모달 컴포넌트 — 네이티브 <dialog class="modal_login"> 기준. 상태 정본은 [open], data-state를 붙이지 않는다
const modalLogin = {
  el: document.querySelector('.modal_login'),

  open() {
    this.el.showModal();                          // 배경 inert·Esc 닫기·포커스 복귀는 브라우저 제공
    document.body.dataset.state = 'modal_open';   // 스크롤 잠금 — body는 네이티브 상태가 없으므로 data-state
  },

  close() {
    this.el.close();
  },

  init() {
    const btnOpen = document.querySelector('[data-action="modal_login_open"]');
    const btnClose = this.el.querySelector('.i_close');

    btnOpen?.addEventListener('click', () => this.open());
    btnClose?.addEventListener('click', () => this.close());

    // 닫힘 후처리는 close 이벤트에서 — Esc 등 브라우저가 닫는 경로까지 전부 지나간다
    this.el.addEventListener('close', () => {
      document.body.dataset.state = '';
    });
  }
};

modalLogin.init();
```

`<dialog>`를 쓸 수 없는 커스텀 오버레이(`div[role="dialog"] aria-modal="true"`)는 브라우저가 해 주던 것을 직접 구현한다 — 배경 `inert`, Tab 순환, 포커스 복귀. 상태는 `data-state`로 관리한다.

```js
// 커스텀 오버레이 대안 — 열 때 트리거 기억·배경 inert, 닫을 때 연 버튼으로 복귀
const modalAlert = {
  el: document.querySelector('.modal_alert'),
  bg: document.querySelector('.layout_app'),   // 모달의 형제 요소(배경 전체)
  trigger: null,

  open() {
    this.trigger = document.activeElement;
    this.bg.inert = true;
    this.el.dataset.state = 'open';
    this.el.querySelector('button, a[href], input')?.focus();   // 초기 포커스 = 첫 포커스 가능 요소
  },

  close() {
    this.el.dataset.state = 'close';
    this.bg.inert = false;
    this.trigger?.focus();
  },

  init() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.dataset.state === 'open') this.close();
    });
    this.el.addEventListener('keydown', (e) => {   // Tab이 오버레이 안에서 순환
      if (e.key !== 'Tab') return;
      const items = this.el.querySelectorAll('button, a[href], input, [tabindex="0"]');
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
};
```

---

## data-action 패턴

JS와 HTML 사이 결합을 줄이기 위해 `data-action`을 사용한다.

```html
<button type="button" data-action="modal_login_open">로그인</button>
<button type="button" data-action="tab_switch" data-target="tab1">탭1</button>
```

```js
// 이벤트 위임으로 처리
document.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  if (action === 'modal_login_open') modalLogin.open();
  if (action === 'tab_switch') tabMenu.switch(e.target.dataset.target);
});
```

---

## 로딩 상태 처리

```js
async function submitForm(btn) {
  btn.dataset.state = 'loading';

  try {
    await api.submit(formData);
    btn.dataset.state = 'success';
  } catch (err) {
    btn.dataset.state = 'error';
  } finally {
    setTimeout(() => { btn.dataset.state = ''; }, 2000);
  }
}
```

---

## Next.js / React에서의 적용

React에서도 `data-state` 패턴을 유지한다. 클래스 조합보다 `data-state`로 상태 표현.

```tsx
// 나쁜 예
<div className={`modal_login ${isOpen ? 'active' : ''}`}>

// 좋은 예
<div className="modal_login" data-state={isOpen ? 'open' : 'close'}>
```

```tsx
// 버튼 로딩 상태
<button
  className="btn m_primary"
  data-state={isLoading ? 'loading' : ''}
  disabled={isLoading}
  onClick={handleSubmit}
>
  {isLoading ? '처리 중...' : '확인'}
</button>
```
