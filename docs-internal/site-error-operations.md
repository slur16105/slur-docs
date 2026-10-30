# 문서 사이트 500 · 점검 화면 운영

확인일: 2026.10.30 (한국 시간)

## 현재 상태와 파일

사이트: https://docs.slur.co.kr · Astro 정적 출력 · Cloudflare Pages Git 연동(main push).

| 상황 | 저작 원본 | 빌드 출력 | 공개 확인 주소 | 현재 응답 |
|---|---|---|---|---|
| 404 | src/content/docs/404.md | dist/404.html | 존재하지 않는 주소 | 자동 404 |
| 500 | src/content/docs/500.md | dist/500.html | /500 | 화면 확인용 정적 200 |
| 점검 | src/content/docs/maintenance.md | dist/maintenance/index.html | /maintenance/ | 화면 확인용 정적 200 |

Astro는 500 문서를 `/500.html`로 생성하며 Cloudflare Pages는 HTML 확장자를 제거한 `/500`으로 정규화한다. 로컬 정적 확인에는 `/500.html`을 사용한다.

500/점검 화면 배포는 장애 자동 처리·점검 모드 활성화가 아니다. 현재 서버 실행·Pages Functions·Worker·전체 URL 리디렉션은 추가하지 않았다. 콘텐츠용 `<meta name="robots" content="noindex">`와 pagefind:false·sidebar.hidden·prev/next:false를 적용한다.

## 확인된 적용 범위

- Pages는 `404.html`을 자동으로 연결한다. `500.html` 또는 `/500`을 만드는 것만으로 500 응답을 교체하는 규약은 없다.
- Cloudflare의 **Error Pages**는 500·501·503·505 응답에는 적용되지 않는다. 별도 **Custom Error Rules**의 지원 범위·계정 플랜·권한과 대상 응답을 확인해야 한다. 해당 계정의 실제 유료 기능 사용 가능 여부는 이번 작업에서 확인하지 않았다.
- Pages Functions의 루트 `_middleware.js`는 정적 파일 앞에서도 실행할 수 있다. 이를 도입하면 현재 정적 요청 경로·운영 방식이 바뀌므로 대상 경로·한도·실패 시 동작을 검토하고 사전 환경에서 검증한다.
- Cloudflare가 애플리케이션 코드 실행 전에 반환하는 장애, DNS·TLS·전체 플랫폼 장애, 브라우저가 연결하지 못하는 상황은 사이트 내 화면으로 항상 바꿀 수 없다.
- 빌드 실패는 방문자의 런타임 500과 다르다. 실패한 빌드는 CI/배포 로그로 진단하고 기존 정상 배포를 유지한다.

## 실제 500 연결 시

1. 계정에서 사용할 수 있는 Custom Error Rules 또는 Pages Functions/Worker 응답 처리 중 하나를 선택한다. 설정 변경 전 현재 배포·설정 복구 지점을 기록한다.
2. 실제 실패한 **HTML 문서 GET/HEAD**에 한정한다. API/JSON·자산 응답을 HTML 오류 화면으로 바꾸지 않는다. `Accept: */*`만으로 문서 요청이라고 단정하지 않는다.
3. 원래 요청 주소를 유지하고 500 응답의 본문으로 빌드된 500 화면을 제공한다. `/500`으로 302 이동하거나 200으로 덮어쓰지 않는다. 예외 원문·스택·토큰을 본문에 노출하지 않는다.
4. 화면 자체를 불러오는 요청과 `/_astro/`·브랜드·기본 자산을 처리 대상에서 제외해 재귀 오류를 막는다. 화면은 미리 배포된 정적 자산에서 가져오고, 자산마저 실패하면 최소 제목·설명·홈 링크가 있는 내장 HTML로 끝낸다.
5. 오류 응답은 `Cache-Control: no-store`, `X-Robots-Tag: noindex`를 사용하고 실제 상태와 UTF-8 HTML Content-Type을 유지한다. HEAD 응답에는 본문을 보내지 않는다.
6. 문서 홈 링크는 안전한 조회 재시도다. 고장 난 원래 경로를 확인 없이 자동 반복하거나 임의 `returnTo`를 이동 주소로 사용하지 않는다.

