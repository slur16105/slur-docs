---
title: 버전 히스토리
description: SLUR UX/UI System의 변경 이력과 주요 업데이트 내용을 버전별로 정리합니다.
---

이 문서는
SLUR UX/UI System의
**버전별 변경 이력**을 기록합니다.

---

## v1.11.3 — 2026.08

### 설치본 버전 표기 · iOS 글자 자동 확대 방지

- **`VERSION` 파일** — 스킬을 복사해 간 프로젝트가 "이게 몇 버전이지?"를 알 길이 없었다(탭 ④ P2-24). `scripts/sync-assets.mjs`가 빌드 때 `package.json`의 버전(= 이 changelog의 정본 버전)을 `slur-guidelines/VERSION`·`slur-design/VERSION`과 `/skill/VERSION`에 써 넣고, `slur-skills.tar.gz`에도 두 파일이 들어간다. `install.sh`는 설치 뒤 버전을 출력한다. 저장소 원본(`skill/`)에는 없는 파일 — 버전을 올려도 원본 23개 CSS는 바뀌지 않는다. [AI 퀵스타트](/design/ai-quickstart/)·[개요](/design/overview/)·SKILL.md×2·README에 한 줄
- **`global.css`에 `html { text-size-adjust: 100% }`** — iOS Safari가 가로 회전 때 글자만 멋대로 키우는 것(text autosizing)을 막는다(P2-25 중 룩 무관·하위호환인 한 줄만; `keep-all`·`img max-width`는 줄바꿈·레이아웃을 바꾸므로 보류). 사용자의 핀치 확대·글자 크기 설정은 그대로 존중된다. [공통 레이어](/css/global-layer/) 목록 갱신, `slur.js` 1.11.3

## v1.11.2 — 2026.08

### 로딩 기본형 정리 · 새 부품 WebKit 재검증 · 데모 P2 마무리

- **로딩 기본 = 스피너 + 읽힐 문장** — 문법 예시(`ux-states.md`)는 처음부터 `spinner` + 「불러오는 중…」이었는데, 같은 문서의 규칙 문장과 레시피·사이트는 "스켈레톤이 기본"이라고 적혀 서로 달랐다. 기본을 예시 쪽으로 통일한다: 문장이 마크업에 내장돼 `a11y_hidden`을 빠뜨릴 일이 없고, 지어낼 게 없다. `skeleton`은 표·카드 목록처럼 모양이 정해진 넓은 영역의 **선택지**로 내린다(클래스·변형은 그대로 — 조립본 `list`·`detail`이 그 예). `ux-states.md`·[화면 상태 설계](/ux/screen-states/)·레시피 4절·[컴포넌트](/design/components/)·`state.css` 머리말·데모 State 절(스피너 기본, 스켈레톤은 별도 「선택지」 절) 갱신
- **메뉴·툴팁 CSS 결함** — `menu.css`의 `.menu_action { display: flex }`가 브라우저의 닫힘 숨김(`[popover]:not(:popover-open) { display: none }`)을 덮어써, 닫힌 메뉴가 투명한 채 남아 그 자리의 클릭을 가로챘다(Safari는 클릭이 버튼에 포커스를 주지 않아 Esc 뒤 포커스가 숨은 항목에 남기도 했다). `display`를 `:popover-open`에만 두고(`tooltip.css`도 같게) — 이제 `display … allow-discrete` 전환이 실제로 동작한다. `slur.js` menu는 Esc 뒤 트리거로 포커스를 보강한다(닫기 자체는 네이티브 그대로 — Safari에서 마우스로 연 경우 복귀할 곳이 없어 body로 가던 것, APG Menu Button). 레시피 6절·`js.md`·[동작 층](/js/behaviors/)에 한 줄
- **표 래퍼 가로 넘침** — 표 머리의 `a11y_hidden`(absolute)이 `table_wrap` 안에 positioned 조상이 없어 모바일 폭에서 문서가 가로로 밀렸다(데모 480·대시보드 456·목록 729px). `.table_wrap { position: relative }`
- **WebKit 재검증** — 메뉴·툴팁·페이지네이션·앱 셸 드로어·탭 방향키·모달·토스트·테마·reduced-motion 61항목을 Playwright WebKit 26.5와 Chromium 151에서 같은 대본으로 실행해 위 두 결함을 찾았고, 수정 후 둘 다 61/61 통과. WebKit 26.5는 anchor positioning·`popover="hint"`를 지원하지만 이전 Safari가 남아 있는 동안 정책(`slur.js` 위치 계산·`popover="manual"`)은 유지 — [브라우저 지원 기준](/core/browser-support/) 문구 보정
- 데모 P2 마무리 — `modal.css` 커스텀 오버레이 `.i_wrap`의 무의미한 `z-index` 제거, 데모 PC-first 미디어쿼리 이유 주석, `demoIndet`(indeterminate는 JS로만) 주석. `slur.js` 1.11.2

