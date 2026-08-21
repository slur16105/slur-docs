---
title: 버전 히스토리
description: SLUR UX/UI System의 변경 이력과 주요 업데이트 내용을 버전별로 정리합니다.
---

이 문서는
SLUR UX/UI System의
**버전별 변경 이력**을 기록합니다.

---

## v1.7.0 — 2026.08

### 동작 층 신설 + 대시보드 어휘

슬러가 "규칙 + 모양"에서 **동작까지** 갖춘다. 동작의 출처는 **네이티브 → slur.js → 위임** 3단 우선순위로 고정하고, 어떤 JS 라이브러리에도 의존하지 않는다. 대시보드 한 장을 슬러만으로 끝까지 만들 수 있도록 빠진 어휘를 채웠다(shadcn/ui 대비 분석의 결론 — 엔진을 빌리는 대신 빈칸만 채운다).

#### 방법론 확장

- 「동작 층 (slur.js)」 페이지 신설(JavaScript 및 상태 관리) — 동작의 출처를 **네이티브(`<dialog>`·`popover`·`<details>`·네이티브 input) → 동봉 `slur.js` → 위임(복잡 위젯만)** 으로 정의. 브라우저가 해 주면 만들지 않고, 작으면 직접 만들고, 크면 빌린다
- **네이티브 상태 속성 규칙 확장** — `:popover-open`과 표준 ARIA 상태(`aria-sort`·`aria-current`·`aria-selected`)도 정본으로 인정, `data-state` 중복 금지
- **4상태 슬롯 토글을 공통 레이어(global.css)로** — 블록마다 토글 CSS를 쓰지 않고 `[data-state="loading"] > .i_loading` 식으로 global이 한 번에 처리(블록 이름을 모르므로 `data-state`로 스코프 — 내부 요소 단독 선택자 금지의 유일한 예외). 화면 상태 설계·공통 레이어 페이지에 반영
- 팝업/모달 패턴에 「비모달 레이어 — 드롭다운·팝오버·툴팁」 절 추가(`popover="auto"`, `role="menu"`는 앱 동작 메뉴에만), 피드백 원칙에 토스트 컨테이너 선존재 + `slur.toast`, 키보드 내비게이션·외부 라이브러리 연동에 동작 층 연결

#### 공통 레이어 (`global.css`) · 동작 층 (`slur.js`) — `slur-guidelines`

- `global.css`에 4상태 슬롯 토글 3줄 추가(`i_loading`/`i_empty`/`i_error` 노출, 세 상태에서 `i_body` 숨김)
- **`slur.js` 신설**(바닐라, 의존성 0, ~250줄) — `tabs`(방향키·Home/End·roving tabindex·자동 활성화), `menu`(popover 메뉴의 트리거 기준 위치·첫 항목 포커스·방향키·Tab 닫기), `tooltip`(호버+포커스·Esc·툴팁 위 유지), `toast`(선존재 컨테이너에 큐·자동 소멸·닫기, `slur.toast(text, { level })`), `drawer`(열린 동안 형제 `inert`·첫 포커스·Esc·포커스 복귀), `theme`(`data-theme` 전환·저장). 클래스가 아니라 역할·속성(`role`·`popover`·`data-action`)에 `document` 위임 바인딩, 후처리는 `slur:*` 커스텀 이벤트
- SKILL.md에 「동봉 파일 — slur.js」 절과 모듈 표, js.md에 「동작은 어디서 오나」(3단 표 + API), accessibility.md 5장에 구현 순서·F(위임) 문장 갱신·ARIA 정본 확장, component.md 탭 예시를 `i_list`/`i_tab`/`i_panel` 구조로(+slur.js 안내), ux-states.md에 토글 CSS·토스트 API, checklist에 동작 순서·4상태·토스트 항목

#### 디자인시스템 (`slur-design`)

