# 네이티브 `<dialog>` 채택 결정 기록

- **결정일**: 2026-08-21
- **결정**: 모달의 1순위 구현을 네이티브 `<dialog>` + `showModal()`로 한다. 커스텀 `div[role=dialog]`는 대안으로 유지한다.
- **적용 버전**: 1.6.0 (복합 위젯 접근성 기준과 함께)
- **검증**: Slur가 검증 데모(`verify-native.html`, 이 폴더에 사본)를 **크로미움 + Safari에서 직접 조작해 확인** 후 채택. 자동화 검증(속성·포커스·어긋남 재현)은 세션에서 별도 수행.

---

## 과거에 사용하지 않은 이유 (사실 확인됨)

1. **크로스브라우징 — 결정적 이유.** Safari 15.4(2022-03)·Firefox 98 이전 미지원, **IE11 영구 미지원**. 국내 실무의 IE 지원 요구 아래에서는 선택지가 아니었다.
2. **열림·닫힘 애니메이션 불가.** `display: none` ↔ 표시 전환에 transition이 걸리지 않아, 모션이 필요한 모달은 결국 커스텀으로 돌아가야 했다.
3. **초기 구현의 포커스 처리 편차.** 표준화 초기(~2022) 구현마다 초기 포커스·복귀 동작이 달랐다.

**스타일은 이유가 아니었다.** `<dialog>`의 브라우저 기본 스타일(테두리·패딩·크기·중앙 정렬)은 명세에 적힌 값이라 브라우저 간 동일하고, `::backdrop` 포함 전부 CSS로 재정의된다. 검증 데모 ⑤(같은 룩을 div/dialog로 픽셀 비교)에서 크로미움·Safari 모두 동일함을 확인했다.

## 이제 사용하는 이유

1. **지원 문제 해소.** Chrome 37+ / Safari 15.4+ (전역 96%, Baseline 2022). 슬러의 테스트 기준(Chrome + Safari, Firefox는 테스트하지 않음)에서 걸리는 것이 없다.
2. **애니메이션 문제 해결.** `@starting-style` + `transition-behavior: allow-discrete`로 열림·닫힘 모션 모두 가능 (Chrome 117+ · Safari 17.4+). 미지원 환경에서는 모션만 생략되고 동작은 유지된다 — 점진 향상.
3. **접근성 동작이 기본 제공된다.** `showModal()` 하나로 배경 자동 inert(포커스·클릭·보조기술 차단), Esc 닫기, 닫힐 때 이전 포커스 복귀, 최상위 레이어 표시. 커스텀으로는 각각 직접 구현·유지보수해야 하는 것들이다. "구조가 명확하면 접근성은 따라온다"는 슬러 철학, "네이티브 우선" 원칙과 같은 방향이다.

## 상태 표현 결정 — `[open]`이 정본 (A안)

`<dialog>`에는 `data-state`를 붙이지 않는다. CSS도 `dialog[open]`(·`::backdrop`)을 본다.

- **이유**: 브라우저가 Esc 등으로 닫을 때 `open` 속성만 제거하므로, `data-state`를 병용하면 두 상태가 어긋날 수 있다. 검증 데모 ②에서 실제로 재현됨 — Esc로 닫자 최상위 레이어에서 내려온 모달이 `data-state="open"`을 믿는 CSS 때문에 **본문에 유령처럼 남았다.** `close` 이벤트 동기화로 막을 수는 있으나(B안), 리스너 한 줄을 잊는 순간 같은 버그가 난다.
- **규칙 문장(1.6.0에 명문화)**: 상태는 `data-state`로 표현한다. 단, **네이티브 요소가 자기 상태를 속성으로 갖는 경우(`dialog[open]`, `details[open]`)는 그 속성이 정본이며 `data-state`를 중복해 붙이지 않는다.** 브라우저가 이미 관리하는 상태를 우리가 다시 관리하지 않는다.

## 함께 정리된 판단 (Chrome + Safari 기준)

