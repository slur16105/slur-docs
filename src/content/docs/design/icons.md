---
title: 아이콘 — Lucide
description: SLUR 기본 아이콘 Lucide의 선정 이유, 기능별 사용 기준, 로컬 SVG 및 라이선스 관리.
---

SLUR Design System의 **기본 UI 아이콘은 Lucide**입니다. 2026-10-28에 채택했습니다. 기존의 단정한 선형 아이콘과 잘 맞고, 글자 크기와 색에 연동하는 SVG 규칙을 그대로 사용할 수 있어 선정했습니다.

[전체 아이콘 찾아보기](https://lucide.dev/icons/) · [공식 사용 안내](https://lucide.dev/guide/) · [공식 라이선스](https://lucide.dev/license)

## 적용 방식

필요한 공식 SVG만 프로젝트 내부에 보관하고 인라인으로 사용합니다. 현재 배포 자산에는 **lucide-static 1.63.0**의 사용 서브셋과 라이선스가 들어 있습니다. 추가 런타임이나 CDN 연결은 필요하지 않습니다.

- 원본의 24×24 viewBox와 경로를 유지합니다. 선 두께는 기본 2, 색은 `currentColor`, 채움은 `none`입니다.
- 고정 width/height 속성을 제거하고 소유 컴포넌트 CSS에서 크기를 정합니다. 텍스트 동반 아이콘의 기본 크기는 `1.125em`입니다.
- SVG의 `data-icon`은 공식 아이콘 이름을 기록하는 메타데이터입니다. 스타일·행동·상태 연결에 사용하지 않습니다.
- 텍스트 옆 아이콘은 보조 기술에서 숨깁니다. 아이콘 전용 버튼에는 `aria-label`로 기능을 설명합니다.
- 의미가 필요한 동작·탐색·상태에만 사용하고, 동일 기능에는 동일 아이콘을 사용합니다. 색이나 아이콘만으로 상태를 전달하지 않습니다.

```html
<button class="btn m_icon" type="button" aria-label="검색">
    <svg data-icon="search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
</button>
```

## 기능별 선택

| 사용처 | 기본 아이콘 |
|---|---|
| 검색 · 메뉴 · 닫기 | `search` · `menu` · `x` |
| 추가 · 수정 · 삭제 · 복사 | `plus` · `pencil-line` · `trash-2` · `copy` |
| 이전 · 다음 · 접기 · 펼치기 | `chevron-left` · `chevron-right` · `chevron-up` · `chevron-down` |
| 대시보드 · 고객 · 설정 | `layout-dashboard` · `user`/`users` · `settings` |
| 문서 · 통계 · 알림 | `file-text` · `chart-line` · `bell` |
| 성공 · 정보 · 경고 · 오류 | `check` · `info` · `triangle-alert` · `circle-alert` |
| 날짜 · 시간 · 업로드 | `calendar-days` · `clock` · `upload` |
| 라이트 · 다크 | `sun` · `moon` |

[컴포넌트 데모](/system/demo.html)와 [화면 조립본](/design/screens/)에 적용되어 있습니다.

## 브랜드와 기존 화면

SLUR 로고와 외부 서비스 로고는 공식 브랜드 자산을 사용합니다. Lucide의 일반 아이콘으로 대체하지 않습니다. 공식 자산이 없으면 서비스 이름을 텍스트로 표시합니다.

새 SLUR 화면에는 Lucide를 기본 적용합니다. 기존 디자인 유지나 토큰만 적용하는 작업은 원래 범위를 따릅니다. Starlight 문서 셸과 외부 위젯 내부 아이콘은 해당 제품이 관리하며, SLUR의 기본 아이콘 규칙을 이유로 내부 코드를 수정하지 않습니다.

## 출처와 라이선스 보관

사용 SVG는 `slur-design/assets/vendor/lucide/1.63.0/icons/`에 있습니다. 프로젝트로 복사할 때 상위 폴더의 `LICENSE`도 함께 가져갑니다. 공식 패키지의 ISC 고지와 Feather 유래 아이콘에 대한 MIT 고지를 모두 보존합니다. 새 아이콘은 공식 원본·버전을 확인해서 추가하고 임의로 경로를 다시 그리지 않습니다.