- **새 컴포넌트** — `toast_message`(`toast.css`), `empty_state`·`skeleton`·`spinner`(`state.css`), `menu_action`(`menu.css`, 네이티브 popover), `tooltip_help`(`tooltip.css`, `popover="manual"`), `pagination`(`pagination.css`, `aria-current="page"` 정본)
- **확장** — `card.m_stat`(통계 카드, 증감은 badge 조합), `table_data` 정렬 헤더(`th.m_sort > .i_sort`, `aria-sort` 정본), `nav_side .i_item[aria-current="page"]` 인정
- **모달 CSS를 `<dialog>` 1순위로 재작성** — `dialog.modal_dialog`(`[open]` 정본, `::backdrop`, `@starting-style` 모션), 커스텀 오버레이는 `div.modal_dialog` + `data-state`로 유지(1.6.0 규칙의 CSS 반영). **마크업 변경**: 기존 `div.modal_dialog > .i_wrap` 구조는 그대로 동작하고, `<dialog>`로 옮기면 `.i_wrap` 없이 `i_head`/`i_body`/`i_foot`을 직접 둔다
- **탭 마크업 변경** — `tab_menu`가 `i_list[role=tablist]` > `i_tab[role=tab]` + `i_panel[role=tabpanel]`을 감싸는 구조로(가이드라인 정본과 일치, 패널까지 한 세트). 기존 `tab_menu > .i_tab` 직계 마크업은 `i_list`로 한 번 감싸야 한다
- **토큰** — 차트 범주형 5슬롯 `--color-chart-1~5`(라이트·다크 각각 dataviz 6항목 검증 통과, 순서 고정·상태색 재사용 금지, 라이트 3·4·5는 직접 라벨 필요), `--color-surface-overlay`(모달 backdrop·드로어 딤, 생 rgba 제거)
- **patterns 층 첫 파일** — `patterns/app-shell.css`(`layout_app`: `l_side`/`l_panel`/`l_dim` · `l_head` · `l_main`, 데스크톱 2열·1024 미만 드로어, 내부는 `l_` 자족, 현재 페이지 `aria-current`)
- **`references/recipes.md` 신설** — 대시보드 레시피 14절(앱 셸·페이지 뼈대·통계 카드·4상태·토스트·행 메뉴·툴팁·표 정렬/페이지·차트 색 주입·다크 토글·모달·필터·위임·React에서 slur.js)
- SKILL.md에 「동작은 어디서 오나 — 3단 우선순위」, 블록→파일 색인 확장, 로드 순서에 patterns·slur.js, 점검표 3항목 추가. "하지 말 것"의 Radix 문장을 3순위 위임으로 정정
- 데모 — `demo.html`에 State·Toast·Tooltip·통계 카드·차트 토큰·정렬/메뉴/페이지네이션·`<dialog>` 모달 추가(위젯 동작은 전부 slur.js 위임, 페이지 스크립트는 데이터 흐름만), `demo-dashboard.html` 신설(앱 셸 한 장). Chrome에서 탭 키보드·메뉴·툴팁·토스트·드로어 inert·다크 전환 검증

#### 보류

- CSS anchor positioning(Safari 26 지원)으로 메뉴·툴팁 위치를 CSS로 옮기는 것 — popover 트리거의 암묵적 앵커 지원이 Safari에서 확인되면 재평가. 그때까지 위치는 slur.js
- 콤보박스·범위 달력 위임 예시는 실제 프로젝트에서 요구가 생길 때 추가

---

## v1.6.0 — 2026.08

### 복합 위젯 접근성 기준

#### 방법론 확장

- 복합 위젯(포커스·방향키·알림)의 동작 기준 신설 — 근거는 표준으로만 병기(W3C APG · WCAG 2.2 · KWCAG 2.2), 목표 기준 **WCAG 2.2 AA · KWCAG 2.2** 선언(접근성 설계 철학)
- **모달 1순위 구현을 네이티브 `<dialog>` + `showModal()`로 전환** — 배경 inert·Esc 닫기·포커스 복귀를 브라우저가 제공. 커스텀 `div[role=dialog]`는 대안으로 유지(배경 `inert` + Tab 순환 + 포커스 복귀 직접 구현). 채택 근거·검증 기록은 `docs-internal/2026-08-dialog-adoption.md`
- **네이티브 상태 속성 규칙 신설** — `dialog[open]`·`details[open]`처럼 네이티브가 자기 상태를 속성으로 갖는 요소는 그 속성이 상태의 정본이며 `data-state`를 중복해 붙이지 않는다
- 방향키 위젯(탭·메뉴·라디오 그룹) 규칙 — Tab은 위젯 사이·방향키는 위젯 안(roving tabindex), 탭 활성화 기본값 = 자동, 사이트 내비게이션에 `role="menu"` 금지 명문화
- 라이브 영역 규칙 — 토스트 기본 `role="status"`(자동 소멸 허용), 긴급·비소멸만 `role="alert"`, 컨테이너 선존재, 알림은 포커스를 옮기지 않음. 토스트 마크업의 role 불일치(`alert`/`status` 혼용) 통일
- 떠 있는 레이어 닫기 규칙(Esc · 비모달은 바깥 클릭 · 겹침 시 맨 위 하나 · 포커스 가림 금지), 툴팁 규칙, 복잡 위젯(셀렉트·콤보박스·날짜선택기) 위임 원칙
- 배치: 새 페이지 없이 기존 페이지 확장(키보드 내비게이션 · ARIA 최소 사용 원칙 · 팝업/모달 패턴 · 피드백 원칙)