## 점검 전환·해제 시

- 준비된 `/maintenance/`를 방문하는 것만으로 운영 사이트는 점검 상태가 되지 않는다.
- 전환은 사용자 승인한 실제 점검 시간에 수행한다. 날짜·시간대와 복구 예상 시간이 확인된 경우에만 화면 문구를 갱신한다.
- 응답 처리 계층에서 점검 대상 HTML 문서 요청의 원래 주소에 **503**과 점검 본문을 반환한다. 단순 전체 리디렉션/200 rewrite로 점검을 흉내 내지 않는다.
- 장애/점검 화면과 그 필수 자산·외부 SLUR 홈페이지를 접근 가능하게 유지한다. API·다운로드 등 비문서 요청 정책은 별도로 정의한다.
- 복구 시점을 알 때만 `Retry-After`를 설정한다. 불명확하면 임의 초 단위나 시간을 약속하지 않는다. 503은 `Cache-Control: no-store`로 남지 않게 한다.
- 해제는 점검 응답 조건을 제거하고 같은 루트·하위 경로를 다시 요청해 정상 200과 본문이 돌아오는지 확인한다. 점검 화면이 남은 캐시가 있다면 해당 캐시만 처리한다.
- 플랫폼 전체에 장애가 있으면 새 배포를 할 수 없을 수 있다. 점검 시작 전에 정적 화면과 필요한 응답 처리를 배포·검증한다.

## 검증 체크리스트

### 이번 화면 준비

- [x] 전체 빌드와 기존 검사 통과
- [x] 500·점검에 title/h1/main 각 하나, 상황 설명·홈 링크·외부 SLUR 링크 존재
- [x] noindex·검색 색인 제외·이전/다음 문서 링크 제외
- [x] 320/390/768/1440px·200% 글자 확대·라이트/다크에서 안내·행동 확인
- [x] JavaScript 없이 키보드 홈 이동·외부 링크 사용 가능
- [ ] 배포 후 안내 페이지 직접 진입 200·정상 홈 200·없는 주소 404 유지 확인

### 실제 응답 연결 후 별도 확인

- [ ] 사전 환경에서 문서 실패를 주입해 원래 URL·500·오류 본문 확인
- [ ] API/자산/HEAD 응답 계약 및 재귀 처리 제외 확인
- [ ] 화면 자산 조회 실패 시 최소 HTML 대체 확인
- [ ] 점검 켜기 → 원래 URL·503 → 점검 끄기 → 정상 200 확인
- [ ] no-store·noindex, 확인된 Retry-After만 제공
- [ ] 정상 홈·없는 하위 URL·외부 직접 진입 및 JS/폰트 미로드 확인
- [ ] 운영에서 실제 장애를 유발하지 않고 설정·배포 기록으로 적용 범위 확인

## 로컬 검증 기록

- 전체 빌드·기존 CSS/아이콘/대비/테마/격리 검사 통과.
- Chromium에서 500·점검 화면의 네 화면 폭, 320px 글자 200% 확대·라이트/다크 가로 넘침 없음 확인.
- 각 화면 title/h1/main·noindex·pagefind 제외·이전/다음 탐색 제외 확인.
- JavaScript와 외부 폰트·SVG를 차단한 상태에서 키보드로 홈 이동 확인.
- Safari·실기기와 실제 500/503 응답 연결은 미검증. 이번 변경은 정적 화면·운영 절차 준비에 한정한다.

## 근거

- https://developers.cloudflare.com/pages/configuration/serving-pages/#not-found-behavior
- https://developers.cloudflare.com/rules/custom-errors/ (Error Pages와 Custom Error Rules 구분)
- https://developers.cloudflare.com/pages/functions/middleware/ (정적 파일 앞 루트 미들웨어)
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/503
