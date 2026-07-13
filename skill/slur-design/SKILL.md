---
name: slur-design
description: SLUR Design System — 시각 어휘(디자인 토큰과 컴포넌트 스타일). SLUR 룩앤필로 UI를 만들 때 이 스킬을 사용한다. "SLUR 디자인으로", "우리 디자인시스템으로", "슬러 룩으로 만들어줘"라는 요청, 또는 SLUR 토큰(색·타이포·간격)이나 기성 컴포넌트(Button, Input, Badge 등)가 필요할 때 참고한다. 문법(네이밍·상태·CSS 작성 규칙)은 slur-ux 스킬이 담당하므로 항상 함께 적용한다.
---

# SLUR Design System (시각 어휘)

이 스킬은 **어휘**를 제공한다 — 색·타이포·간격 토큰과 컴포넌트의 생김새. **문법**(클래스 네이밍, `data-state`, CSS 작성 규칙, 단위·토큰 운영 원칙)은 `slur-ux` 스킬이 규정하며, 이 시스템의 모든 코드는 그 문법을 따른다. 두 스킬은 항상 함께 쓴다.

## 원본 위치

```
/Users/slur/SLUR_Works/02_SLUR_Projects/slur-docs/system/
├── tokens/        # colors, typography, spacing, radius, shadows, motion, breakpoints, z-index
├── global.css     # 공통 리셋 + 폼 컨트롤 상속 + 포커스 링
├── components/    # button, input, select, selection, badge, card, alert, modal, navigation, table
├── demo.html      # 전 컴포넌트 데모 (라이트/다크)
└── README.md      # 단위·토큰 기준, 원본과의 의도적 차이, 동기화 원칙
```

다른 프로젝트에서 쓸 때는 필요한 파일을 복사한다(향후 npm 패키지 `proto-phase`로 대체 예정). 새 컴포넌트를 만들 때는 기존 컴포넌트 CSS를 열어 패턴을 따른다.

## 로드 순서

`tokens/*.css` → `global.css` → `components/*.css` — 전부 개별 `<link>`(병렬). 런타임 `@import` 금지. 웹폰트(Pretendard)는 시스템이 로드하지 않는다 — 소비자 페이지가 CDN `<link>`로 직접 넣는다.

## 핵심 규칙

- **시맨틱 토큰만 사용한다.** 번호 프리미티브(`--color-neutral-400` 등) 직접 사용 금지 — 프리미티브는 시맨틱 레이어의 내부 구현이다.
- **다크 모드는 `<html data-theme="dark">`** 하나로 끝난다 — 시맨틱 레이어가 재배선되므로 컴포넌트는 손대지 않는다.
- **공유 컨트롤 높이: `2 / 2.5 / 3rem`** (32/40/48, `m_small`/기본/`m_large`).
- **상태색 면 위 텍스트는 on-토큰**: `--color-on-danger` / `--color-on-success` / `--color-on-warning`. 리터럴 `#fff` 금지 (on-warning은 대비 때문에 진한색).
- **포커스는 global.css가 처리한다** — 컴포넌트에서 outline/포커스 링을 반복 선언하지 않는다.
- 아이콘은 `em`(`1.125em` 기본), `stroke="currentColor"` — 텍스트 크기·색을 따라간다.

## 토큰 빠른 참조 (실제 이름 — 추측 금지)

원본 파일을 읽을 수 없는 환경에서도 아래 이름을 그대로 쓴다. 여기 없는 토큰은 존재하지 않는 것이다 — 지어내지 말고 원본을 확인하거나 사용자에게 묻는다.

- **텍스트**: `--color-text-primary` `-secondary` `-muted` `-inverse` `-brand`
- **면**: `--color-surface-page` `-card` `-sunken` `-hover` `-inverse`
- **보더**: `--color-border-subtle` `-default` `-strong` `-focus`
- **브랜드**: `--color-brand` `-hover` `-active` `-soft`, `--color-on-brand`, `--color-focus-ring`
- **상태**: `--color-success` `-warning` `-danger` (+ 각 `-soft`), `--color-on-danger` `-on-success` `-on-warning`
- **타이포**: `--font-sans`, `--text-xs`(12) `-sm`(14) `-base`(16) `-lg`(18) `-2xl`(24) `-3xl`(30) `-4xl`(36), `--weight-medium`(500) `-semibold`(600) `-bold`(700), `--leading-normal`(1.5), `--tracking-tight` `-snug` `-wide`
- **간격**: `--space-4` `-8` `-12` `-16` `-20` `-24` (rem, 이름 = px 환산값)
- **라디우스**: `--radius-4` `-8` `-12` `-full` (px)
- **그림자**: `--shadow-xs` `-sm` `-md` `-lg`
- **모션**: `--duration-fast`(120ms) `-base`(200ms) `-slow`(280ms), `--ease-standard` `-in` `-out` `-spring`
- **z-index**: `--z-base` `-dropdown` `-sticky` `-overlay` `-modal` `-popover` `-toast` (0~600, 100 간격)
- **브레이크포인트**(참조용): `--breakpoint-sm`(640) `-md`(768) `-lg`(1024) `-xl`(1280) — 미디어쿼리에는 px 리터럴 직접 사용

## 원본과의 관계

- **클로드디자인 프로젝트**(SLUR Design System)는 전체 팔레트를 가진 **디자인 작업대** — 새 역할·컴포넌트 탐색은 거기서 하고, 확정된 것을 `system/`으로 내려받는다(DesignSync).
- **`system/`은 실사용 서브셋** — usage-driven 원칙 적용. 여기 없는 토큰이 필요하면 임의로 만들지 말고 클로드디자인 팔레트에서 꺼내온다.