## v1.11.1 — 2026.08

### 스킬 설치 — tar.gz 한 덩어리로

v1.11.0의 `install.sh`는 `manifest.txt` 목록대로 파일을 하나씩 받았다. 배포 후 실도메인에서 받아 보니 **조립본 HTML 여덟 장이 원본과 달랐다** — Cloudflare의 이메일 난독화(Email Address Obfuscation)가 HTML 응답 속 주소(`demo@slur.co.kr` 등)를 `[email protected]` + 디코드 스크립트로 바꿔 내보내기 때문(CSS·JS·MD는 그대로). 브라우저에서는 스크립트가 복원하므로 사이트의 프레임은 문제없지만, 복사해서 시작하는 조립본 파일이 훼손된다.

- `scripts/sync-assets.mjs`가 두 스킬 폴더를 **`public/skill/slur-skills.tar.gz`**로 묶는다(의존성 없는 ustar 작성기 + `zlib` gzip). 바이너리 응답은 손대지 않으므로 원본 그대로 온다
- **`install.sh`는 그 tar.gz 하나를 받아 푼다**(`curl | tar -xzf - -C $DEST`) — 요청 1번, 52파일 원본과 동일함을 로컬·실도메인에서 확인. `manifest.txt`는 파일 목록(참고용)으로 유지
- 개요·AI 퀵스타트·README·`system/README.md` 문구 갱신, `slur.js` 1.11.1

## v1.11.0 — 2026.08

### 사이트 「디자인시스템」 섹션 · AI 퀵스타트 · 스킬 배포 경로

지금까지 스킬 폴더(`skill/`)에만 있던 디자인시스템 — 토큰·컴포넌트 15개·패턴·화면 조립본 여덟 장 — 을 **문서 사이트에서 볼 수 있게** 했다. 사이트는 여전히 문법이 본문이고, 디자인시스템은 그 위의 한 섹션이다(별도 사이트를 만들지 않음 — 양이 작고 읽는 사람이 같다). 저장소가 비공개라 **사이트가 두 스킬의 공개 배포 경로**가 됐다.

#### 사이트

