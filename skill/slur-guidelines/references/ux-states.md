# UX 상태 · 피드백 규칙

## 화면 상태 (4상태 설계)

- 모든 화면은 **빈 / 로딩 / 에러 / 정상** 4상태를 설계한다. 정상만 만들면 나머지 순간은 방치된다.
- 정상 상태를 만들기 전에 **어떤 상태가 존재하는지 먼저 정의**한다.
- 상태는 클래스 조합이 아니라 `data-state` 값으로 표현한다. 구조는 그대로 두고 상태만 전환한다.
- CSS가 `data-state`를 해석해 해당 영역만 노출한다.

```html
<section class="list_program" data-state="loading">
  <div class="i_loading">불러오는 중…</div>
  <div class="i_empty">등록된 프로그램이 없습니다.</div>
  <div class="i_error">불러오지 못했습니다. 다시 시도해 주세요.</div>
  <ul class="i_body"><!-- 정상 상태 목록 --></ul>
</section>
```

- 로딩 없음 → 멈춘 화면 / 빈 상태 없음 → 실패로 오해 / 에러 없음 → 다음 행동 불명.

## 피드백 방식 선택

기준: **흐름을 멈춰야 하는가.**

- **인라인** — 특정 요소에 대한 반응. 그 위치에 표시. (입력 오류, 유효성 결과)
- **토스트** — 흐름을 안 끊는 짧은 알림. 잠시 뒤 사라짐. (저장 완료, 복사됨)
- **모달** — 확인·결정이 필요해 흐름을 멈추는 반응. (삭제 확인, 중요한 경고) → 구조는 팝업/모달 패턴.

반응은 행동 직후 즉시, 상황 중요도에 맞는 무게로 전달한다.

### 토스트

`toast_message` 컴포넌트, 노출은 `data-state`로 제어. 닫기는 모달과 스타일이 달라 `i_close`.

알림 강도는 둘뿐이다 — 기본은 `role="status"`(조용히 읽힘, 자동 소멸 허용), 끼어들어야 하는 실패·세션 만료만 `role="alert"`(즉시 읽힘, 자동 소멸 금지). 알림은 포커스를 옮기지 않고, 컨테이너는 미리 DOM에 있어야 읽힌다 (`accessibility.md` 5-C).

```html
<div class="toast_message" data-state="show" role="status">
  <p class="i_text">저장되었습니다.</p>
  <button class="i_close" type="button" aria-label="닫기"></button>
</div>
```

### 인라인 오류

입력 요소 옆 `i_error`, 오류 상태는 클래스 아닌 `data-state="error"`.

```html
<div class="form_group" data-state="error">
  <label for="user_email">이메일</label>
  <input type="email" id="user_email" class="input_text" aria-describedby="user_email_error">
  <p class="i_error" id="user_email_error">올바른 이메일 형식이 아닙니다.</p>
</div>
```

## 파괴적 행동 확인

- 삭제·초기화·전송처럼 되돌릴 수 없는 행동은 즉시 실행하지 말고 **확인을 요구**한다.
- 확인 문구는 결과를 분명히 밝히고, 실행 버튼과 취소 버튼의 역할을 명확히 구분한다.
- 확인창은 **바깥 클릭으로 닫지 않고**(실수 방지, Esc는 취소로 허용), 초기 포커스는 덜 파괴적인 버튼(취소)에 둔다.
- 확인창 구조는 팝업/모달 패턴을 따른다.

## 즉각성

- 처리에 시간이 걸리면 로딩 상태로 진행 중임을 알린다.
- 결과가 나오면 성공/실패를 분명히 표현하고, 상태 변화는 `data-state`로 표현한다.
- 반응이 지연되면 사용자는 같은 행동을 반복하거나 실패로 오해한다.
