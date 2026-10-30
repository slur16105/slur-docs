---
title: 폼 컨트롤 크기 기준
description: PC 40px·모바일 48px 컨트롤 높이의 적용 조건과 접근성·디자인 시스템 근거를 설명합니다.
---

# 폼 컨트롤 크기 기준

확정일: 2026.10.30 · SLUR 시스템 정본으로 이전 (Guide v2.55 기록 대체)

사용자 승인: 수량 입력을 PC 40px·모바일 48px로 수정하고, 이후 적용할 지침과 근거를 기록한다.

## SLUR 적용 기준

| 환경 | 버튼·입력·셀렉트 높이 | 기본 글꼴 16px 기준 |
| --- | --- | --- |
| 일반 PC 폼 | 2.5rem | 40px |
| 모바일·터치 환경 | 3rem | 48px |
| 조밀한 PC 화면의 명시적인 작은 변형 | 2rem | 32px |

모바일·터치 조건은 `(max-width: 767px), (any-pointer: coarse)`로 한다. 둘 중 하나만 충족해도 3rem을 사용한다. 이는 작은 화면과 터치 가능한 태블릿·노트북을 포괄하기 위한 프로젝트 결정이며 외부 표준이 지정한 분기점은 아니다. 터치가 없는 좁은 PC 창에서도 3rem이 적용된다.

컨트롤 높이와 패딩은 rem으로 설정해 사용자 글꼴 확대를 따른다. 위 px 수치는 루트 글꼴 16px에서의 환산값이다. 같은 줄에 붙는 컨트롤의 높이는 일치시킨다. ± 버튼은 정사각형 조작 영역을 확보하고, 숫자 입력의 너비는 별도로 정한다. 보이는 아이콘과 실제 클릭·터치 영역은 구분하며, 인접 영역을 겹쳐 확장하지 않는다.

이 기준은 신규·수정하는 컴포넌트에 적용한다. 기존 예제를 일괄 변환하지 않는다. 이번 변경은 독립 `quantity` 컴포넌트에만 적용하며 SLUR Guide의 기존 `input_qty` 예제는 이번 시스템 변경 범위에 포함하지 않는다.

## 근거와 해석

- [WCAG 2.2 — Target Size Minimum, 2.5.8 AA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): 포인터 대상 영역은 원칙적으로 24×24 CSS px 이상이며 간격·동등 기능·인라인 등의 예외가 있다. PC·모바일별 입력 높이를 지정하는 규정이 아니다.
- [WCAG 2.2 — Target Size Enhanced, 2.5.5 AAA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced): 강화 기준은 44×44 CSS px 이상이며 예외가 있다. PC 40px를 채택했다고 이 AAA 기준까지 충족한다고 주장하지 않는다.
- [IBM Carbon — Text Input Guidelines](https://www.carbondesignsystem.com/building-blocks/core/components/text-input/guidelines): 입력의 작은 크기 32px, 기본 크기 40px, 큰 크기 48px를 제공한다. 동일 폼의 필드 높이를 일관되게 사용하도록 안내한다. SLUR의 기존 2/2.5/3rem 체계를 유지하는 참고 근거다.
- [IBM Carbon — Button Usage](https://carbondesignsystem.com/components/button/usage/): 작은 버튼은 32px 입력, 중간 버튼은 40px 입력과 함께 사용하는 기준을 제공한다. 인접 버튼과 입력의 높이 정렬 근거다.
- [Google Android — Touch Target Size](https://support.google.com/accessibility/android/answer/7101858?hl=en): 48×48dp 이상의 터치 영역을 권장한다. 모바일에서 더 큰 조작 영역을 확보할 근거로 참고하며, dp를 CSS px와 동일 단위라고 간주하지 않는다.
- [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons): 일반적인 버튼 조작 영역으로 44×44pt 이상을 안내한다. 웹 입력 높이를 44px로 고정하라는 규칙이 아니다.

위 자료는 사용 빈도 통계가 아니라 접근성 표준과 디자인 시스템 지침이다. **PC 40px·모바일 48px는 이를 참고해 사용자가 승인한 SLUR 설계 결정**이다.

## 변경 내용

기존 수량 입력의 44px는 SLUR 크기 기준 확인 없이 미리보기 값을 적용한 것이므로 대체한다. `quantity.css`의 컴포넌트 변수 `--quantity-control-size`로 버튼·입력 높이와 ± 버튼 너비를 함께 제어한다. 가이드 페이지의 표시 소스도 실제 CSS와 동기화한다.

## 이전 전 검증 (SLUR Guide, 참고 기록)

2026.10.30, 기존 Ego 브라우저 탭의 실제 DOM 치수와 입력 동작으로 확인했다.

- PC 폭 1280px·768px, 터치 없음: ± 버튼 40×40px, 입력 64×40px.
- 폭 767px·390px: ± 버튼 48×48px, 입력 64×48px.
- 폭 1024px, CDP 터치 에뮬레이션: `any-pointer: coarse` 일치, 입력 높이 48px.
- 위 네 화면 폭에서 문서 가로 넘침 없음.
- 99 직접 입력 후 증가 버튼 disabled 확인.
- 목록 클릭 후 수량 입력 iframe 표시 확인.
- 표시용 CSS 소스와 실제 컴포넌트 CSS 일치 확인.
- 마크업 목록 생성·검증 스크립트 통과, 기존 목록 셸·CSS·JS 보존 확인.
- JavaScript 문법 검사 및 `git diff --check` 통과.

터치 검증은 에뮬레이션이며 실기기·Safari·스크린리더를 검증한 것은 아니다. 위 결과만으로 전체 페이지의 WCAG 적합성을 인증하지 않는다.

## 정본 관리

2026.10.30: 사용자 요청에 따라 SLUR Guide의 컴포넌트·지침을 SLUR 시스템으로 이전했다. 실행 원본은 `skill/slur-design/assets/components/quantity.css`와 `assets/js/quantity.js`이며 `system/demo.html#quantity`에서 검증한다. Guide의 신규 quantity 페이지·목록·지침 사본은 제거한다. 배포용 public 파일은 빌드로 생성한다.

## 시스템 이전 후 검증

- `npm run build` 통과: 아이콘, CSS 구조, 대비, 테마, 기기 미리보기, 인증 셸 및 실험실 격리 검사 포함. 기존 404 문서 경고가 있으나 빌드는 성공했다.
- 빌드된 `/system/demo.html#quantity`에서 PC 입력 높이 40px, 390px 화면에서 48px 확인.
- 실제 버튼 클릭으로 수량 1→2, 99 직접 입력 후 증가 버튼 disabled 확인.
- 시스템 문서의 iframe과 크기 기준 링크 표시 확인. 기존 Guide의 컴포넌트 사본을 삭제하고 목록·지침에서 제거했다.
- 검증 환경은 Chromium이며 실기기·Safari·스크린리더 미검증.