#### 스킬 (`slur-guidelines`)

- `accessibility.md`에 「복합 위젯: 포커스·방향키·알림」 섹션(판정 + A~F + 보류 목록) — 규칙마다 WCAG·KWCAG 번호 병기
- 모달 예시 `<dialog>` 전환(html.md·js.md) + 커스텀 오버레이 대안 코드, 탭 예시 완전형(패널·tabindex·방향키 핸들러), 토스트 `role="status"` 통일(component.md·ux-states.md), 드로어 포커스 관리 명시
- 체크리스트 접근성 항목 5개 추가(테스트 문장 + WCAG·KWCAG 번호 형식)

### 브라우저 지원 기준 신설

#### 방법론 확장

- 「브라우저 지원 기준」 페이지 신설(핵심 개념) — 검증은 **Chrome(크로미움 계열)·Safari** 두 곳으로 고정, **Firefox는 검증·판단 대상에서 제외**(차단이 아니라, 표준 기반 코드는 검증하지 않는 브라우저에서도 동작한다는 전제)
- 네이티브 웹 기능 채택의 리트머스를 **Safari 지원 여부** 하나로 정의 — Firefox 미지원·지연은 무시(예: `@starting-style` 채택), Safari 미지원 기능은 **제외 또는 향상 전용**(2026-08 기준: `closedby="any"`, `popover="hint"`, `appearance: base-select`)이며 Safari 지원 시 재평가
- 기준의 배경 서사를 문서에 포함 — 웹의 보편성 철학(팀 버너스리), IE6·IE7 시절 크로스 브라우징이 "오차 보정 노동"이었던 이유(조건부 주석·CSS 핵·hasLayout), 에버그린·IE 종료·엔진 수렴 이후 "지원 범위 결정"으로 성격이 바뀐 과정
- **보편성 공감을 SLUR의 공식 입장으로 명시** — 표준·시맨틱·접근성을 문법의 일부로 두는 것이 그 실천임을 문서에 기록하고, 「설계 철학」 방향성에도 항목 추가

#### 스킬 (`slur-guidelines`)

- SKILL.md에 「브라우저 지원 기준」 절 추가 — 문서와 동일한 규칙 요약
- 체크리스트 최종 확인에 Chrome·Safari 검증 및 Safari 리트머스 항목 추가

---

## v1.5.0 — 2026.08

### 층 분리·이름 정리 + 스킬 개명 (`slur-ux` → `slur-guidelines`)

업계에서 굳은 층 이름(Carbon·Primer·Polaris·W3C DTCG)에 `slur-`를 붙여 구조를 정리했다. 규칙 내용은 바뀌지 않는다(하위호환).

#### 구조

- SLUR을 **네 층**으로 정의 — **guidelines**(규칙 + 동봉 `global.css`) / **tokens** / **components** / **patterns**(후순위). 스킬(입구)은 그대로 **2개**: `slur-guidelines`(= 슬러 시스템), `slur-design`(= 슬러 디자인, tokens + components)
- 스킬 `slur-ux` → **`slur-guidelines`** 개명. 호출어 "슬러 시스템"·"슬러 규칙"은 그대로, "슬러 가이드라인" 추가. `~/.claude/skills` 심볼릭 링크도 갱신
- CSS 원본을 **스킬 폴더에 동봉** — `system/global.css` → `skill/slur-guidelines/assets/global.css`, `system/tokens/`·`system/components/` → `skill/slur-design/assets/`. 스킬만 있으면 어느 프로젝트에서도 파일을 찾을 수 있다(절대경로·"복사하라" 의존 제거). `system/`에는 `demo.html`·`README.md`만 남김
- 로드 순서를 `global.css → tokens → components → 프로젝트 CSS`로 통일. 파일명 관례는 `global.css` 유지, `common.css` 같은 "공통 통"은 만들지 않는다(공통처럼 보이면 `layout_*` 또는 컴포넌트)
- `slur-design` 스킬에 **모드**(`full` / `tokens-only`), **프로젝트에 넣는 법**, **하지 말 것**(Tailwind·shadcn 혼용, 새 hex, 인라인 style, 토큰 재정의, 포커스 재선언, `!important`·id 선택자), **블록→파일 색인**, **디자인 층 점검표** 추가