- **사이드바 「디자인시스템」 그룹 신설** — [개요](/design/overview/)(네 층·호칭·로드 순서·핵심 규칙·가져오기) / [디자인 토큰](/design/tokens/)(두 층, 실제 이름·값 전부, 단위 기준, 운영 원칙) / [컴포넌트](/design/components/)(색인 표 — 블록·변형·상태의 정본, 라이브 데모, 4상태·토스트·모달 마크업) / [패턴 · 화면 조립본](/design/screens/)(앱 셸·인증 셸, 여덟 장 프레임, 공통 규칙, 복사해서 시작) / [AI 퀵스타트](/design/ai-quickstart/)(설치, 호칭 세 가지와 예시 프롬프트, 결과 점검, 스택별 메모)
- **조립본·데모를 사이트 안에서 바로 본다** — `ScreenFrame.astro`(블록 `preview_frame`: iframe, 「모바일 폭 375」 토글 `data-state="desktop|mobile"`, 새 탭 열기, 사이트 다크 모드를 같은 출처 프레임 문서의 `data-theme`로 전파)
- **토큰 문서의 색·그림자 칸은 사이트에 배선된 실제 토큰을 그린다** — `TokenSwatch.astro`(`token_swatch`, `--swatch` 변수 하나). 토큰 값이 바뀌어도 문서가 따라오고, 테마를 바꾸면 칸도 바뀐다
- **`scripts/sync-assets.mjs`** — dev·build 시작 때(`astro.config.mjs`의 통합 훅 `astro:config:setup` — 빌드 명령이 무엇이든 같이 돈다) `skill/` 전체와 `system/demo.html`을 `public/`으로 복사해 같은 경로로 서빙(`/skill/...`, `/system/demo.html`). 조립본이 `../../../../slur-guidelines/...` 상대경로로 두 스킬을 넘나드므로 트리를 그대로 옮긴다. 복사본은 gitignore — 원본은 한 곳
- **스킬 설치 스크립트** `https://docs.slur.co.kr/skill/install.sh` — `manifest.txt`(빌드 시 생성)의 파일 목록을 같은 경로로 내려받아 `.claude/skills/`에 두 스킬을 둔다(`SLUR_SKILLS_DIR`로 위치 변경). 하는 일은 curl뿐
- 첫 화면에 「디자인시스템 · 화면 조립본」 버튼과 카드, 「문서 읽는 방법」에 섹션 안내, README에 항목 추가
- 표 셀에 `word-break: keep-all` — 한국어는 글자 사이 어디서나 줄이 바뀌어 좁은 열이 한 글자씩 세로로 쌓이던 것(색인 표의 「컴포넌트」 열). Starlight 표는 `overflow: auto`라 넓어지면 가로 스크롤
- `slur-theme.css`에 motion 토큰 import — `custom.css`가 `--duration-fast`·`--ease-standard`를 참조하고 있었으나 정의가 없어 전환이 무시되던 것

#### 스킬

- `slur-design/SKILL.md`·`slur-guidelines/SKILL.md`에 사이트·설치 경로 한 줄, `system/README.md`에 「사이트에서 보기」, `slur.js` 버전 1.11.0. 규칙 변경 없음

#### 검증

- `npm run build` Complete(`dist/skill/`·`dist/system/` 포함). Chrome에서 다섯 페이지 렌더, 프레임 로드·모바일 폭 토글·다크 전파, 토큰 칸 테마 전환 확인

## v1.10.0 — 2026.08

### 화면 조립본 — 회원가입 · 비밀번호 재설정 · 상세/편집 · 온보딩

v1.9.0의 네 장에 이어 **조립본 네 장**을 추가해 여덟 장이 됐다. 인증 흐름(가입·재설정)과 앱 안의 두 축(한 건의 상세/편집, 빈 워크스페이스의 첫 화면)을 채워, 바이브 코딩으로 앱을 시작할 때 빠지는 화면이 거의 없게 했다. 전부 슬러 디자인 + `slur.js`만으로 동작하며(Tailwind·shadcn·헤드리스 라이브러리 없음), 화면끼리 실제 흐름대로 연결돼 있다(로그인 ↔ 가입·재설정, 목록 행 메뉴 → 상세).

#### 디자인시스템 (`slur-design`)

