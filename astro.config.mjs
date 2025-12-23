// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'SRR',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			customCss: [
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: "시작하기",
					items: [
						{ label: "개요", slug: "start/overview" },
						{ label: "설계 철학", slug: "start/philosophy" },
						{ label: "왜 SRR인가?", slug: "start/why" },
						{ label: "문서 읽는 방법", slug: "start/how-to-read" },
					],
				},
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
				// 		{ label: "What SRR Avoids", slug: "css/what-srr-avoids" },
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