#### 공통 레이어 (`global.css`)

- 포커스 링 범위를 폼 컨트롤에서 **`a`·`summary`·`[tabindex]`까지 확장** — 링크 키보드 포커스가 보이지 않던 문제 해결
- **`prefers-reduced-motion`** 대응 추가
- 토큰을 `var(--x, 폴백)`으로 참조 — 토큰 없는 프로젝트(규칙만 적용)에서도 단독 동작
- `.a11y_hidden`에 `clip` 폴백 추가(스킬 문서와 일치)

#### 디자인시스템 (`skill/slur-design/assets/`)

- 자기 규칙 위반 일소 — 스위치 노브 리터럴 `#fff` → `--color-on-brand`, `.btn.m_danger`의 포커스 링 재선언 제거(global이 담당), 데모의 CSS `id` 선택자·인라인 `style=` 전부 클래스로 이동
- `.btn.m_icon` 정사각 아이콘 버튼 변형 추가(기본 40, `m_small` 32, `m_large` 48)
- 문서의 웹폰트 표기 Pretendard → **Noto Sans KR**(v1.4.1 전환분 반영), README의 존재하지 않는 `fonts` 토큰 항목 삭제

---

## v1.4.1 — 2026.07

### 본문 폰트 전환 (Pretendard → Noto Sans KR)

#### 사이트 (docs)

- 본문 폰트를 **Noto Sans KR**로 전환 — 소형 크기에서 힌팅·획 렌더링이 더 또렷해 장문 가독성이 개선됨
- `--font-sans` 토큰 선두 교체(사이트 전역 반영), Google Fonts 로드(400/500/600/700) + `preconnect` 적용
- `system/demo.html` 폰트 링크도 동일하게 정렬
- 「타이포그래피 선정 기록」 참고 문서 신설 — 동일 조건(텍스트·크기·행간·스무딩·테마) 비교 도구를 임베드해 **폰트 선정 근거**를 문서로 남김

---

## v1.4.0 — 2026.07

### 시맨틱 마크업 · 제목 구조 신설 + CSS 구성 규칙 보강

#### 방법론 확장

- 「시맨틱 마크업」 페이지 신설(core) — 콘텐츠 의미에 맞는 태그 사용, 목록·반복 항목은 `ul`/`li`로 묶기, 버튼(`button`)과 링크(`a`) 구분, 최소 마크업 원칙 정리
- 「제목 구조」 페이지 신설(a11y) — 페이지당 `h1` 하나 + 논리적 제목 구조, `title`과 `h1`의 역할 구분, 로고를 `h1`으로 쓰지 않기, 보이는 제목이 없어도 `a11y_hidden`으로 남기기, 레벨 건너뛰기 금지
- CSS **파일 구성 순서** 규칙 명문화 — `global → 레이아웃 → 컴포넌트 → 페이지 → 반응형`(큰 구조 → 작은 구조, 페이지가 마지막이라 오버라이드 안전)
- **레이아웃 블록은 컴포넌트를 두지 않고 `l_`로 자족** — 수정 영향을 레이아웃 안으로 국소화, 컴포넌트 조합은 페이지가 담당
- **내부 요소 선택자는 가장 가까운 블록 밑으로 스코프** 규칙을 `page_`·`layout_`까지 확장(단독 금지·중간 요소 스킵)
- **종속(내부 요소)이 기본인 이유** 를 수정·관리 비용 관점으로 명시

#### 디자인시스템 (system/)

- `.a11y_hidden` 유틸리티 신설 — 시각적으로 숨기되 보조 기술에는 노출(숨긴 제목·오프스크린 라벨용). `display:none`/`visibility:hidden` 금지 명시