- **`patterns/screens/` 네 장 추가** — 그대로 열리는 HTML(마크업 + 페이지 CSS + JS, 상대경로), 목차 `index.html`에 카드 추가
  - **회원가입 `signup.html`** (`layout_auth`) — 이름·이메일·비밀번호·확인, 비밀번호 **강도 막대**(장식 — 읽히는 문장은 `i_help`) + **규칙 체크리스트**(`li[data-state=pass]` + 숨은 "충족/미충족"), 약관 `fieldset.field`(전체 동의 ↔ 개별, `indeterminate`, 필수 미동의는 `i_help` 오류), 중복 이메일은 폼 상단 `alert`, 성공 → `page_signup[data-state="sent"]` 인증 메일 안내(`empty_state`, 제목으로 포커스, 재전송 60초 잠금)
  - **비밀번호 재설정 `reset.html`** (`layout_auth`) — **네 단계를 한 파일에**(`page_reset[data-state="request|sent|new|done"]`), 단계가 바뀌면 새 단계의 `h1`(tabindex=-1)로 포커스. 요청(계정 유무를 노출하지 않음) → 메일 확인(재전송 잠금) → 새 비밀번호(규칙 체크리스트, 이전 비밀번호 재사용은 상단 `alert`) → 완료(다른 기기 로그아웃 안내)
  - **고객 상세/편집 `detail.html`** (`layout_app`) — 정체 헤더(아바타·이름·상태/플랜 badge·메타 + 편집·`mailto:`·더보기 `menu_action`), `tab_menu` 기본형 탭(개요/청구서/활동), **보기↔편집 전환** `page_detail[data-state="view|edit"]`(같은 카드에서 `p_dl` ↔ `p_fields` 교대, 편집 중엔 헤더 동작 숨김·저장 바만 출구), 변경 추적 + **변경 버리기 확인 `<dialog>`**(초기 포커스 "계속 편집"), 저장 → dl·헤더·브레드크럼 갱신 → 토스트, 청구서 탭 4상태 `loading→success`, 활동 타임라인, 휴면 처리(되돌릴 수 있어 확인 없음) vs 삭제(확인)
  - **온보딩 `onboarding.html`** (`layout_app`) — 빈 워크스페이스 첫 화면. **히어로 = `empty_state`**(페이지 스코프에서 크기만), **진행 체크리스트**(네이티브 `<progress>` 룩만 입힘 + `aria-label`, `li[data-state=done]`, 전부 끝나면 `p_checklist[data-state=done]`), 첫 고객·팀원 초대 `<dialog>` 폼 → 단계 완료·사이드바 카운트·히어로 내려감(`data-state="started"`), **4상태 활동 블록** `empty → success`, 둘러보기 `card.m_list` 링크 행
- `login.html`의 "비밀번호를 잊으셨나요?"·"회원가입" 링크와 `list.html` 행 메뉴의 "상세 보기"(`a.i_item[role=menuitem]`)를 새 화면으로 연결
- `references/recipes.md` 15절 표에 네 장 추가 + 공통 규칙 세 개 보강: **화면(단계·모드)이 바뀌면 포커스를 옮긴다**(제목 또는 첫 입력, 나갈 때는 들어온 버튼), **확인 대화상자는 되돌릴 수 없는 것에만**, **색만으로 상태를 전하지 않는다**(장식은 `aria-hidden` + 읽히는 문장, 진행률은 `<progress>` + `aria-label`)
- SKILL.md 트리·색인·「프로젝트에 넣는 법」, `system/README.md`, `slur.js` 버전 1.10.0

#### 공통 레이어 (`global.css`) · 컴포넌트 — 조립본을 만들며 드러난 빈칸

- **`fieldset` 리셋** — `min-width: 0; border: 0;`(UA의 groove 테두리와 `min-width: min-content`가 그리드 안에서 넘치던 것). 묶음의 테두리가 필요하면 페이지가 그린다(`signup.html`의 약관 상자처럼)
- **`.btn`을 `<a>`에도 안전하게** — `text-decoration: none; color: inherit;` 추가(`a.btn`이 밑줄·링크색으로 보이던 것. `mailto:`·"전체 보기"·"로그인으로" 같은 링크 버튼)

#### 검증

