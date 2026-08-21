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

## 4. 제목 구조 (heading)

모든 화면은 **h1 하나 + 논리적 제목 구조(h1 › h2 › h3…)** 를 갖는다. 스크린리더 사용자는 제목으로 페이지를 훑고 점프하므로, 제목이 없으면 목록·섹션 탐색이 사실상 불가능하다.

- 페이지 로드 시 **`<title>`** 이 가장 먼저 읽힌다("어느 사이트/페이지인지"). `<title>`은 페이지마다 고유하게 짓는다.
- **`<h1>` 은 그 페이지의 주제**를 담는다. 사이트명·로고를 h1로 쓰지 않는다(모든 페이지 h1이 같아져 정보가 없다). 로고는 h1이 아니라 홈 링크로 둔다.
- 디자인상 **보이는 제목이 없어도** 제목 자체는 있어야 한다 → `a11y_hidden`(global.css)으로 **시각적으로만** 숨긴다. `display:none`/`visibility:hidden`은 보조 기술에서도 사라지므로 금지.
- 제목 레벨을 건너뛰지 않는다(h1 → h3 점프 금지). 카드·항목처럼 반복되는 콘텐츠의 이름을 제목(h2/h3)으로 마크업하면 목록 탐색이 쉬워진다.

```html
<title>Sites · Mobbin</title>
...
<main class="page_discover">
  <h1 class="a11y_hidden">Sites</h1>         <!-- 시각 숨김, 스크린리더는 읽음 -->
  <h2 class="a11y_hidden">Latest sites</h2>
  <ul>
    <li><a href="#"><h3 class="i_name">Farm Minerals</h3> …</a></li>
  </ul>
</main>
```

점검: 페이지에 h1이 정확히 하나 있는가 / 제목 레벨이 건너뛰지 않는가 / 보이는 제목이 없다면 `a11y_hidden`으로 넣었는가 / `<title>`이 페이지 고유한가.

### 시각 숨김 클래스는 이 구현으로 고정한다

`a11y_hidden`은 global.css에 **한 번만** 선언하고 아래 구현을 쓴다. 크기를 0으로 만드는 옛 방식(`width:0; height:0; font-size:0; line-height:0`)은 일부 스크린리더가 **0px 텍스트를 건너뛰어** 읽지 않는다. 기존 코드에서 `blind`·`hidden`·`skip` 같은 이름으로 이 옛 방식이 발견되면 이름과 구현을 함께 교체한다.

```css
.a11y_hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; }
```

### 로고 마크업 표준형

로고는 제목이 아니라 **홈으로 가는 링크**다. 이미지 로고면 `alt`에 사이트명을, 배경 이미지 로고면 `a11y_hidden` 텍스트를 넣는다. `alt=""`로 비우면 링크에 이름이 없어 스크린리더가 "링크"라고만 읽는다.

```html
<!-- ✅ 배경 이미지 로고 -->
<div class="l_logo"><a href="/"><span class="a11y_hidden">Linker 홈</span></a></div>

<!-- ✅ img 로고 -->
<div class="l_logo"><a href="/"><img src="/logo.svg" alt="Linker 홈"></a></div>

<!-- ❌ 모든 페이지의 h1이 사이트명으로 같아진다 / 링크에 이름이 없다 -->
<h1 class="l_logo"><a href="/"><img src="/logo.svg" alt=""></a></h1>
```

## 5. 복합 위젯: 포커스·방향키·알림

목표 기준: **WCAG 2.2 AA · KWCAG 2.2**. 규칙 끝에 근거를 `— APG Dialog · WCAG 2.1.2 · KWCAG 6.1.2` 식으로 병기한다.

**판정** — 다음 중 하나라도 해당하면 복합 위젯이다.

1. 열린 동안 **페이지로 포커스가 새면 안 된다** (모달·드로어) → **A**
2. 그룹 안을 **방향키로** 움직인다 (탭·메뉴·라디오 그룹) → **B**
3. 화면 변화를 **보조 기술에 알려야** 한다 (토스트·로딩/에러 전환) → **C**

