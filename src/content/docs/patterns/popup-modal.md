---
title: 팝업 / 모달 패턴
description: SLUR UX/UI System에서 팝업과 모달 UI를 구조적으로 설계하고 관리하는 기준을 설명합니다.
---

팝업과 모달은
페이지 위에 임시로 표시되는 **상태 기반 UI 구조**입니다.
팝업 / 모달 패턴은 시각적 레이어가 아니라,
UI 흐름을 제어하기 위한 구조적 장치로 취급합니다.

---

## 팝업 / 모달의 역할

팝업과 모달은 다음 역할만을 담당합니다.

- 사용자 흐름을 일시적으로 중단
- 추가 정보 제공 또는 결정 유도
- 단일 목적의 인터랙션 수행

팝업과 모달은
페이지의 일부가 아닌 **독립된 UI 단위**입니다.

---

## 팝업 / 모달의 기본 원칙

팝업 / 모달 패턴은 다음 원칙을 따릅니다.

- 페이지 구조 내부에 종속되지 않습니다.
- 단일 목적만 수행합니다.
- 열림/닫힘은 명확한 상태로 관리합니다.
- 중첩 팝업 사용을 지양합니다.

팝업은
많아질수록 UX와 구조를 모두 복잡하게 만듭니다.

---

## 팝업 / 모달과 구조의 관계

팝업 / 모달은
레이아웃이나 페이지 구조의 내부 요소가 아닙니다.

- 전역 영역에 독립적으로 배치됩니다.
- 페이지 구조와 직접적인 중첩 관계를 가지지 않습니다.
- 컴포넌트를 내부에 포함할 수는 있습니다.

팝업 자체가
하나의 독립적인 구조 단위입니다.

---

## 상태 기반 제어 기준

팝업 / 모달은
반드시 상태 기반으로 제어합니다.

- 열림 / 닫힘 상태를 명확히 정의합니다.
- 상태 변경은 JavaScript에서 관리합니다.
- 시각적 표현은 CSS가 담당합니다.

클래스 토글만으로
암묵적인 제어를 하지 않습니다.

모달 구현의 1순위는 **네이티브 `<dialog>` + `showModal()`** 입니다.
배경 차단(inert), Esc 닫기, 닫힐 때 포커스 복귀를 브라우저가 제공합니다.

팝업·모달 블록은 `modal_` 접두사로 짓습니다(`modal_login`, `modal_alert`).
접두사 기준은 [접두사 참조 표](/reference/prefix-table/)를 따릅니다.

`<dialog>`는 브라우저가 `open` 속성으로 상태를 직접 관리하는 요소이므로,
**상태의 정본은 `data-state`가 아니라 `[open]`** 입니다.
`data-state`를 중복해 붙이면 브라우저가 닫는 경로(Esc)에서 두 상태가 어긋나므로 붙이지 않습니다.
(`<details>`의 `[open]`도 같습니다.
네이티브가 상태를 갖지 않는 일반 블록은 지금처럼 `data-state`를 씁니다.)

```html
<dialog class="modal_login" aria-labelledby="modal_login_title">
  <div class="i_wrap">
    <div class="i_head">
      <h2 class="i_title" id="modal_login_title">로그인</h2>
      <button class="i_close" type="button" aria-label="닫기"></button>
    </div>
    <div class="i_body">
      <!-- 단일 목적 인터랙션 -->
    </div>
  </div>
</dialog>
```

시각적 표현은 CSS가 `[open]`을 보고 결정하고, 배경은 `::backdrop`으로 처리합니다.
닫힌 `<dialog>`는 브라우저가 표시하지 않으므로 별도의 숨김 규칙이 필요 없습니다.

```css
.modal_login { width: 360px; padding: 0; border: 0; border-radius: 8px; }
.modal_login::backdrop { background: rgba(0, 0, 0, 0.55); }
.modal_login .i_wrap { padding: 24px; }
.modal_login .i_head { display: flex; justify-content: space-between; align-items: center; }
```

---

## 팝업 / 모달 설계 기준

팝업 / 모달을 설계할 때는 다음을 점검합니다.

- 이 기능이 정말 팝업이 필요한가
- 페이지 전환으로 해결 가능한가
- 단일 목적을 유지하고 있는가
- 접근성(포커스 이동, 닫기 방식)이 고려되었는가

JavaScript는 `showModal()` / `close()`만 부릅니다.
초기 포커스는 모달 안 첫 포커스 가능 요소로 가고,
닫히면 연 버튼으로 돌아갑니다 — 모두 브라우저 기본 동작입니다.
닫힘 후처리는 `close` 이벤트에 둡니다.
Esc처럼 브라우저가 닫는 경로까지 전부 이 이벤트를 지나갑니다.

```js
const modalLogin = {
  el: document.querySelector('.modal_login'),
  open() { this.el.showModal(); document.body.dataset.state = 'modal_open'; },
  close() { this.el.close(); },
  init() {
    document.querySelector('[data-action="modal_login_open"]')?.addEventListener('click', () => this.open());
    this.el.querySelector('.i_close')?.addEventListener('click', () => this.close());
    this.el.addEventListener('close', () => { document.body.dataset.state = ''; });
  }
};
modalLogin.init();
```

`<dialog>`를 쓸 수 없는 커스텀 오버레이(`div[role="dialog"] aria-modal="true"`)는
브라우저가 해 주던 것을 직접 구현해야 합니다 —
열린 동안 배경에 `inert`, Tab이 오버레이 안에서 순환, 닫을 때 연 버튼으로 포커스 복귀.
이때 상태는 지금처럼 `data-state="open|close"`로 관리합니다.

파괴적 확인 모달(삭제·결제)은 바깥 클릭으로 닫지 않고,
초기 포커스는 덜 파괴적인 버튼(취소)에 둡니다.
포커스 규칙의 전체 기준은 [키보드 내비게이션](/a11y/keyboard/)을 참고하세요.

모달이 열려 있는 동안에는 토스트를 띄우지 않습니다.
모달 안에서 생긴 상태 변화(복사·저장·유효성)는 모달 안에서 알립니다 —
버튼의 글자 변화, `alert.m_inline`, 인라인 오류.
`<dialog>` 바깥은 inert라 토스트를 위에 올려도 닫기·키보드·보조 기술이 닿지 않기 때문입니다.
자세한 기준은 [피드백 원칙](/ux/feedback/)을 참고하세요.

불필요한 팝업은
UI 복잡도의 가장 큰 원인입니다.

---

## 팝업 / 모달 패턴의 목적

팝업 / 모달 패턴은
UI 흐름을 명확히 제어하고,
페이지 구조를 보호하기 위한 기준입니다.

팝업이 명확할수록
사용자 흐름과 코드 구조 모두 안정적으로 유지됩니다.
