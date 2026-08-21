---
title: 키보드 내비게이션
description: SLUR UX/UI System에서 키보드만으로 UI를 사용할 수 있도록 설계하는 기준을 설명합니다.
---

키보드 내비게이션은 접근성의 보조 기능이 아니라
**UI 기본 동작 기준**입니다.
마우스 없이도 UI 흐름이 자연스럽게 이어져야 합니다.

접근성을 UI 품질로 다루는 관점은 [접근성 철학](/a11y/philosophy/)을 참고하세요.

---

## 키보드 내비게이션의 기본 원칙

키보드 내비게이션은 다음 원칙을 따릅니다.

- 모든 인터랙션 요소는 키보드로 접근 가능해야 합니다.
- 포커스 이동 순서는 시각적 흐름과 일치해야 합니다.
- 포커스 위치는 항상 시각적으로 확인 가능해야 합니다.

키보드 사용자는
UI의 예외 케이스가 아닙니다.

---

## 포커스 흐름 설계 기준

포커스 흐름은 구조를 기준으로 설계합니다.

- DOM 순서가 곧 포커스 순서입니다.
- 구조적 순서를 CSS로 뒤집지 않습니다.
- 임의의 `tabindex` 사용을 지양합니다.

양수 `tabindex`는 DOM 순서를 무시하고 포커스 순서를 뒤섞으므로 사용하지 않습니다. 비표준 요소에 포커스가 필요할 때만 `tabindex="0"`으로 자연스러운 흐름에 편입시킵니다.

```html
<!-- ❌ 나쁜 예: 양수 tabindex로 순서를 인위적으로 조작 -->
<button class="btn m_primary" type="button" tabindex="3">저장</button>
<a class="i_link" href="/help" tabindex="1">도움말</a>

<!-- ✅ 좋은 예: DOM 순서를 그대로 따르고, 비표준 요소만 0으로 편입 -->
<button class="btn m_primary" type="button">저장</button>
<a class="i_link" href="/help">도움말</a>
<div class="accordion" data-state="close"><button class="i_trigger" type="button">더 보기</button></div>
```

포커스 순서는 DOM 구조를 그대로 따릅니다.

---

## 포커스 가능한 요소 기준

다음 요소는 기본적으로 키보드 접근이 가능해야 합니다.

- 버튼, 링크
- 입력 요소
- 토글, 드롭다운 등 인터랙션 UI

비표준 요소를 사용하는 경우에도
키보드 접근성을 반드시 보장해야 합니다.

---

## 포커스 스타일 규칙

포커스 스타일은 제거하지 않습니다.

- 기본 포커스 스타일을 유지하거나
- 명확한 대체 스타일을 제공합니다.

마우스 클릭에는 표시하지 않고 키보드 포커스에만 표시하려면 `:focus-visible`을 사용합니다.

```css
.btn:focus-visible { outline: 2px solid #1a73e8; outline-offset: 2px; border-radius: 4px; }
.i_trigger:focus-visible { outline: 2px solid #1a73e8; outline-offset: 2px; }
```

포커스가 보이지 않는 UI는
키보드 사용자에게 사용 불가능한 UI입니다.

---

## 키보드 인터랙션 기준

키보드 인터랙션은 다음 기준을 따릅니다.

- Enter, Space 키 동작은 명확히 정의합니다.
- Escape 키는 닫기/취소 역할을 수행해야 합니다.
- 방향키 사용 시 일관된 이동 규칙을 유지합니다.

이벤트는 JS에서 등록하고, 키 입력에 따라 `data-state`만 토글합니다. 스타일은 CSS가 담당합니다.

```js
const modal = document.querySelector(".modal_login");
const trigger = document.querySelector(".accordion .i_trigger");

// Esc: 열린 요소 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.dataset.state === "open") modal.dataset.state = "close";
});

// Enter/Space: 활성화(토글)
trigger.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  const accordion = trigger.closest(".accordion");
  accordion.dataset.state = accordion.dataset.state === "open" ? "close" : "open";
});
```

키보드 동작은
사용자가 예측 가능한 방식으로 동작해야 합니다.

---

## 모달·드로어의 포커스 관리

모달이 열린 동안 페이지 콘텐츠로 포커스가 새지 않아야 하고,
닫히면 포커스가 연 버튼으로 돌아가야 합니다.

