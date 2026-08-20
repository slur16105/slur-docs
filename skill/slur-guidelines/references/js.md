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
// 모달 컴포넌트
const modalLogin = {
  el: document.querySelector('.modal_login'),

  open() {
    this.el.dataset.state = 'open';
    document.body.dataset.state = 'modal_open';
  },

  close() {
    this.el.dataset.state = 'close';
    document.body.dataset.state = '';
  },

  init() {
    const btnOpen = document.querySelector('[data-action="modal_login_open"]');
    const btnClose = this.el.querySelector('.i_close');

    btnOpen?.addEventListener('click', () => this.open());
    btnClose?.addEventListener('click', () => this.close());

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.dataset.state === 'open') {
        this.close();
      }
    });
  }
};

modalLogin.init();
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
