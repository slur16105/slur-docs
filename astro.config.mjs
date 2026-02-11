// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
const GA_ID = 'G-GHY00755Y6';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'UI Architecture',
			logo: {
				/* Use relative importable paths so Starlight can import/validate them */
				light: './src/assets/logo_black.svg',
				dark: './src/assets/logo_white.svg',
				alt: 'SLUR logo',
				replacesTitle: false,
			},
			// social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			customCss: [
				'./src/styles/custom.css',
			],
			components: {
				Footer: './src/components/Footer.astro',
			},
			head: [
				{
					tag: 'script',
					attrs: {
						async: true,
						src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
					},
				},
				{
					tag: 'script',
					content: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${GA_ID}', {
							anonymize_ip: true
						});
					`,
				},
			],
			sidebar: [
				{
					label: "시작하기",
					items: [
						{ label: "개요", slug: "start/overview" },
						{ label: "설계 철학", slug: "start/philosophy" },
						{ label: "왜 SLUR UI System인가?", slug: "start/why" },
						{ label: "문서 읽는 방법", slug: "start/how-to-read" },
					],
				},
				{
					label: "핵심 개념",
					items: [
						{ label: "UI 구조 모델", slug: "core/structure-model" },
						{ label: "네이밍 시스템", slug: "core/naming-system" },
						{ label: "결과 기반 CSS", slug: "core/result-based-css" },
						{ label: "역할 분리 원칙", slug: "core/separation-of-concerns" },
					],
				},
				{
					label: "CSS 방법론",
					items: [
						{ label: "블록 규칙", slug: "css/block" },
						{ label: "내부 요소 (i_)", slug: "css/internal-elements" },
						{ label: "수정자 (m_)", slug: "css/modifiers" },
						{ label: "중첩 구조 규칙", slug: "css/nested-structure" },
						{ label: "한 줄 CSS 규칙", slug: "css/one-line-rule" },
						{ label: "토큰 및 변수 전략", slug: "css/tokens" },
						{ label: "SLUR UI System에서 지양하는 패턴", slug: "css/what-srr-avoids" },
					],
				},
				{
					label: "JavaScript 및 상태 관리",
					items: [
						{ label: "데이터 속성 전략", slug: "js/data-attributes" },
						{ label: "상태 기반 UI", slug: "js/state-driven-ui" },
						{ label: "JavaScript 책임 범위", slug: "js/js-boundary" },
						{ label: "외부 라이브러리 연동", slug: "js/external-libraries" },
					],
				},
				{
					label: "접근성",
					items: [
						{ label: "접근성 설계 철학", slug: "a11y/philosophy" },
						{ label: "대체 텍스트 규칙", slug: "a11y/alt-rules" },
						{ label: "ARIA 최소 사용 원칙", slug: "a11y/aria-policy" },
						{ label: "가상 요소 사용 규칙", slug: "a11y/pseudo-elements" },
						{ label: "키보드 내비게이션", slug: "a11y/keyboard" },
					],
				},
				{
					label: "미디어 및 성능",
					items: [
						{ label: "이미지 역할 정의", slug: "media/image-role" },
						{ label: "이미지 포맷 전략", slug: "media/image-format" },
						{ label: "반응형 이미지", slug: "media/responsive-images" },
						{ label: "지연 로딩 전략", slug: "media/lazy-loading" },
						{ label: "LCP 최적화", slug: "media/lcp" },
					],
				},
				{
					label: "패턴",
					items: [
						{ label: "레이아웃 패턴", slug: "patterns/layout" },
						{ label: "페이지 구조 패턴", slug: "patterns/page" },
						{ label: "컴포넌트 패턴", slug: "patterns/component" },
						{ label: "팝업 / 모달 패턴", slug: "patterns/popup-modal" },
						{ label: "폼 및 테이블 패턴", slug: "patterns/form-table" },
					],
				},
				{
					label: "참고",
					items: [
						{ label: "접두사 참조 표", slug: "reference/prefix-table" },
						{ label: "클래스 네이밍 예제", slug: "reference/naming-examples" },
						{ label: "권장 / 비권장 사례", slug: "reference/do-dont" },
						{ label: "체크리스트", slug: "reference/checklist" },
						{ label: "자주 묻는 질문", slug: "reference/faq" },
					],
				},
				{
					label: "변경 이력",
					items: [
						{ label: "버전 히스토리", slug: "changelog/version-history" },
					],
				},
				// {
				//   label: "Start Here",
				//   items: [
				//     { label: "SLUR UI System Overview", slug: "start/overview" },
				//     { label: "Philosophy", slug: "start/philosophy" },
				//     { label: "Why SLUR UI System", slug: "start/why" },
				//     { label: "How to Read This Documentation", slug: "start/how-to-read" },
				//   ],
				// },
				// {
				// 	label: "Core Concepts",
				// 	items: [
				// 		{ label: "UI Structure Model", slug: "core/structure-model" },
				// 		{ label: "Naming System", slug: "core/naming-system" },
				// 		{ label: "Result-based CSS", slug: "core/result-based-css" },
				// 		{ label: "Separation of Concerns", slug: "core/separation-of-concerns" },
				// 	],
				// },
				// {
				// 	label: "CSS Methodology",
				// 	items: [
				// 		{ label: "Block Rules", slug: "css/block" },
				// 		{ label: "Internal Elements (i_)", slug: "css/internal-elements" },
				// 		{ label: "Modifiers (m_)", slug: "css/modifiers" },
				// 		{ label: "Nested Structure Rules", slug: "css/nested-structure" },
				// 		{ label: "One-line CSS Rule", slug: "css/one-line-rule" },
				// 		{ label: "Token & Variable Strategy", slug: "css/tokens" },
				// 		{ label: "What SLUR UI System Avoids", slug: "css/what-srr-avoids" },
				// 	],
				// },
				// {
				// 	label: "JavaScript & State",
				// 	items: [
				// 		{ label: "Data Attribute Strategy", slug: "js/data-attributes" },
				// 		{ label: "State-driven UI", slug: "js/state-driven-ui" },
				// 		{ label: "JS Responsibility Boundary", slug: "js/js-boundary" },
				// 		{ label: "External Library Integration", slug: "js/external-libraries" },
				// 	],
				// },
				// {
				// 	label: "Accessibility",
				// 	items: [
				// 		{ label: "Accessibility Philosophy", slug: "a11y/philosophy" },
				// 		{ label: "Alt Text Rules", slug: "a11y/alt-rules" },
				// 		{ label: "ARIA Minimal Policy", slug: "a11y/aria-policy" },
				// 		{ label: "Pseudo Elements Rule", slug: "a11y/pseudo-elements" },
				// 		{ label: "Keyboard Navigation", slug: "a11y/keyboard" },
				// 	],
				// },
				// {
				// 	label: "Media & Performance",
				// 	items: [
				// 		{ label: "Image Role Definition", slug: "media/image-role" },
				// 		{ label: "Image Format Strategy", slug: "media/image-format" },
				// 		{ label: "Responsive Images", slug: "media/responsive-images" },
				// 		{ label: "Lazy-loading Strategy", slug: "media/lazy-loading" },
				// 		{ label: "LCP Optimization", slug: "media/lcp" },
				// 	],
				// },
				// {
				// 	label: "Patterns",
				// 	items: [
				// 		{ label: "Layout Patterns", slug: "patterns/layout" },
				// 		{ label: "Page Structure Patterns", slug: "patterns/page" },
				// 		{ label: "Component Patterns", slug: "patterns/component" },
				// 		{ label: "Popup / Modal Patterns", slug: "patterns/popup-modal" },
				// 		{ label: "Form & Table Patterns", slug: "patterns/form-table" },
				// 	],
				// },
				// {
				// 	label: "Reference",
				// 	items: [
				// 		{ label: "Prefix Reference Table", slug: "reference/prefix-table" },
				// 		{ label: "Class Naming Examples", slug: "reference/naming-examples" },
				// 		{ label: "Do & Don’t", slug: "reference/do-dont" },
				// 		{ label: "Checklist", slug: "reference/checklist" },
				// 		{ label: "FAQ", slug: "reference/faq" },
				// 	],
				// },
				// {
				// 	label: "Changelog",
				// 	items: [
				// 		{ label: "Version History", slug: "changelog/version-history" },
				// 	],
				// },
			],
		}),
	],
});