- 네이티브 `<dialog>` + `showModal()`을 1순위로 사용합니다. 배경 차단(inert), Esc 닫기, 포커스 복귀를 브라우저가 제공합니다.
- 커스텀 오버레이(`div[role="dialog"]`)를 써야 하면 열린 동안 배경에 `inert`를 붙이고, Tab이 오버레이 안에서 순환하게 하며, 닫을 때 연 버튼으로 포커스를 되돌립니다.
- 초기 포커스는 안의 첫 포커스 가능 요소로 보냅니다. 예외는 세 가지 — 긴 본문은 시작부 제목(`tabindex="-1"`), 삭제·결제 같은 파괴적 확인은 덜 파괴적인 버튼(취소), 상호작용 요소가 없으면 오버레이 자체.
- 기준은 "포커스를 가둔다"가 아니라 **"페이지 콘텐츠로 새지 않는다"**입니다. 브라우저 주소창으로 나가는 것은 정상입니다.

구현 예시는 [팝업/모달 패턴](/patterns/popup-modal/)을 참고하세요.

— APG Dialog · WCAG 2.1.2 · 2.4.3 · KWCAG 6.1.1 · 6.1.2

---

## 방향키로 움직이는 위젯

탭·메뉴·라디오 그룹처럼 그룹 안에서 하나를 고르는 위젯은
**Tab은 위젯 사이를, 방향키는 위젯 안을** 움직입니다.

- roving tabindex — 현재 항목만 `tabindex="0"`, 나머지는 `-1`. 방향키로 이동하면 `tabindex`·`aria-selected`·`data-state`를 함께 갱신합니다. Home/End는 처음/끝으로 이동합니다.
- 탭 활성화 기본값은 자동입니다(포커스가 가면 패널 전환). 패널이 비동기 로드로 느릴 때만 수동(Enter/Space)으로 합니다.
- 사이트 내비게이션은 방향키 위젯이 아닙니다. `nav > ul > li > a`에는 `role="menu"`를 쓰지 않고 Tab으로 이동합니다. menu 롤은 앱의 동작 메뉴(편집·공유)에만 사용합니다.

— APG Tabs · Keyboard Interface · WCAG 2.1.1 · 2.4.3 · KWCAG 6.1.1 · 6.1.2

---

## 떠 있는 레이어의 닫기 규칙

- 모달·드로어·드롭다운·팝오버는 Esc로 닫힙니다. 비모달 레이어(드롭다운·팝오버)는 바깥 클릭으로도 닫힙니다 — `popover="auto"`를 쓰면 브라우저가 기본 제공합니다.
- 파괴적 확인 모달은 바깥 클릭으로 닫지 않습니다(실수 방지). Esc는 취소와 같은 의미로 허용합니다.
- 레이어가 겹치면 Esc는 맨 위 하나만 닫습니다.
- 떠 있는 레이어가 포커스된 요소를 완전히 가리면 안 됩니다.

— APG Dialog·Menu · WCAG 1.4.13 · 2.4.11 · KWCAG 6.1.2

---

## 구현은 어디서 오나

이 문서는 **규칙**입니다. 구현은 [동작 층](/js/behaviors/)의 순서대로 가져옵니다 —
네이티브(`<dialog>`·`popover`·`<details>`) → 동봉 `slur.js`(탭·메뉴·툴팁·토스트·드로어의 참조 구현) → 위임(콤보박스처럼 복잡한 위젯).
규칙을 만족하는지 점검하는 기준은 바뀌지 않고, 직접 쓰는 코드만 줄어듭니다.

---

## 키보드 내비게이션 점검 기준

키보드 내비게이션을 점검할 때는 다음을 확인합니다.

- 마우스를 사용하지 않고 모든 기능을 수행할 수 있는가
- 포커스가 사라지거나 갇히지 않는가
- 상태 변경 시 포커스가 적절히 이동하는가
- 시각적 포커스 표시가 충분히 명확한가

이 네 가지는 키보드 사용자의 최소 사용 조건입니다.

---

## 키보드 내비게이션의 목적

키보드 내비게이션 기준은
모든 사용자가 UI를 동일한 흐름으로 사용할 수 있도록 하기 위한 조건입니다.

접근성을 UI 품질로 다루는 배경은 [접근성 철학](/a11y/philosophy/)에서 다룹니다.