떠 있는 레이어의 닫기 규칙은 **D**, 툴팁은 **E**, 셀렉트·콤보박스처럼 복잡하면 위임(**F**).

**구현 순서** — 네이티브(`<dialog>`·`popover`·`<details>`·네이티브 input) → 동봉 `slur.js`(탭·메뉴·툴팁·토스트·드로어: A~E의 참조 구현) → 위임(F). 규칙은 이 문서가, 구현은 그 순서로 가져온다(`js.md` 「동작은 어디서 오나」).

### A. 모달·드로어 — 포커스 관리

- **네이티브 `<dialog>` + `showModal()`이 1순위.** 배경 자동 inert(포커스·클릭·보조기술 차단), Esc 닫기, 닫힐 때 이전 포커스 복귀를 브라우저가 제공한다.
- 상태 정본은 `[open]`이다 — `data-state`를 붙이지 않는다(아래 「네이티브 상태 속성」).
- 커스텀 오버레이(`div[role="dialog"] aria-modal="true"`)를 써야 하면 직접 구현한다: (a) 열린 동안 배경 요소에 `inert`, (b) Tab/Shift+Tab이 오버레이 안에서 순환, (c) 닫히면 연 버튼으로 포커스 복귀.
- **초기 포커스 = 안의 첫 포커스 가능 요소.** 예외 3가지: 긴 본문은 시작부 제목(`tabindex="-1"`), 파괴적 확인은 덜 파괴적인 버튼(취소), 상호작용 요소가 없으면 오버레이 자체.
- 기준 문장은 "포커스를 가둔다"가 아니라 **"모달이 열린 동안 페이지 콘텐츠로 포커스가 새지 않는다"**. 네이티브는 배경 inert로 자동 만족하며, 브라우저 UI(주소창)로 나가는 것은 정상이다.

— APG Dialog (Modal) · WCAG 2.1.2 · 2.4.3 · KWCAG 6.1.1 · 6.1.2

### B. 방향키로 움직이는 위젯 (탭·메뉴·라디오 그룹)

- **Tab은 위젯 사이를, 방향키는 위젯 안을** 움직인다. 탭 5개면 Tab 한 번에 그룹을 통째로 지난다.
- **roving tabindex**: 현재 항목만 `tabindex="0"`, 나머지 `-1`. 방향키 이동 시 `tabindex`·`aria-selected`·`data-state="active"`를 함께 갱신한다. **Home/End**는 처음/끝.
- **탭 활성화 기본값 = 자동**(포커스가 가면 패널 전환). 패널이 비동기 로드라 느리면 수동(Enter/Space).
- **사이트 내비게이션은 방향키 위젯이 아니다.** `nav > ul > li > a`에 `role="menu"`를 쓰지 않는다(가장 흔한 남용). menu 롤은 앱의 동작 메뉴(편집·공유)에만.

— APG Tabs · APG Keyboard Interface · WCAG 2.1.1 · 2.4.3 · KWCAG 6.1.1 · 6.1.2

### C. 상태 변화 알림 (라이브 영역)

- 토스트·상태 메시지의 기본은 **`role="status"`**. 끼어들어야 하는 실패·세션 만료만 **`role="alert"`**.
- 라이브 영역 컨테이너는 **미리 DOM에 있어야** 읽힌다 — "4상태를 마크업에 미리 둔다" 원칙과 같다. 4상태 안내문은 항상 렌더되는 `i_status`(`role="status"`) 상자 안에 두고 안내문만 `display`로 전환한다(`ux-states.md`). 상자 자체가 숨었다 나타나면 읽히지 않는다.
- 알림은 **포커스를 옮기지 않는다.**
- `role="alert"` 메시지는 **자동으로 사라지지 않는다.** `status` 토스트는 자동 소멸을 허용하되, 같은 정보를 다른 곳에서 다시 확인할 수 있어야 한다.

— APG Alert · MDN Live regions · WCAG 4.1.3 · 2.2.1 · KWCAG 8.2.1 · 6.2.1

