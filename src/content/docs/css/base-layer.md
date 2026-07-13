---
title: 공통 베이스 레이어
description: 컴포넌트보다 먼저 작성하는 공통 스타일(base) 레이어의 기준과 폼 컨트롤 상속 전략을 설명합니다.
---

"공통 스타일을 우선 작성한다"는 원칙은  
**base 레이어를 컴포넌트보다 먼저 만든다**는 뜻입니다.

시스템의 기본값은 base가 담당하고,  
컴포넌트 CSS에는 기본값과 **다른 값(변형)만** 남깁니다.

---

## base 레이어의 역할

base 레이어는 다음을 담당합니다.

- 본문 타이포그래피의 기준값 (글꼴, 크기, 행간, 색)
- 폼 컨트롤의 상속 개방과 기본 타이포
- 포커스 스타일의 단일 선언

컴포넌트가 이 값들을 반복 선언하면  
수정 지점이 흩어지고 드리프트가 생깁니다.

---

## 폼 컨트롤 상속

`input` · `textarea` · `select` · `button`은  
브라우저 UA 스타일 때문에 **body에서 font와 color를 상속받지 않습니다.**

태그 레벨에서 `inherit`를 선언해 상속을 엽니다.  
이후 글꼴과 글자색은 body 한곳에서 관리됩니다.

```css
body { margin: 0; font-family: var(--font_sans); font-size: var(--text_base); color: var(--color_text); }
input, textarea, select, button { font-family: inherit; line-height: inherit; color: inherit; }
```

크기가 본문과 다른 값이 시스템 규칙이라면  
(예: 본문 16px / 컨트롤 14px)  
상속 대신 base의 태그 레벨에 명시합니다.

```css
input, textarea, select, button { font-size: var(--text_sm); }
button { font-weight: var(--weight_medium); line-height: 1; }
```

---

## 포커스 스타일

`outline: none`은 **반드시 대체 포커스 링과 한 쌍**으로 사용합니다.  
base에서 한 번만 선언하고, 컴포넌트마다 반복하지 않습니다.

```css
input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible { outline: none; box-shadow: var(--color_focus_ring); }
```

대체 링 없이 outline만 제거하는 것은  
접근성을 해치므로 허용하지 않습니다.

---

## 컴포넌트에는 변형만

base가 기본값을 담당하면  
컴포넌트 선언은 짧아지고 의도가 드러납니다.

```css
/* 이렇게 — 변형만 남긴다 */
.btn { display: inline-flex; height: 40px; padding: 0 18px; border: 1px solid var(--color_border); border-radius: var(--radius_md); background: var(--color_surface); cursor: pointer; }
.btn.m_large { height: 48px; padding: 0 24px; font-size: var(--text_base); }

/* 이렇게 하지 않는다 — base가 담당하는 값을 반복 */
.btn { font-family: var(--font_sans); color: var(--color_text); outline: none; }
```

컴포넌트에서 font-family, 기본 글자색, outline 제거를  
다시 선언하고 있다면 base 레이어 부재의 신호입니다.