- Chrome(1280·375)에서 네 장 모두 콘솔 오류 0. 가입 검증·강도·약관·인증 메일 전환, 재설정 4단계 전환·포커스, 상세 보기↔편집·버리기 확인·저장 반영·탭 4상태, 온보딩 첫 고객→체크리스트·활동 전환 동작 확인. Safari는 Slur 수동 확인 대상

## v1.9.0 — 2026.08

### 화면 조립본 — 로그인 · 목록 · 설정

대시보드 한 장(v1.8.0)에 이어, 바이브 코딩으로 앱을 만들 때 바로 복사해 시작할 수 있는 **화면 조립본** 세 장을 추가했다. 전부 슬러 디자인 + `slur.js`만으로 동작하며(Tailwind·shadcn·헤드리스 라이브러리 없음), 위젯 동작은 `slur.js`에 위임돼 페이지 스크립트는 그 화면의 데이터 흐름만 담는다.

#### 디자인시스템 (`slur-design`)

- **`patterns/screens/` 신설** — `dashboard.html`(기존 `system/demo-dashboard.html`을 이동), `login.html`, `list.html`, `settings.html`. 그대로 열리는 HTML(마크업 + 페이지 CSS + JS, 상대경로)
  - **로그인** — `layout_auth` 틀, 이메일·비밀번호(보기 토글), 인라인 오류(`field[data-state=error]` + `i_help` + `aria-invalid`, 포커스는 첫 오류 필드), 폼 상단 실패 `alert.m_inline`(`role=alert`), 로딩 버튼(스피너), 소셜 로그인·가입 링크
  - **목록(고객)** — 제목+카운트, 상태 탭이 4상태(로딩→정상/빈)를 전환, 검색·셀렉트, **선택 바**(`page_list[data-state="selected"]`, 전체 선택 `indeterminate`), 정렬(`aria-sort`), 행 메뉴 → 삭제 확인 `<dialog>`(초기 포커스 취소) → 모달 닫힌 뒤 토스트, 좁은 화면 가로 스크롤
  - **설정** — 구역 내비(`aria-current` + `scroll-margin-top`), 카드 섹션(프로필·알림·보안·위험 구역), 라벨/컨트롤 2열 행, `role="switch"` + `aria-checked`, **변경 추적 저장 바**(취소 = 초기값 복원), 비밀번호 규칙 오류, 위험 구역은 이름 입력 게이트로 삭제 확인
- **`patterns/auth-shell.css` 신설** — `layout_auth`(`l_brand` · `l_main` > `l_card` · `l_foot`): 로그인·가입·재설정 같은 단일 과업 화면의 틀
- **컴포넌트 소폭 확장** — `input_wrap .i_action`(컨트롤 안 오른쪽 액션 버튼: 비밀번호 보기·지우기) + `input_text.m_icon_right`; `table_wrap .i_body/.i_scroll`에 `overflow-x: auto`(좁은 화면 가로 스크롤); `switch`는 `role="switch"` + **`aria-checked="true"`를 정본**으로 인정(표준 ARIA 상태 규칙, 기존 `data-state="on"`도 유지)
- `references/recipes.md`에 「15. 화면 조립본」 — 네 장의 내용 표 + 새 화면도 같게 지키는 공통 규칙(페이지 블록 조합·상태 정본·파괴적 확인·인라인 오류·컨트롤 이름) + React 이관 메모
- **`assets/brand/` 신설** — 사이트의 SLUR 로고(`logo.svg` 라이트 · `logo-white.svg` 다크)와 `favicon.svg`를 디자인시스템 자산으로 동봉. 화면 조립본·데모의 사이드바·인증 셸에 로고(`l_logo`, 테마별 img 전환)와 파비콘 적용. `screens/index.html` 목차 페이지 추가(서버 없이 파일로 열림)
- `layout_auth`는 로고·카드·하단 링크를 한 묶음으로 세로 가운데 정렬(auto 마진 — 내용이 길어지면 위에서부터 흐름)
- SKILL.md 트리·색인·「프로젝트에 넣는 법」에 `auth-shell`·`screens/` 반영("화면을 새로 짤 때는 조립본을 복사해 시작"), `system/README.md` 갱신, `slur.js` 버전 1.9.0

