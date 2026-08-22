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

## 동작은 어디서 오나 — 네이티브 → slur.js → 위임

위젯의 "동작"(키보드·포커스·열고 닫기·알림)은 이 순서로 가져온다. 직접 쓰는 JS는 그만큼 줄고, 슬러는 어떤 라이브러리에도 묶이지 않는다.

| 순위 | 담당 | 예 | 상태 정본 |
|---|---|---|---|
| 1 | **브라우저 네이티브** | 모달 `<dialog>`·`showModal()`, 드롭다운 열고 닫기 `popover="auto"`(Esc·바깥 클릭·최상위 레이어·포커스 복귀 포함), 아코디언 `<details>`, 셀렉트 `<select>`, 날짜 `<input type="date">` | 네이티브 속성 — `[open]`, `:popover-open` (data-state 중복 금지) |
| 2 | **slur.js** (동봉, 바닐라) | 탭 방향키, 메뉴 방향키·위치, 툴팁 호버/포커스/Esc, 토스트 큐, 드로어 inert·포커스 복귀, 테마 전환 | `data-state` (+ 표준 ARIA: `aria-selected`, `aria-expanded`) |
| 3 | **위임** (검증된 헤드리스 라이브러리) | 콤보박스(검색되는 셀렉트)·메뉴바·범위 달력 같은 복잡 위젯 | 라이브러리가 내보내는 `data-state`(대부분 호환) — 표현은 CSS |

- 네이티브가 상태를 속성으로 갖는 요소(`dialog[open]`·`details[open]`·`:popover-open`)와 표준 ARIA 상태(`aria-sort`·`aria-current`·`aria-selected`)는 **그 속성이 정본**이다. `data-state`는 네이티브가 상태를 갖지 않는 일반 블록에 쓴다.
- 팝오버 블록의 `display`는 `:popover-open`에만 쓴다 — 기본 규칙에 두면 브라우저의 닫힘 숨김(`[popover]:not(:popover-open) { display: none }`)을 덮어써 닫힌 팝오버가 투명한 채 남아 클릭을 가로챈다.
- `slur.js`는 `document`에 위임 바인딩하므로 `<script src="slur.js" defer>` 한 줄이면 나중에 추가된 요소에도 동작한다. 모듈별 바인딩과 API는 SKILL.md 「동봉 파일 — slur.js」, 조립 예시는 `slur-design/references/recipes.md`.

```js
// 토스트 — 컨테이너(.toast_message[role="status"])는 미리 DOM에. 알림은 포커스를 옮기지 않는다
slur.toast('저장되었습니다.');                          // 4초 뒤 자동 소멸
slur.toast('저장에 실패했습니다.', { level: 'alert' });   // role="alert" 컨테이너, 수동 닫기

// 드로어·테마는 마크업의 data-action만으로 동작 — JS 호출 없음
// <button data-action="drawer_open" aria-controls="app_side" aria-expanded="false">
// <button data-action="theme_toggle" aria-pressed="false">

// 바뀐 뒤 후처리가 필요하면 커스텀 이벤트를 듣는다(버블링)
document.addEventListener('slur:tabchange', (e) => { /* e.detail.tab */ });
document.documentElement.addEventListener('slur:themechange', (e) => { /* e.detail.mode → 차트 색 다시 읽기 등 */ });
```

React처럼 프레임워크가 상태를 들고 있는 위젯(탭 선택 등)은 `data-state`·ARIA를 프레임워크가 렌더하고, 키 규칙은 `slur.js`의 해당 모듈을 참조 구현 삼아 컴포넌트 안에 옮긴다 — 둘이 같은 속성을 동시에 쓰지 않게 한다. 메뉴·툴팁·토스트·드로어·테마는 프레임워크 상태와 겹치지 않으므로 그대로 쓴다.

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
