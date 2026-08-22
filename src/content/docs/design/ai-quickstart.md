---
title: AI 퀵스타트
description: Claude Code 같은 AI 코딩 도구에 슬러 문법·디자인 스킬을 설치하고, "슬러 시스템으로 / 슬러 디자인으로"라고 불러 규칙대로 화면을 만들게 하는 가장 짧은 길입니다.
---

슬러의 규칙은 사람이 읽는 문서이자 **AI가 읽는 스킬**입니다.
같은 내용이 두 스킬 폴더(`slur-guidelines` 문법, `slur-design` 어휘)에 AI용으로 압축돼 있어,
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

## 2. 부르는 말 — 세 가지

| 이렇게 말하면 | AI가 하는 일 |
|---|---|
| **"슬러 시스템으로"** | 문법만 적용 — 네이밍·`data-state`·한 줄 CSS·접근성 규칙. **기존 디자인은 그대로.** `global.css`·`slur.js`만 들어갑니다 |
| **"슬러 디자인으로"** | 문법 + 어휘 전부 — 토큰·컴포넌트·패턴을 넣고 슬러 룩으로 만듭니다. 새 화면은 [조립본](/design/screens/)을 복사해 시작합니다 |
| **"슬러 디자인 토큰만"** | 문법 + 토큰 — 색·폰트·간격만 슬러, 컴포넌트는 프로젝트가 토큰으로 직접 |

### 예시 프롬프트

```text
슬러 디자인으로 고객 목록 화면 만들어줘.
list.html 조립본을 복사해서 시작하고, 열은 이름·이메일·플랜·가입일·상태,
행 메뉴에 "상세 보기"·"휴면 처리"·"삭제".
```

```text
이 React 컴포넌트를 슬러 시스템으로 리팩토링해줘.
디자인은 바꾸지 말고 클래스 네이밍·상태(data-state)·CSS 작성 규칙만 맞춰줘.
```

```text
슬러 디자인 토큰만 써서 이 랜딩 페이지의 색·타이포를 맞춰줘. 컴포넌트는 지금 것 유지.
```

프로젝트 `CLAUDE.md`(또는 `AGENTS.md`)에 한 줄 적어 두면 매번 말하지 않아도 됩니다.

```text
이 프로젝트는 슬러 디자인으로 만든다. 동작은 네이티브 → slur.js → 위임, 모양은 슬러 클래스와 토큰, 상태는 data-state.
```

---

## 3. 결과 점검

AI가 만든 화면도 사람이 만든 것과 같은 기준으로 봅니다. 빠르게 거르는 항목입니다.

- [ ] 인라인 `style=` 0개, CSS `id` 선택자 0개, `!important` 0개
- [ ] 생 색상값(hex/rgb) 0개, 번호 프리미티브(`--color-neutral-400` 등) 직접 참조 0개 — 시맨틱 토큰만
- [ ] 상태는 `data-state` — `.active` 같은 상태 클래스 없음. 네이티브·ARIA 상태(`[open]` `:popover-open` `aria-sort` `aria-current` `aria-checked`)에 `data-state`를 겹치지 않음
- [ ] `i_`/`p_`/`l_`는 블록 하위로 스코프(`.page_list .p_head` ✅, `.p_head` 단독 ❌), 같은 범위 접두사 중첩 없음
- [ ] 로드 순서 `global → tokens → components → patterns → 프로젝트`, `slur.js` 로드됨, 런타임 `@import` 없음
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
| 문법 스킬 | [`slur-guidelines/SKILL.md`](/skill/slur-guidelines/SKILL.md) + `references/`(naming · css · html · js · component · accessibility · ux-states · media · migration · checklist) |
| 공통 레이어 · 동작 층 | [`global.css`](/skill/slur-guidelines/assets/global.css) · [`slur.js`](/skill/slur-guidelines/assets/slur.js) |
| 어휘 스킬 | [`slur-design/SKILL.md`](/skill/slur-design/SKILL.md) + [`references/recipes.md`](/skill/slur-design/references/recipes.md) |
| 토큰 · 컴포넌트 · 패턴 | `slur-design/assets/tokens/` · `components/` · `patterns/` — [토큰](/design/tokens/) · [컴포넌트](/design/components/) · [패턴 · 화면 조립본](/design/screens/) |
| 조립본 · 데모 | [조립본 목차](/skill/slur-design/assets/patterns/screens/index.html) · [컴포넌트 데모](/system/demo.html) |

스킬과 이 문서는 같은 버전 번호로 움직입니다([변경 이력](/changelog/version-history/)).