#### 검증

- Chrome(1280·375)에서 네 장 모두 콘솔 오류 0. 로그인 유효성·실패·성공 흐름, 목록 선택 바·4상태 전환·행 메뉴→삭제 확인→토스트, 설정 변경 추적·취소 복원·저장·삭제 게이트 동작 확인. Safari는 Slur 수동 확인 대상

## v1.8.0 — 2026.08

### 동작 층 신설 + 대시보드 어휘

> v1.7.0(어휘 보충)과 같은 날 별도 작업선에서 만든 것을 합쳤다. 겹친 결정은 접근성 근거가 있는 v1.7.0 것(`i_status` 상자·`success` 값·모달 중 토스트 금지)을 따르고, 룩·토큰명·`<dialog>` 안 `i_wrap` 생략은 이쪽을 따랐다.

슬러가 "규칙 + 모양"에서 **동작까지** 갖춘다. 동작의 출처는 **네이티브 → slur.js → 위임** 3단 우선순위로 고정하고, 어떤 JS 라이브러리에도 의존하지 않는다. 대시보드 한 장을 슬러만으로 끝까지 만들 수 있도록 빠진 어휘를 채웠다(shadcn/ui 대비 분석의 결론 — 엔진을 빌리는 대신 빈칸만 채운다).

#### 방법론 확장

- 「동작 층 (slur.js)」 페이지 신설(JavaScript 및 상태 관리) — 동작의 출처를 **네이티브(`<dialog>`·`popover`·`<details>`·네이티브 input) → 동봉 `slur.js` → 위임(복잡 위젯만)** 으로 정의. 브라우저가 해 주면 만들지 않고, 작으면 직접 만들고, 크면 빌린다
- **네이티브 상태 속성 규칙 확장** — `:popover-open`과 표준 ARIA 상태(`aria-sort`·`aria-current`·`aria-selected`)도 정본으로 인정, `data-state` 중복 금지
- **4상태 스위치(global.css)와 슬롯 룩의 결합** — v1.7.0의 `i_status`(`role="status"`) 상자·`success` 값 위에 슬롯 룩(`empty_state`·`skeleton`·`spinner`)을 얹는다. `i_loading`에는 읽힐 문장을 하나 둔다(스켈레톤만이면 보조 기술에 읽히지 않음). 화면 상태 설계·공통 레이어 페이지에 반영
- 팝업/모달 패턴에 「비모달 레이어 — 드롭다운·팝오버·툴팁」 절 추가(`popover="auto"`, `role="menu"`는 앱 동작 메뉴에만), 피드백 원칙에 토스트 컨테이너 선존재 + `slur.toast`, 키보드 내비게이션·외부 라이브러리 연동에 동작 층 연결

#### 공통 레이어 (`global.css`) · 동작 층 (`slur.js`) — `slur-guidelines`

- **`slur.js` 신설**(바닐라, 의존성 0, ~250줄) — `tabs`(방향키·Home/End·roving tabindex·자동 활성화), `menu`(popover 메뉴의 트리거 기준 위치·첫 항목 포커스·방향키·Tab 닫기), `tooltip`(호버+포커스·Esc·툴팁 위 유지), `toast`(선존재 컨테이너에 큐·자동 소멸·닫기, `slur.toast(text, { level })` — 모달이 열려 있으면 큐에 두었다가 닫힌 뒤 표시), `drawer`(열린 동안 형제 `inert`·첫 포커스·Esc·포커스 복귀), `theme`(`data-theme` 전환·저장). 클래스가 아니라 역할·속성(`role`·`popover`·`data-action`)에 `document` 위임 바인딩, 후처리는 `slur:*` 커스텀 이벤트
- SKILL.md에 「동봉 파일 — slur.js」 절과 모듈 표, js.md에 「동작은 어디서 오나」(3단 표 + API), accessibility.md 5장에 구현 순서·F(위임) 문장 갱신·ARIA 정본 확장, component.md 탭 예시를 `i_list`/`i_tab`/`i_panel` 구조로(+slur.js 안내), ux-states.md에 토글 CSS·토스트 API, checklist에 동작 순서·4상태·토스트 항목

