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

모달 루트는 컴포넌트명(`modal_login`)을 그대로 쓰고,  
열림 / 닫힘은 `.active` 같은 클래스가 아니라 `data-state`로만 표현합니다.  
팝업 전용 블록 접두사가 필요하면 [접두사 참조 표](/reference/prefix-table/)의 `popup_`을 사용합니다.

```html
<div class="modal_login" data-state="close" role="dialog" aria-modal="true" aria-labelledby="modal_login_title">
  <div class="i_wrap">
    <div class="i_head">
      <h2 class="i_title" id="modal_login_title">로그인</h2>
      <button class="i_close" type="button" aria-label="닫기"></button>
    </div>
    <div class="i_body">
      <!-- 단일 목적 인터랙션 -->
    </div>
  </div>
</div>
```

시각적 표현은 CSS가 `data-state` 값만 보고 결정합니다.  
닫힘은 `display: none`, 열림은 `display: flex`로, 상태와 스타일이 1:1로 대응합니다.

```css
.modal_login { display: none; position: fixed; inset: 0; }
.modal_login[data-state="open"] { display: flex; }
.modal_login .i_wrap { width: 360px; margin: auto; padding: 24px; border-radius: 8px; background: #fff; }
.modal_login .i_head { display: flex; justify-content: space-between; align-items: center; }
```

---

## 팝업 / 모달 설계 기준

팝업 / 모달을 설계할 때는 다음을 점검합니다.

- 이 기능이 정말 팝업이 필요한가
- 페이지 전환으로 해결 가능한가
- 단일 목적을 유지하고 있는가
- 접근성(포커스 이동, 닫기 방식)이 고려되었는가

JavaScript는 스타일을 직접 만지지 않고 `data-state`만 토글합니다.  
열릴 때는 모달 안으로 초점을 옮기고, `Esc` 키로 닫을 수 있어야 합니다.

```js
const modalLogin = {
  el: document.querySelector('.modal_login'),
  open() { this.el.dataset.state = 'open'; this.el.querySelector('.i_close').focus(); },
  close() { this.el.dataset.state = 'close'; },
  init() {
    document.querySelector('[data-action="modal_login_open"]')?.addEventListener('click', () => this.open());
    this.el.querySelector('.i_close')?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.el.dataset.state === 'open') this.close(); });
  }
};
modalLogin.init();
```

불필요한 팝업은  
UI 복잡도의 가장 큰 원인입니다.

---

## 팝업 / 모달 패턴의 목적

팝업 / 모달 패턴은  
UI 흐름을 명확히 제어하고,  
페이지 구조를 보호하기 위한 기준입니다.

팝업이 명확할수록  
사용자 흐름과 코드 구조 모두 안정적으로 유지됩니다.
