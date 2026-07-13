# SLUR Design System (slur-ux 구현)

클로드디자인 프로젝트 [SLUR Design System](https://claude.ai/design/p/c9449985-b8f5-40fc-8ef6-128b40f79649)을 **slur-ux 문법으로 구현**하는 작업 공간.

- **디자인시스템(어휘)**: 색·타이포·간격 등 토큰과 컴포넌트 생김새 — 클로드디자인이 원본(source of truth)
- **slur-ux(문법)**: 클래스 네이밍(`i_`/`m_`), 상태(`data-state`), CSS 한 줄 작성 규칙 — 이 레포의 `skill/slur-ux/`가 원본

두 시스템의 결합 규칙:

| 클로드디자인 원본 | slur-ux 변환 |
|---|---|
| 인라인 스타일 `style="..."` | 컴포넌트 클래스 + 한 줄 CSS 규칙 |
| 변형(기본/보조/고스트/위험, 크기) | `m_primary` `m_ghost` `m_danger` `m_small` `m_large` |
| 상태(loading, disabled) | `data-state="loading"`, `disabled` 속성 |
| 시맨틱 토큰만 사용 (numbered primitive 금지) | 동일 — 그대로 유지 |
| 다크 모드 `[data-theme="dark"]` | 동일 — 그대로 유지 |

## 구조

```
system/
├── tokens/        # 클로드디자인에서 가져온 토큰 — 카테고리별 파일, 개별 <link>로 로드
├── global.css     # 공통 리셋 — box-sizing/margin/padding 리셋, 컨트롤 타이포 상속, 포커스 링
├── components/    # slur-ux 문법으로 변환한 컴포넌트 CSS
└── demo.html      # 브라우저에서 바로 열어 확인하는 데모
```

로드 순서: `tokens/*.css` → `global.css` → `components/*.css` (전부 개별 `<link>`, 병렬 로드). 리셋과 컨트롤 공통값(font-family/size, color 상속, 포커스 링)은 global이 담당하고, 컴포넌트 CSS에는 기본값과 다른 변형만 남긴다.

## 파일 분할과 로드

- 소스(저작)는 카테고리별 파일로 나눈다. 로드는 개별 `<link>`로 한다 — **`@import`가 브라우저에 도달하면 순차 폭포가 생기므로 런타임 사용 금지.**
- 번들 파이프라인(npm 패키징 등)이 생기면 그때 진입점 `index.css`를 빌드 전용으로 재도입한다. `@import`는 빌드 타임에 해석될 때만 허용.
- 웹폰트(Pretendard)는 시스템이 강제 로드하지 않는다 — 소비자 페이지가 `<link>`로 직접 넣는다 (demo.html 참고).

## 단위·토큰 기준

- **rem**: 글자 크기, 컨트롤 높이·패딩(2/2.5/3rem = 32/40/48), 텍스트 주변 간격(space 토큰). 기준 질문: "글자 크기를 키웠을 때 함께 커져야 정보 전달이 유지되는가" — https://blog.slur.co.kr/260107-rem/
- **px**: 라디우스, 1px 보더, 그림자, 브레이크포인트, 레이아웃 구조 간격(데모 페이지의 섹션 여백·그리드 갭)
- 루트 폰트 100% 유지(% 환산 트릭 금지), rem 토큰에는 px 환산 주석
- 토큰은 실제 사용처가 생길 때만 추가(미사용 스케일 삭제됨), 반복 생값은 스케일로 스냅. z-index만 레이어 계약으로 전체 유지
- **em**: 텍스트와 나란히 의미를 전달하는 아이콘 크기 — 부모 font-size에 비례, SVG width/height 속성 고정 금지

## 변환 현황

- [x] tokens (colors, typography, spacing, radius, shadows, motion, fonts, breakpoints, z-index)
- [x] Button
- [x] Input
- [x] Selection
- [x] Badge
- [x] Card
- [x] Alert
- [x] Modal
- [x] Navigation
- [x] Table

주의: 내부 요소(`i_`/`p_`/`l_`) 선택자는 반드시 블록 하위로 스코프한다(`.page_demo .p_head` ✅, `.p_head` 단독 ❌ — `css/internal-elements.md` 참고).

## 원본과의 의도적 차이

- **상태색 면 위 텍스트**: 원본의 리터럴 `#fff`를 색상별 on-토큰으로 교체. `on-danger`/`on-success`는 흰색(red 4.8:1 ✓ / green 3.3:1 — AA 미달이지만 룩 통일 우선, Slur 결정), `on-warning`은 진한색(5.9:1 ✓). 클로드디자인에 역반영됨.

## 동기화 원칙

클로드디자인 프로젝트와 이 폴더는 계층이 다르다:

- **클로드디자인 = 디자인 토큰(전체 팔레트).** 디자이너의 탐색·실험을 위한 작업대이므로 전체 스케일을 유지한다 — 미사용처럼 보여도 "재고"다.
- **`system/` = UI 토큰(실사용 서브셋).** usage-driven 원칙은 여기에만 적용한다. 새 역할이 필요하면 팔레트에서 꺼내온다.

토큰 값이 바뀌면 클로드디자인 쪽을 먼저 수정하고 여기로 내려받는다(DesignSync). 컴포넌트 CSS는 이 레포가 원본이다 — 클로드디자인의 `.dc.html`은 갤러리/미리보기 용도.