#### 디자인시스템 (`slur-design`)

- **새 컴포넌트** — `toast_message`(`toast.css`: 어두운 필, 하단 중앙, `m_top`, `status`/`alert` 컨테이너 분리, 숨김은 opacity·visibility로 라이브 영역 선존재 유지), `empty_state`·`skeleton`·`spinner`(`state.css`, 4상태 슬롯 기본형 포함), `menu_action`(`menu.css`, 네이티브 popover), `tooltip_help`(`tooltip.css`, `popover="manual"`), `pagination`(`pagination.css`, `aria-current="page"` 정본)
- **확장** — `card.m_stat`(통계 카드, 증감은 badge 조합), `table_data` 정렬 헤더(`th.m_sort > .i_sort`, `aria-sort` 정본), `nav_side .i_item[aria-current="page"]` 인정
- **모달 CSS를 `<dialog>` 1순위로 재작성** — `dialog.modal_dialog`(`[open]` 정본, `::backdrop`, `@starting-style` 모션), 커스텀 오버레이는 `div.modal_dialog` + `data-state`로 유지(1.6.0 규칙의 CSS 반영). **마크업 변경**: 기존 `div.modal_dialog > .i_wrap` 구조는 그대로 동작하고, `<dialog>`로 옮기면 `.i_wrap` 없이 `i_head`/`i_body`/`i_foot`을 직접 둔다
- **탭 마크업 변경** — `tab_menu`가 `i_list[role=tablist]` > `i_tab[role=tab]` + `i_panel[role=tabpanel]`을 감싸는 구조로(가이드라인 정본과 일치, 패널까지 한 세트). 기존 `tab_menu > .i_tab` 직계 마크업은 `i_list`로 한 번 감싸야 한다
- **토큰** — 차트 범주형 5슬롯 `--color-chart-1~5`(라이트·다크 각각 dataviz 6항목 검증 통과, 순서 고정·상태색 재사용 금지, 라이트 3·4·5는 직접 라벨 필요), `--color-surface-overlay`(모달 backdrop·드로어 딤, 라이트·다크 — v1.7.0의 `--color-overlay`를 이 이름으로 통일)
- **patterns 층 첫 파일** — `patterns/app-shell.css`(`layout_app`: `l_side`/`l_panel`/`l_dim` · `l_head` · `l_main`, 데스크톱 2열·1024 미만 드로어, 내부는 `l_` 자족, 현재 페이지 `aria-current`)
- **`references/recipes.md` 신설** — 대시보드 레시피 14절(앱 셸·페이지 뼈대·통계 카드·4상태·토스트·행 메뉴·툴팁·표 정렬/페이지·차트 색 주입·다크 토글·모달·필터·위임·React에서 slur.js)
- SKILL.md에 「동작은 어디서 오나 — 3단 우선순위」, 블록→파일 색인 확장, 로드 순서에 patterns·slur.js, 점검표 3항목 추가. "하지 말 것"의 Radix 문장을 3순위 위임으로 정정
- 토스트 **위치는 한 곳**(하단 중앙) — status/alert 같은 자리, 강도는 `role`과 자동 소멸로만 구분. `m_top`은 하단이 탭바·푸터·FAB로 막힐 때 두 컨테이너를 함께 옮기는 레이아웃 변형으로 한정(데모·레시피에서 alert의 `m_top` 제거)
- `global.css`에 `dialog { margin: auto }` — 전체 리셋(`* { margin: 0 }`)이 지운 UA 기본값 복원(`showModal()` 가운데 정렬)
- 데모 — `demo.html`에 State(`i_status` 상자·`success`)·Toast·Tooltip·통계 카드·차트 토큰·정렬/메뉴/페이지네이션·`<dialog>` 모달 추가(위젯 동작은 전부 slur.js 위임, 페이지 스크립트는 데이터 흐름만), `demo-dashboard.html` 신설(앱 셸 한 장). Chrome에서 탭 키보드·메뉴·툴팁·토스트·드로어 inert·다크 전환 검증