| 기능 | 판정 | 비고 |
|---|---|---|
| `<dialog>` + `showModal()` | **채택 — 모달 1순위** | 이 문서 |
| `inert` | **채택** | 커스텀 오버레이(대안 경로)의 배경 차단 |
| `popover="auto"` | **채택** | 드롭다운·비모달 레이어의 Esc·바깥 클릭 닫기 |
| `<dialog closedby="any">` | 향상 전용 | Safari 미지원 |
| `popover="hint"` | 제외 | Safari 미지원 |
| `appearance: base-select` | 향상 전용 | Safari 27 예정 |

판단 리트머스는 **Safari 지원 여부** 하나다 (테스트 범위: Chrome + Safari).

## 모달 중 토스트 — 금지 결정 (2026-08-22)

**규칙**: 모달이 열려 있는 동안 토스트를 띄우지 않는다. 모달 안 상태 변화는 모달 안에서 알린다(버튼 글자·아이콘 변화 + 글자/`aria-label` 동반, `alert.m_inline`, 인라인 오류). 모달과 무관한 알림은 닫힌 뒤 띄우고, 끼어들어야 하는 알림(세션 만료)은 모달을 닫고 경고 모달로 대체한다.

**검토한 것**
- 순서를 정한 표준은 없다. APG·WCAG는 알림이 포커스를 옮기지 않을 것(4.1.3), 떠 있는 레이어가 포커스를 가리지 말 것(2.4.11)만 요구한다.
- HTML 표준 top layer: `showModal()` 모달과 `popover`는 같은 최상위 레이어에 **나중에 연 것이 위**. 그러나 모달이 열리면 dialog 바깥 DOM은 전부 "blocked by a modal dialog"(inert). 따라서 모달 뒤에 연 토스트 popover는 **보이지만 inert** — 닫기 버튼 무반응, Tab·가상 커서 불가. Chrome·Firefox 재현 확인(HTMHell 2025-12). 또한 `showModal()`은 열려 있던 `auto` 팝오버를 닫는다(spec "hide popovers until").
- WHATWG 제안 — "모달보다 위에 있는 top-layer 요소는 inert에서 제외"(whatwg/html #10811, 2024-12 / 중복 #11195 → #9936). 2026-08 현재 열림·미구현. 확정·출시되면 "모달 위 토스트 허용"으로 재검토.
- 우회법(토스트 컨테이너를 dialog 안으로 옮기기 + `popover="manual"`)은 동작하지만 구조가 복잡해 에이전트가 매번 틀릴 여지가 크다 — 채택하지 않음.
- 관행은 갈린다: Material(스낵바는 다이얼로그 아래, elevation 낮음) vs Atlassian·Bootstrap·Chakra(z-index 스케일상 토스트가 위). 공개 문서에는 타사 비교를 쓰지 않는다.

**결정 근거**: 슬러 정의에서 답을 끌어낸다 — 토스트 = 흐름을 안 끊는 알림, 모달 = 흐름을 멈춘 상태이므로 둘의 동시 존재는 정의상 모순. 이 규칙이면 브라우저 inert 문제를 통째로 피하고, `popover` 트릭·우회 없이 토스트 CSS가 `position: fixed` + `--z-toast`로 단순해진다. `--z-toast: 600`은 비모달 레이어(드롭다운·스티키·팝오버) 위 용도로 유지.

**"dialog 없이 잘되던 것 아닌가"에 대한 답**: 구 `div.modal_dialog`에서 토스트가 떴던 것은 그 모달이 배경을 잠그지 않았기 때문(접근성 규칙 미충족). 규칙대로 커스텀 오버레이에 `inert`를 걸어도 토스트 컨테이너만 예외로 둘 수는 있으나(dialog에는 없는 선택권), 배경 잠금·Tab 순환·Esc·포커스 복귀를 매번 JS로 짜야 하는 비용이 더 크다고 판단. **dialog 1순위 유지.**

참고: HTML Living Standard(interactive-elements, showModal 절) · whatwg/html #10811 · #11195 · #9998 · HTMHell "Top layer troubles: popover vs. dialog"(2025-12) · Material Design Snackbars · MDN ARIA live regions