---

## v1.3.0 — 2026.07

### 기능 절제 원칙 신설

#### 방법론 확장

- 「기능 절제 원칙」 페이지 신설 — 기능은 **기본적으로 붙이지 않고** 근거가 있을 때만 추가한다는 판단 기준 정립
- 플랫폼이 이미 제공하는 기능(예: 수동 새로고침 버튼)은 특수한 근거가 없으면 두지 않는다 — 중복 컨트롤 제거
- 비용 근거 명시 — 기능 대부분은 거의 쓰이지 않고(Standish 64%·Pendo 80%), 유지보수는 수명주기 비용의 60~80%
- 「설계 철학」 방향성에 "기능도 절제한다" 링크 연결

---

## v1.2.0 — 2026.07

### 반응형 규칙 명문화 + 아이콘 버튼 정리

#### 방법론 확장

- 「반응형 규칙」 페이지 신설 — **Mobile-first 우선 고려**(모바일 트래픽 60~64%, 리소스·비용 근거)와 **분기점 최소화(기본 하나)**(콘텐츠 기준 + 유지보수·비용 근거) 원칙 정립
- 스킬(`slur-ux`) 반응형 섹션에 동일 원칙 반영 — 기본 예시를 Mobile-first로 전환
- **재사용 단위 기준 블록 경계** 규칙 신설 — 개별 요소가 항상 집합으로만 쓰이면 집합을 블록으로, 개별을 내부 요소(`i_`)로 둔다(예: `ref_grid` > `i_card`)

#### 디자인시스템 (system/)

- 햄버거(메뉴) 버튼 `.btn_menu` 신설 — 터치 타깃 48×48 고정(모바일 최소 권장 Material 48·Apple 44 충족), 범용 `.btn.m_icon` 대체
- 데모 다크 모드 토글을 아이콘 버튼(달/해)로 변경

---

## v1.1.0 — 2026.07

### CSS 방법론 확장 + 디자인시스템 도입

방법론과 실물 디자인시스템이 함께 갖춰진 버전입니다.

#### 방법론 확장

- 공통 레이어(`global.css`) 규칙 신설 — 리셋, 폼 컨트롤 상속, 포커스 링의 단일 선언
- 단위 기준 정립 — rem(정보 전달 값) / px(시각·구조 값) / em(텍스트 동반 아이콘) 판정 기준
- 토큰 운영 기준 — 실사용 기준 토큰화, 눈금 토큰 값 불변, 계층별 "사용" 정의, z-index 예외
- `@import`는 저작 구조 — 브라우저 도달 금지(번들 경유 또는 개별 link)

#### 디자인시스템 (system/)

- 토큰 8종(colors·typography·spacing·radius·shadows·motion·breakpoints·z-index) + `global.css`
- 컴포넌트 10종: Button, Input, Select, Selection, Badge, Card, Alert, Modal, Navigation, Table
- 상태색 면 위 텍스트 on-토큰(`--color-on-danger` 등) — 다크 모드 대비 결함 수정
- 전 컴포넌트 데모(`system/demo.html`, 라이트/다크)

#### 스킬 체계

- `slur-ux`(문법) / `slur-design`(어휘) 분리, 적용 범위 명문화 — 문법은 룩을 바꾸지 않는다

#### 문서

- 「공통 레이어 (global.css)」 페이지 신설, 「토큰 및 변수 전략」 대폭 확장
- 중복 문서 병합 — 「구조 계층」→「UI 구조 모델」, 「지양하는 패턴」→「권장 / 비권장 사례」
- 문서 사이트에 SLUR 토큰 테마 적용

---

## v1.0.0

### 초기 공개 버전

SLUR UX/UI System의 첫 번째 공식 버전입니다.

#### 정립된 내용

- UI 구조 단위 구분
  - 레이아웃(layout_)
  - 페이지(page_)
  - 컴포넌트(접두사 없음)
- 내부 요소(i_) / 수정자(m_) 규칙 정립
- 구조 중첩 금지 원칙 명문화
- 클래스는 구조, 상태는 data-*로 분리하는 기준 정립
- Reference 문서 구조 확립
  - 클래스 네이밍 예제
  - 권장 / 비권장 사례
  - 체크리스트
  - FAQ

