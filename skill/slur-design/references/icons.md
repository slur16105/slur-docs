# 기본 아이콘 — Lucide

2026-10-28부터 SLUR Design System의 기본 UI 아이콘은 **Lucide**다. 기존 선형 SVG, `em`, `currentColor` 규칙에 맞고 UI 전반의 형태를 통일하기 위해 선정했다.

- 공식 탐색: https://lucide.dev/icons/
- 공식 사용 안내: https://lucide.dev/guide/
- 동봉 원본: `assets/vendor/lucide/1.63.0/icons/` (`lucide-static@1.63.0`의 사용 서브셋)
- 라이선스: 같은 폴더의 상위 `LICENSE`. ISC와 Feather 유래 아이콘의 MIT 고지를 모두 보존한다. 프로젝트에 SVG를 복사할 때 이 파일도 함께 복사한다.

## 적용 기준

- 새 SLUR 화면의 일반 UI 아이콘은 Lucide를 기본으로 사용한다. 다른 세트와 임의로 혼용하거나 SVG 경로를 기억으로 그리지 않는다. 기존 디자인 유지나 토큰만 적용하는 작업에서는 아이콘을 일괄 교체하지 않는다.
- 필요한 공식 SVG만 프로젝트 내부에 복사한다. CDN, 아이콘 폰트, 전체 런타임 라이브러리는 기본으로 추가하지 않는다. 동봉 목록에 없으면 공식 원본과 버전을 확인해 추가한다.
- 인라인 SVG는 공식 경로와 `viewBox="0 0 24 24"`를 유지한다. `fill="none"`, `stroke="currentColor"`, 기본 `stroke-width="2"`, 둥근 선 끝과 이음을 사용한다. 원본의 고정 width/height는 제거하고 소유 컴포넌트 CSS에서 `1.125em` 등 문맥에 맞게 크기를 준다.
- `data-icon="search"`처럼 공식 이름을 출처 메타데이터로 남긴다. 상태·클릭 바인딩·스타일 선택자로 사용하지 않는다. 기존 `data-action`, ARIA, 네이티브 상태 계약을 유지한다.
- 텍스트 옆 또는 이름 있는 버튼 안의 SVG는 `aria-hidden="true" focusable="false"`. 아이콘만 있는 버튼은 기능을 설명하는 `aria-label`이 필수다. 상태는 색이나 아이콘만으로 전달하지 않는다.
- 의미가 필요한 동작·탐색·상태에만 넣는다. 제목·모든 메뉴에 장식용 아이콘을 자동으로 추가하지 않는다. 같은 기능은 같은 아이콘을 쓴다.
- SLUR 및 외부 서비스 로고는 별도 공식 브랜드 자산이다. 일반 아이콘으로 브랜드를 대체하지 않는다. 공식 로고가 없으면 서비스 이름을 텍스트로 표시한다.
- Starlight 문서 셸과 외부 위젯 내부 아이콘은 해당 제품이 관리한다. SLUR 소유 화면과 구분하며 라이브러리 내부를 직접 수정하지 않는다.

## 기능별 기본 매핑

| 기능 | Lucide 이름 |
|---|---|
| 검색 / 메뉴 / 닫기 | `search` / `menu` / `x` |
| 추가 / 수정 / 삭제 / 복사 | `plus` / `pencil-line` / `trash-2` / `copy` |
| 이전 / 다음 / 접기 / 펼치기 | `chevron-left` / `chevron-right` / `chevron-up` / `chevron-down` |
| 대시보드 / 고객 / 설정 | `layout-dashboard` / `user` 또는 `users` / `settings` |
| 문서 / 통계 / 알림 | `file-text` / `chart-line` / `bell` |
| 성공 / 정보 / 경고 / 오류 | `check` / `info` / `triangle-alert` / `circle-alert` |
| 날짜 / 시간 / 파일 업로드 | `calendar-days` / `clock` / `upload` |
| 라이트 / 다크 / 비밀번호 보기 | `sun` / `moon` / `eye` |

`assets/patterns/screens/`와 시스템 데모는 공식 원본을 인라인으로 포함한다. 저장소에서 `node scripts/check-icons.mjs`로 경로·표현 속성과 접근성 표기를 검사한다.