### D. 떠 있는 레이어의 닫기 규칙

- 모달·드로어·드롭다운·팝오버는 **Esc**로 닫힌다. 비모달 레이어(드롭다운·팝오버)는 **바깥 클릭**으로도 닫힌다 — `popover="auto"`가 기본 제공.
- **파괴적 확인 모달은 바깥 클릭으로 닫지 않는다**(실수 방지). Esc는 취소와 같은 의미로 허용.
- 레이어가 겹치면 Esc는 **맨 위 하나만** 닫는다.
- 떠 있는 레이어가 **포커스된 요소를 완전히 가리면 안 된다**(스티키 토스트 주의).
- **모달이 열려 있는 동안 토스트를 띄우지 않는다.** 모달 안 상태 변화는 모달 안에서 알린다(버튼 글자 변화·`alert.m_inline`·인라인 오류). 네이티브 `<dialog>` 바깥은 inert라 최상위 레이어에 올린 토스트도 닫기·키보드·보조 기술이 닿지 않는다 — `ux-states.md` 토스트 절.

— APG Dialog·Menu · WCAG 1.4.13 · 2.4.11 · KWCAG 6.1.2

### E. 툴팁

**호버와 포커스 모두**에서 뜨고, **Esc로 포커스 이동 없이** 닫히며, 마우스를 툴팁 위로 옮겨도 유지된다. 연결은 `aria-describedby`(설명) 또는 `aria-labelledby`(라벨). **툴팁 안에 버튼·링크를 넣지 않는다** — 그건 팝오버/다이얼로그다. — WCAG 1.4.13

### F. 복잡 위젯은 위임

셀렉트는 **네이티브 `<select>`**, 날짜는 **`<input type="date">`**를 먼저 쓴다. 탭·액션 메뉴·툴팁·토스트·드로어는 동봉 `slur.js`가 A~E대로 처리한다. 그래도 남는 커스텀 콤보박스·범위 달력·메뉴바처럼 동작이 수백 줄인 위젯만 검증된 **헤드리스 라이브러리**에 동작(키보드·ARIA)을 맡기고, 슬러는 **구조·네이밍·`data-state`만** 얹는다 — 「외부 라이브러리 연동」 원칙(라이브러리는 상태 트리거일 뿐) 그대로. 헤드리스 라이브러리 다수가 상태를 `data-state`로 노출하므로 슬러 네이밍과 그대로 호환된다. 위임은 프로젝트의 선택이며 슬러는 어떤 라이브러리도 요구하지 않는다.

### 네이티브 상태 속성 — [open]이 정본

`<dialog>`·`<details>`처럼 **네이티브 요소가 자기 상태를 속성으로 갖는 경우, 그 속성이 상태의 정본**이다. `data-state`를 중복해 붙이지 않고 CSS도 그 속성을 본다(`dialog[open]`, `details[open]`, popover는 `:popover-open`). 브라우저가 Esc 등으로 닫을 때 `open`만 제거하므로, `data-state`를 병용하면 두 상태가 어긋난다. 브라우저가 이미 관리하는 상태를 우리가 다시 관리하지 않는다. 같은 이유로 **표준 ARIA 상태 속성이 있는 것은 그 속성이 정본**이다 — 정렬 `th[aria-sort]`, 현재 페이지 `a[aria-current="page"]`, 탭 선택 `aria-selected`(슬러는 `data-state="active"`를 함께 갱신). (채택 근거·검증 기록: `docs-internal/2026-08-dialog-adoption.md`)

### 보류 (다음 후보)

색 대비(WCAG 1.4.3/1.4.11), 터치 타깃 24px(2.5.8 / KWCAG 6.1.3), 문자 단축키(2.1.4 / KWCAG 6.1.4), 접근 가능한 인증(3.3.8 / KWCAG 7.3.3). "위젯 동작"이 아니므로 이 절에 섞지 않는다. `prefers-reduced-motion`은 global.css에 이미 동봉되어 있다.