#### 보류

- CSS anchor positioning(Safari 26 지원)으로 메뉴·툴팁 위치를 CSS로 옮기는 것 — popover 트리거의 암묵적 앵커 지원이 Safari에서 확인되면 재평가. 그때까지 위치는 slur.js
- 콤보박스·범위 달력 위임 예시는 실제 프로젝트에서 요구가 생길 때 추가

---

## v1.7.0 — 2026.08

### 문법이 요구하는 어휘 보충 (검토 피드백 P0-4)

#### 방법론 확장

- **4상태 값 확정** — `data-state="loading | empty | error | success"`. 정상 상태의 이름이 없던 빈칸을 `success`로 채움(버튼·입력의 기존 `success`와 같은 어휘, 데이터 로딩 상태의 통용 이름)
- **4상태 안내문은 항상 렌더되는 `i_status`(`role="status"`) 상자 안에** — 상자가 미리 있어야 상태 전환이 보조 기술에 읽힌다(라이브 영역 선존재 원칙). 지금 상태가 아닌 안내문은 `display:none`으로 접근성 트리에서도 숨긴다
- **모달이 열려 있는 동안 토스트 금지** — 모달 안 상태 변화는 모달 안에서(버튼 글자 변화·`alert.m_inline`·인라인 오류). 근거: 정의상 모순 + 네이티브 `<dialog>` 바깥 inert로 최상위 레이어의 토스트도 닫기·키보드·보조 기술 불가(결정 기록 `docs-internal/2026-08-dialog-adoption.md`)

#### 스킬 (`slur-guidelines`)

- `global.css`에 **4상태 스위치** 동봉 — `[data-state] > .i_status > .i_*` 노출 전환(룩 없음). `i_`를 블록 대신 `[data-state]`로 스코프하는 유일한 예외로 명시
- `ux-states.md`·`accessibility.md`(D)에 모달 중 토스트 금지 규칙, `css.md` 스코프 규칙에 4상태 예외 명문화, `SKILL.md` 동봉 목록 갱신

#### 스킬 (`slur-design`)

- **`components/state.css` 신설** — 4상태 안내문 모양(여백·색) + `i_loading` 자동 스피너 + `.btn[data-state="loading"]` 스피너(기존 opacity만 → 스피너). 스켈레톤은 대시보드 어휘 때
- **`components/toast.css` 신설** — `toast_message` 단일 토스트(모바일 하단 전체폭 → 640px 이상 우하단), `m_success/m_warning/m_danger`(alert와 같은 이름), 숨김은 `display:none`이 아니라 opacity·visibility(라이브 영역 컨테이너 선존재), `role="status"`/`"alert"` 컨테이너 분리
- **`components/modal.css` → 네이티브 `<dialog>` 이관** — `[open]` 정본·`::backdrop`·`@starting-style` 모션. 문법(v1.6.0 1순위)과 어휘의 드리프트 해소. 토큰 `--color-overlay` 신설(라이트/다크)
- `demo.html` — State·Toast 섹션 추가, 모달을 `<dialog>` + `showModal()`로, JS를 `data-action` 위임 패턴으로 정리
- `card.css`의 `.card.m_link:focus-visible` 재선언 제거 — global의 `a:focus-visible`과 중복(자기 규칙 정리)
- 사이트: 화면 상태 설계·ARIA 최소 사용·global 레이어·피드백·팝업/모달 페이지를 같은 문장으로 갱신

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

