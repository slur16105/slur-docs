# CSS 작성 규칙

## 원칙

CSS는 구조를 표현하는 언어다. HTML 구조를 바꾸지 않고, 재사용과 유지보수를 고려해서 작성한다.

---

## 규칙

- **클래스는 한 줄로 작성한다.** 속성 개수와 상관없이 선택자 하나당 한 줄.
- 스타일을 위해 HTML 구조를 변경하지 않는다.
- 공통 스타일을 우선 작성한다.
- 선택자는 2단계를 권장하고 3단계 이상을 지양한다.
- 컴포넌트 단위로 스타일을 작성한다.
- 스타일 변형은 `m_`를 사용한다.
- 상태는 `data-state`를 사용한다.
- 재사용을 우선한다.
- 필요한 경우에만 애니메이션을 사용한다.
- 성능을 고려한다.

---

## 공통 레이어 — global.css

"공통 스타일을 우선 작성한다"는 **공통 레이어(파일명 관례: `global.css`)를 컴포넌트보다 먼저 만든다**는 뜻이다. 리셋과 시스템 기본값(타이포, 색 상속, 포커스)은 global이 담당하고, 컴포넌트 CSS에는 기본값과 **다른 값(변형)**만 남긴다.

- **전체 선택자 리셋을 선언한다**: `box-sizing: border-box`와 `margin: 0; padding: 0`. 모던 브라우저에서 `*`의 성능 비용은 없으며, gap 기반 간격 체계에서 UA 기본 마진·패딩은 전부 소음이다.
- **폼 컨트롤은 body에서 font/color를 상속받지 않는다** (브라우저 UA 스타일). 태그 레벨에서 `inherit`로 상속을 연다.
- **`outline: none`은 반드시 대체 포커스 링과 한 쌍**으로, global에서 한 번만 선언한다. 컴포넌트마다 반복하지 않는다.
- 컨트롤 기본 타이포(예: 본문 16px / 컨트롤 14px)는 시스템 규칙으로 global에 명시한다.

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
body { background: var(--color-surface-page); font-family: var(--font-sans); font-size: var(--text-base); color: var(--color-text-primary); }
input, textarea, select, button { font-family: inherit; font-size: var(--text-sm); line-height: inherit; color: inherit; }
button { font-weight: var(--weight-medium); line-height: 1; }
input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible { outline: none; box-shadow: var(--color-focus-ring); }
```

```css
/* 컴포넌트에는 변형만 남긴다 — font-family/color/outline 반복 ❌ */
.btn { display: inline-flex; height: 2.5rem; padding: 0 var(--space-16); border: 1px solid var(--color-border-default); border-radius: var(--radius-8); background: var(--color-surface-card); cursor: pointer; }
.btn.m_large { height: 3rem; padding: 0 var(--space-24); font-size: var(--text-base); }
```

---

## 단위 기준 — rem vs px

기준 질문 하나로 판정한다: **"사용자가 브라우저 글자 크기를 키웠을 때, 이 값이 함께 커져야 정보 전달이 유지되는가?"** (배경: https://blog.slur.co.kr/260107-rem/ — 전면 rem이 아니라 "rem을 안 쓰는 기준"을 갖는 것이 핵심)

| 단위 | 대상 | 이유 |
|------|------|------|
| **rem** | 글자 크기, 텍스트를 담는 컨트롤의 높이·패딩, 텍스트 주변 간격(space 토큰) | 글자만 커지고 그릇이 안 커지면 잘림 = 정보 전달 실패 |
| **px** | 라디우스, 1px 보더(헤어라인), 그림자, 브레이크포인트, 레이아웃 구조 간격(그리드 갭·섹션 여백), 비주얼 타이포(히어로), 애니메이션 측정값 | 글자 선호와 무관한 시각·구조 속성. 함께 커지면 오히려 레이아웃 전체가 거대해지는 파손 |
| **em** | 텍스트와 나란히 의미를 전달하는 아이콘 크기 (`.btn svg { width: 1.125em; }`) | 부모 font-size에 비례 — 글자 확대와 크기 변형(m_small/m_large)에 자동 연동. SVG의 width/height 속성 고정 금지 |

- 루트 폰트는 **100%(16px) 유지**. `62.5%`/`6.25%` 환산 트릭 금지 — 브라우저 최소 폰트 크기 설정(특히 CJK 로케일)에서 배율이 붕괴하고, 미디어쿼리의 rem은 루트 오버라이드를 무시해 이중 기준이 생긴다.
- rem 값에는 항상 px 환산 주석을 단다: `--text-sm: 0.875rem; /* 14 */`

---

## 토큰 운영 기준

- **토큰은 실제 사용처가 생길 때만 추가한다.** 완비된 스케일(0~96 전 단계 등)을 미리 만들지 않는다.
- 2계층 토큰(색상 등)에서 "사용"은 계층마다 정의가 다르다: **프리미티브의 사용 = 시맨틱 레이어가 참조**(라이트·다크 두 테마가 같은 사다리를 반대편에서 소비하므로 컴포넌트에 안 보여도 사용 중일 수 있다), **시맨틱의 사용 = 컴포넌트가 참조**. 어느 계층이든 참조 0회면 삭제 대상이다.
- **반복되는 생값은 가장 가까운 스케일 값으로 스냅해 토큰으로 흡수한다** (예: `18px → var(--space-16)`, `10px → var(--space-8)`). 임의값이 반복되는 것은 토큰 부재의 신호다.
- 예외: **z-index는 전 레이어를 유지한다** — 개별 값이 아니라 레이어 간 순서 계약이므로, 미사용 중간층을 지우면 지도가 사라진다.

### 눈금 토큰의 값은 불변이다

`--space-*`, `--radius-*`처럼 **이름이 곧 값인 토큰(눈금 토큰)은 값을 절대 바꾸지 않는다.** 값을 바꾸는 순간 이름이 거짓말을 하고, 코드베이스의 모든 숫자 이름을 의심해야 하는 영구적 비용이 생긴다. 눈금 토큰은 치환 장치가 아니라 **자(尺)의 눈금** — 선택지를 좁히는 메뉴이자 rem 정책의 집행 장치다.

"값을 바꾸고 싶다"는 요구는 실제로는 둘 중 하나이며, 각각 정답이 다르다:

- **특정 자리의 간격을 키우고 싶다** → 값 변경이 아니라 **선택 변경**. 그 사용처만 다른 눈금으로 재배정한다 (`var(--space-8)` → `var(--space-12)`). grep으로 찾을 수 있는 기계적 작업이다.
- **시스템 전역의 간격을 함께 조정하고 싶다** (밀도 모드 등) → 눈금 위에 **역할(시맨틱) 별칭 레이어**를 얹는다 (`--control-pad-x: var(--space-16)`). 색상의 primitive → semantic 2계층과 같은 구조. 단, 역할 레이어는 전역 연동 수요가 실증될 때 추가한다 — 미리 만들면 미사용 토큰이 된다.

간격에 생값(`8px`, `0.5rem`)을 직접 쓰지 않는다. 유일한 예외는 단위 기준에서 정한 레이아웃 구조 간격(px 직접 사용 영역)이다.

---

## 파일 분할과 로드 — @import는 저작 구조다

소스는 카테고리별 파일로 나눠 관리한다(저작 구조). 단, **`@import` 구문이 브라우저에 그대로 도달하게 하지 않는다** — 브라우저는 진입 파일을 받아 파싱한 뒤에야 임포트 대상을 발견하므로 순차 폭포(waterfall)가 생긴다.

- **빌드(번들)가 있는 배포**: 진입점 `index.css` + `@import` 허용 — 빌드 타임에 한 파일로 합쳐져 런타임 비용 0.
- **빌드 없이 서빙**: `@import` 대신 개별 `<link>`를 나열한다 — HTML 파싱 시점에 전부 발견되어 병렬 로드된다.
- 웹폰트는 시스템 CSS가 `@import`로 강제 로드하지 않는다 — 소비자 페이지가 `<link>`로 직접 넣는다.

---

## 파일 구성 순서

한 CSS 파일(또는 로드 순서)은 **구조 스케일이 큰 것 → 작은 것** 순으로 배치한다.

`global(리셋) → 레이아웃(layout_) → 컴포넌트 → 페이지(page_) → 반응형`

- 페이지를 바깥에서 안으로 읽는 순서(틀 → 조각 → 화면)라 구조 파악이 쉽다 (ITCSS의 objects→components 순서와 같은 결).
- 가장 로컬한 **페이지가 마지막** → 페이지가 레이아웃·컴포넌트를 오버라이드하기 안전하다.

### 레이아웃 블록엔 컴포넌트를 두지 않는다

`layout_` 블록의 내부는 **`l_` 내부 요소로 자족**시킨다. 재사용 컴포넌트를 레이아웃 안에 직접 넣지 않는다.

- **이유(수정 비용)**: 레이아웃 안에 공유 컴포넌트를 넣으면, 레이아웃을 고칠 때 그 컴포넌트까지 건드리게 되어 다른 사용처로 리스크가 번진다. 레이아웃을 `l_`로 자족시키면 수정 영향이 레이아웃 안으로 국소화된다.
- 컴포넌트는 **페이지가 조합**한다 (페이지 안에 컴포넌트를 배치).
- 예: 헤더의 탭·아이콘·검색은 `l_nav`·`l_icon`·`l_searchbar`(레이아웃 내부 요소)로 두고, 헤더에 `tab_menu`·`input` 같은 공유 컴포넌트를 직접 넣지 않는다.

---

## 한 줄 작성 규칙 (중요)

클래스 선언은 **속성이 아무리 많아도 한 줄**로 작성한다. 세로로 펼치지 않는다.

이유: 스타일시트 전체를 스크롤 없이 훑을 수 있고, 어떤 클래스들이 있는지 구조가 한눈에 들어온다. 각 클래스가 "무엇인지"를 빠르게 파악하는 것이 세부 속성을 한 줄씩 읽는 것보다 유지보수에 유리하다.

```css
/* 이렇게 (한 줄) */
.btn { display: inline-flex; height: 40px; padding: 0 16px; border: none; border-radius: 4px; background: #e0e0e0; font-size: 14px; color: #333; }

/* 이렇게 하지 않는다 (블럭) */
.btn {
    display: inline-flex;
    height: 40px;
    padding: 0 16px;
    ...
}
```

---

## 속성 작성 순서

한 줄로 쓰더라도 속성은 항상 이 순서를 지킨다. 순서가 고정돼야 한 줄 안에서도 예측 가능하게 읽힌다.

```
display → width/height → margin → padding → border → border-radius
→ background → font → color → text-align → position → overflow → transform → transition
```

적용 예:

```css
.selector { display: flex; width: 100%; margin: 0 auto; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; font-size: 14px; color: #333; position: relative; overflow: hidden; transition: all 0.2s ease; }
```

---

## 선택자 깊이

```css
/* 권장 — 2단계 */
.modal_login .i_head { }
.card_product .i_title { }

/* 지양 — 3단계 이상 */
.modal_login .i_wrap .i_head .i_title { }
```

### 내부 요소는 가장 가까운 블록 밑으로 (단독 금지, 중간 스킵)

내부 요소(`i_`/`p_`/`l_`)는 단독으로 쓰지 않고 **가장 가까운 블록** 밑에 스코프한다. 컴포넌트뿐 아니라 페이지(`page_`)·레이아웃(`layout_`)도 동일하며, 중간 내부 요소는 선택자에 넣지 않아 2단계를 유지한다.

```css
.layout_header .l_avatar { }   /* O — layout 블록 밑으로 */
.page_main .p_label { }        /* O — page 블록 밑으로, 중간 내부 요소 스킵 */

.l_avatar { }                  /* X — 블록 없이 단독 */
.p_section .p_label { }        /* X — 중간 내부 요소를 스코프로 사용 (블록 아님) */
```

---

## 스타일 변형 — `m_`

```css
.btn { display: inline-flex; height: 40px; padding: 0 16px; border: none; border-radius: 4px; background: #e0e0e0; font-size: 14px; color: #333; }
.btn.m_primary { background: #007aff; color: #fff; }
.btn.m_outline { border: 1px solid #007aff; background: transparent; color: #007aff; }
.btn.m_large { height: 48px; padding: 0 24px; font-size: 16px; }
.btn.m_small { height: 32px; padding: 0 12px; font-size: 12px; }
```

---

## 상태 스타일 — `data-state`

```css
.modal_login { display: none; }
.modal_login[data-state="open"] { display: flex; }
.btn[data-state="loading"] { opacity: 0.6; pointer-events: none; cursor: not-allowed; }
.input_text[data-state="error"] { border-color: #ff3b30; }
.tab_item[data-state="active"] { border-bottom: 2px solid #007aff; color: #007aff; }
```

---

## 반응형

프로젝트 기준(Mobile-first 또는 PC-first)을 정하고 일관되게 적용한다.

### 기본 방향은 Mobile-first를 우선 고려한다

절대 규칙이 아니라 **먼저 검토하는 기본값**이다. 프로젝트 성격에 따라 판단한다.

- **근거(사용률)**: 전 세계 웹 트래픽의 약 60~64%가 모바일이다(StatCounter, 2025). 다수 사용자의 환경을 기준으로 설계한다.
- **근거(리소스·비용)**: 가장 제약이 큰 화면(모바일)을 기본 스타일로 두고 `min-width`로 큰 화면을 점진적으로 향상(progressive enhancement)한다. 제약된 기기가 데스크톱용 오버라이드를 처리하지 않고, 이미지·지연로딩 전략과 결합하면 다수 사용자의 다운로드·연산이 줄어 결국 비용이 준다. (미디어쿼리 자체가 다운로드를 막는 게 아니라, "핵심 먼저 설계 + 점진적 향상" 구조가 절약의 실체다.)
- **예외**: 관리자 툴·B2B 대시보드처럼 데스크톱 사용이 우세한 프로젝트는 PC-first가 맞을 수 있다.

### 분기점은 최소한으로 — 기본 하나

특수한 경우가 아니면 **분기점은 하나만 둔다.** 대부분의 화면은 데스크톱↔모바일 두 상태로 충분하다.

- **근거(콘텐츠 기준)**: 분기점은 특정 기기 폭이 아니라 **레이아웃이 실제로 깨지는 지점**에만 둔다. 기기 종류마다 분기점을 늘리지 않는다.
- **근거(유지보수·비용)**: 분기점 × 상태(`data-state`) × 디바이스 클래스(`mo_`/`pc_`)가 곱해지며 테스트·유지보수 표면이 조합적으로 커진다. 분기점을 줄이는 것이 곧 관리 요소와 비용을 줄이는 것이다.
- **예외**: 태블릿 전용 레이아웃, 데이터 밀도가 크게 달라지는 대시보드 등 **콘텐츠가 실제로 요구할 때만** 분기점을 추가한다.

```css
/* Mobile-first 예시 (기본) — 모바일이 기본 스타일, 큰 화면을 향상 */
.card_product { width: 100%; }
@media (min-width: 769px) {
    .card_product { width: 300px; }
}

/* PC-first 예시 — 데스크톱 우세 프로젝트에서만 */
.card_product { width: 300px; }
@media (max-width: 768px) {
    .card_product { width: 100%; }
}
```

---

## 디바이스 클래스

```css
.mo_show { display: none; }
.pc_show { display: block; }

@media (max-width: 768px) {
    .mo_show { display: block; }
    .mo_hide { display: none; }
    .pc_show { display: none; }
    .pc_hide { display: block; }
}
```

---

## Next.js에서의 적용

CSS Modules 사용 시에도 동일한 네이밍 원칙과 한 줄 작성을 따른다.

```css
/* modal_login.module.css */
.modal_login { display: none; }
.modal_login[data-state="open"] { display: flex; }
.i_wrap { display: flex; width: 100%; flex-direction: column; }
.i_head { display: flex; align-items: center; justify-content: space-between; }
.btn { display: inline-flex; height: 40px; padding: 0 16px; }
.btn.m_primary { background: #007aff; color: #fff; }
```

Tailwind를 사용하더라도 컴포넌트 구조와 `data-state` 패턴은 유지한다.
