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
├── tokens/        # 클로드디자인에서 가져온 토큰 (index.css 하나만 링크하면 전부 로드)
├── base.css       # 공통 리셋 — 컨트롤 타이포 상속(font/color), outline 제거 + 포커스 링
├── components/    # slur-ux 문법으로 변환한 컴포넌트 CSS
└── demo.html      # 브라우저에서 바로 열어 확인하는 데모
```

로드 순서: `tokens/index.css` → `base.css` → `components/*.css`. 컨트롤 공통값(font-family/size, color 상속, 포커스 링)은 base가 담당하고, 컴포넌트 CSS에는 기본값과 다른 변형만 남긴다.

## 단위·토큰 기준

- **rem**: 글자 크기, 컨트롤 높이·패딩(2/2.5/3rem = 32/40/48), 텍스트 주변 간격(space 토큰). 기준 질문: "글자 크기를 키웠을 때 함께 커져야 정보 전달이 유지되는가" — https://blog.slur.co.kr/260107-rem/
- **px**: 라디우스, 1px 보더, 그림자, 브레이크포인트, 레이아웃 구조 간격(데모 페이지의 섹션 여백·그리드 갭)
- 루트 폰트 100% 유지(% 환산 트릭 금지), rem 토큰에는 px 환산 주석
- 토큰은 실제 사용처가 생길 때만 추가(미사용 스케일 삭제됨), 반복 생값은 스케일로 스냅. z-index만 레이어 계약으로 전체 유지
- 남은 과제: 인라인 SVG 아이콘이 `width` 속성(px)이라 글자 확대에 반응하지 않음 — em 기반 전환 필요

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

## 동기화 원칙

토큰 값이 바뀌면 클로드디자인 쪽을 먼저 수정하고 여기로 내려받는다(DesignSync). 컴포넌트 CSS는 이 레포가 원본이다 — 클로드디자인의 `.dc.html`은 갤러리/미리보기 용도.
