---
title: AI 퀵스타트
description: Claude Code 같은 AI 코딩 도구에 SLUR UI Guidelines와 Design System을 설치하고, 두 대표 호출어로 적용 범위를 분명하게 지정하는 가장 짧은 길입니다.
---

슬러의 규칙은 사람이 읽는 문서이자 **AI가 읽는 스킬**입니다.
같은 내용이 두 스킬 폴더(`slur-guidelines` UI 구현 규칙, `slur-design` 디자인시스템)에 AI용으로 압축돼 있어,
설치하면 AI 도구가 화면을 만들 때 규칙·토큰·조립본을 스스로 참고합니다.

---

## 1. 설치

```bash
curl -fsSL https://docs.slur.co.kr/skill/install.sh | sh
```

현재 프로젝트의 `.claude/skills/slur-guidelines`, `.claude/skills/slur-design`에 들어갑니다
(Claude Code 프로젝트 스킬 — 저장소에 함께 커밋하면 팀 전체가 같은 규칙을 씁니다).

- 모든 프로젝트에서 쓰려면 전역에 설치합니다.
  ```bash
  curl -fsSL https://docs.slur.co.kr/skill/install.sh | SLUR_SKILLS_DIR=~/.claude/skills sh
  ```
- 스크립트는 두 스킬 폴더를 묶은 [`slur-skills.tar.gz`](/skill/slur-skills.tar.gz) 하나를 받아 풀기만 합니다 — [내용 보기](/skill/install.sh), 파일 목록은 [`manifest.txt`](/skill/manifest.txt). 다시 실행하면 최신으로 덮어씁니다. 직접 받으려면 그 tar.gz를 풀면 됩니다.
- 설치된 버전은 `.claude/skills/slur-guidelines/VERSION`(`slur-design`에도 같은 파일)에 적혀 있고, 최신 버전은 [`/skill/VERSION`](/skill/VERSION)입니다 — 둘이 다르면 스크립트를 다시 실행하세요. 이 파일은 사이트가 빌드 때 만들어 넣는 것이라 저장소 원본에는 없습니다.
- 설치 확인: `ls .claude/skills`에 두 폴더가 보이면 됩니다. Claude Code는 다음 대화부터 자동으로 읽습니다.
- **다른 AI 도구**(Cursor, Copilot 등): `SLUR_SKILLS_DIR`로 원하는 폴더에 받은 뒤 `SKILL.md`와 `references/`를 그 도구의 규칙 파일로 연결합니다. 스킬은 마크다운과 CSS/JS 파일이라 도구를 가리지 않습니다.

---

## 2. 부르는 말 — 두 가지

| 이렇게 말하면 | 가장 쉬운 차이 | AI가 하는 일 |
|---|---|---|
| **"슬러 UI 가이드로 적용해줘"** | 디자인은 그대로, 만드는 규칙만 슬러로 | 네이밍·`data-state`·CSS 작성법·접근성을 맞추고 기존 디자인과 토큰은 유지합니다 |
| **"슬러 디자인시스템으로 적용해줘"** | 화면의 생김새까지 슬러로 | UI 가이드와 토큰을 적용하고, 현재 프로젝트에서 실제 사용하는 컴포넌트·패턴만 가져옵니다 |

디자인시스템 적용은 모든 소스를 넣는다는 뜻이 아닙니다. AI가 현재 프로젝트를 먼저 확인한 뒤 필요한 요소만 적용합니다. **토큰만 적용**은 대표 호출어가 아니며, “기존 컴포넌트는 유지하고 색·타이포·간격만 슬러로”라고 범위를 명시했을 때만 제한 옵션으로 처리합니다.

### 예시 프롬프트

```text
슬러 디자인시스템으로 고객 목록 화면 만들어줘.
list.html 조립본을 복사해서 시작하고, 열은 이름·이메일·플랜·가입일·상태,
행 메뉴에 "상세 보기"·"휴면 처리"·"삭제".
```

```text
이 React 컴포넌트를 슬러 UI 가이드로 리팩토링해줘.
디자인은 바꾸지 말고 클래스 네이밍·상태(data-state)·CSS 작성 규칙만 맞춰줘.
```

프로젝트 `CLAUDE.md`(또는 `AGENTS.md`)에 한 줄 적어 두면 매번 말하지 않아도 됩니다.

