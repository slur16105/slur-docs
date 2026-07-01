# 접근성 (Accessibility)

한 줄 원칙: **구조가 명확하면 접근성은 자연히 확보된다.** ARIA는 구조를 대체하지 않는 보조 수단이다. 규칙이 늘어나면 구조부터 다시 점검한다.

## 1. 이미지 대체 텍스트 (alt)

이미지의 **역할**에 따라 작성한다. 많을수록 좋은 게 아니라 정확할수록 좋다.

- **정보 전달** → 핵심 의미만 서술. "이미지", "사진" 같은 표현 금지.
- **기능** → 모양이 아니라 **동작**을 설명.
- **장식** → `alt=""` (보조 기술 읽기 대상에서 제외).
- 주변에 같은 텍스트가 이미 있으면 **중복 alt 금지**(캡션·버튼 텍스트와 동일한 내용).

```html
<!-- 정보: 의미 서술 (❌ alt="이미지" / alt="그래프 사진") -->
<img src="/sales-q4.png" alt="분기별 매출 그래프">

<!-- 기능: 동작 설명 (❌ alt="돋보기 아이콘") -->
<button class="btn m_primary" type="button"><img class="i_icon" src="/icon-search.svg" alt="검색"></button>

<!-- 장식: 빈 alt (❌ alt="장식 이미지") -->
<img class="i_deco" src="/divider.svg" alt="">
```

## 2. 시맨틱 우선 · 최소 ARIA

HTML 기본 요소로 표현 가능하면 ARIA를 쓰지 않는다.

- **비표준 요소로 버튼 흉내 금지**: `div[role=button]` ❌ → `button` ✅ (포커스·키보드가 기본 제공).
- **role 중복 금지**: `button[role=button]`, `nav[role=navigation]` ❌ → 시맨틱 요소는 role 없이 그대로.
- 시맨틱으로 표현 못 하는 커스텀 컴포넌트에만 상태 ARIA를 **최소**로 추가. 상태 자체는 `data-state`로 관리하고, ARIA는 그 상태를 보조 기술에 알리는 용도로만 동기화한다.

```html
<!-- ❌ div로 버튼 흉내 → 키보드·포커스·엔터를 직접 구현해야 함 -->
<div class="btn m_primary" role="button" tabindex="0">저장</div>
<!-- ✅ -->
<button class="btn m_primary" type="button">저장</button>

<!-- ✅ 커스텀 아코디언: data-state로 상태, aria-expanded로 보조 기술에 반영 -->
<div class="accordion" data-state="open">
  <button class="i_trigger" type="button" aria-expanded="true" aria-controls="panel_notice">공지사항</button>
  <div class="i_panel" id="panel_notice"><p class="i_text">점검 안내입니다.</p></div>
</div>
```

## 3. 키보드

마우스 없이 모든 기능이 되어야 한다. 키보드 사용자는 예외 케이스가 아니다.

- 포커스 순서 = **DOM 순서**. 양수 `tabindex` 금지(순서를 인위적으로 뒤섞음).
- 비표준 요소에 포커스가 필요할 때만 `tabindex="0"`으로 자연스러운 흐름에 편입.
- 포커스 스타일 제거 금지. 마우스 클릭엔 안 보이고 키보드 포커스에만 표시하려면 `:focus-visible`.
- Enter/Space = 활성화, Escape = 닫기/취소. 이벤트는 JS에서 등록하고 `data-state`만 토글.

```css
.btn:focus-visible { outline: 2px solid #1a73e8; outline-offset: 2px; border-radius: 4px; }
```

```js
// Esc: 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.dataset.state === "open") modal.dataset.state = "close";
});
// Enter/Space: 토글
trigger.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  const acc = trigger.closest(".accordion");
  acc.dataset.state = acc.dataset.state === "open" ? "close" : "open";
});
```

점검: 마우스 없이 전 기능 수행 가능한가 / 포커스가 사라지거나 갇히지 않는가 / 상태 변경 시 포커스가 적절히 이동하는가 / 포커스 표시가 명확한가.
