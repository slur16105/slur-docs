---
title: 버전 히스토리
description: SLUR UX/UI System의 변경 이력과 주요 업데이트 내용을 버전별로 정리합니다.
---

이 문서는  
SLUR UX/UI System의  
**버전별 변경 이력**을 기록합니다.

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