```text
이 프로젝트는 슬러 디자인시스템으로 만든다. 먼저 현재 프로젝트를 확인하고 실제 사용하는 컴포넌트와 패턴만 적용한다. 동작은 네이티브 → slur.js → 위임, 모양은 슬러 클래스와 토큰, 상태는 data-state.
```

---

## 3. 결과 점검

UI 가이드만 적용했다면 기존 디자인이 유지됐는지와 [체크리스트](/reference/checklist/)를 확인합니다. 아래는 디자인시스템까지 적용한 화면을 빠르게 거르는 항목입니다.

- [ ] 인라인 `style=` 0개, CSS `id` 선택자 0개, `!important` 0개
- [ ] 생 색상값(hex/rgb) 0개, 번호 프리미티브(`--color-neutral-400` 등) 직접 참조 0개 — 시맨틱 토큰만
- [ ] 상태는 `data-state` — `.active` 같은 상태 클래스 없음. 네이티브·ARIA 상태(`[open]` `:popover-open` `aria-sort` `aria-current` `aria-checked`)에 `data-state`를 겹치지 않음
- [ ] `i_`/`p_`/`l_`는 블록 하위로 스코프(`.page_list .p_head` ✅, `.p_head` 단독 ❌), 같은 범위 접두사 중첩 없음
- [ ] 로드 순서 `global.css → common.css → page.css`, `slur.js` 로드됨, 런타임 `@import` 없음
- [ ] 토스트 컨테이너(`.toast_message[role=status]`)가 미리 DOM에 있고, 4상태 블록에 `data-state`가 선언돼 있음
- [ ] 아이콘만 있는 버튼에 `aria-label`, 폼 오류는 `field` + `i_help` + `aria-invalid`, 파괴적 동작은 `<dialog>` 확인
- [ ] 포커스 링을 컴포넌트에서 재선언하지 않음, `data-theme="dark"`로 바꿔도 깨지지 않음
- [ ] 다른 유틸리티·컴포넌트 클래스 체계와 섞지 않음

전체 목록은 [체크리스트](/reference/checklist/)와 스킬의 「완성 후 점검」에 있습니다.

---

## 4. 스택별 메모

- **정적 HTML · Astro**: 조립본을 그대로 복사하고 `<link>` 경로만 바꿉니다.
- **React · Next.js**: 페이지 CSS는 CSS Module(같은 클래스명), 페이지 JS의 `data-action` 분기는 핸들러로. `slur.js`는 `app/layout.tsx`에서 `<Script src="/slur.js" strategy="afterInteractive" />`로 한 번 — 이벤트를 `document`에 위임하므로 나중에 마운트된 요소에도 동작합니다. 탭처럼 React가 선택 상태를 들고 있으면 `data-state`·`aria-selected`를 React가 렌더하고 키 규칙은 컴포넌트 안에서 같은 규칙으로 구현합니다(`slur.js`의 `tabs`가 참조 구현). 둘이 같은 속성을 동시에 쓰지 않게 합니다 — [외부 라이브러리 연동](/js/external-libraries/).
- **Vue · Svelte**: 같은 원리 — 클래스명은 그대로, 상태는 `data-state` 바인딩, `slur.js`는 앱 진입점에서 한 번.

---

## 5. 파일 한눈에

| 무엇 | 어디 |
|---|---|
| UI 가이드 스킬 | [`slur-guidelines/SKILL.md`](/skill/slur-guidelines/SKILL.md) + `references/`(naming · css · html · js · component · accessibility · ux-states · media · migration · checklist) |
| 공통 레이어 · 동작 층 | [`global.css`](/skill/slur-design/assets/css/global.css) · [`common.css`](/skill/slur-design/assets/css/common.css) · [`slur.js`](/skill/slur-guidelines/assets/slur.js) |
| 디자인시스템 스킬 | [`slur-design/SKILL.md`](/skill/slur-design/SKILL.md) + [`references/recipes.md`](/skill/slur-design/references/recipes.md) |
| 토큰 · 컴포넌트 · 패턴 | `slur-design/assets/tokens/` · `components/` · `patterns/` — [토큰](/design/tokens/) · [컴포넌트](/design/components/) · [패턴 · 화면 조립본](/design/screens/) |
| 조립본 · 데모 | [조립본 목차](/skill/slur-design/assets/patterns/screens/index.html) · [컴포넌트 데모](/system/demo.html) |

스킬과 이 문서는 같은 버전 번호로 움직입니다([변경 이력](/changelog/version-history/)).
