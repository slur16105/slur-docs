# SLUR UX/UI System

[![Docs](https://img.shields.io/badge/docs-docs.slur.co.kr-blue)](https://docs.slur.co.kr)
![Status](https://img.shields.io/badge/status-active-success)
![Methodology](https://img.shields.io/badge/type-UX%2FUI%20Methodology-informational)

**SLUR UX/UI System** is a front-end UX/UI methodology for designing UI that stays
maintainable long after it is first built. It keeps a single, consistent standard
across the whole surface — **structure, state, accessibility, performance, and experience** —
so that class names alone reveal structure and intent, without depending on any framework.

This repository contains the **official documentation** for the system, published at
[docs.slur.co.kr](https://docs.slur.co.kr).

---

## Why SLUR UX/UI System?

In many UI projects, the same problems keep repeating:

- Inconsistent class naming across team members
- Style changes unintentionally affecting structure
- Miscommunication between designers and developers
- Poor maintainability as the project grows

SLUR treats UI not as a visual result, but as a **structured, readable system** — and
extends that discipline beyond markup into state, accessibility, media, and user experience.

---

## Core Principles

- **Structure first** — class names reveal structure and role; UI is treated as a stable structure, not a pile of styles.
- **Separation of concerns** — HTML for structure, CSS for presentation, JavaScript for behavior, and `data-state` for state.
- **Consistent rules** — anyone writing code produces the same structure. Consistency creates productivity.
- **Completeness** — not just the normal state, but loading/error states, accessibility, and performance are designed in from the start.

---

## What It Covers

The system goes beyond structural design and connects everything under one standard:

- **Structure & Naming** — block / internal-element hierarchy and the prefix system
- **State & Script** — `data-state`-driven state design, CSS/JS responsibility boundaries
- **Accessibility** — semantics first, minimal ARIA, keyboard access
- **Media & Performance** — image roles, responsive images, loading performance
- **Experience (UX)** — screen states, feedback, motion, form-input experience
- **Reference** — prefix table, naming examples, checklist, FAQ

---

## Documentation Overview

The documentation is organized as follows (see the sidebar at [docs.slur.co.kr](https://docs.slur.co.kr)):

- **Start Here** — overview, philosophy, why the system exists, how to read the docs
- **Core Concepts** — UI structure model, naming system, separation of concerns
- **CSS Methodology** — block rules, internal elements (`i_`), modifiers (`m_`), nesting, one-line rule, tokens, anti-patterns, pseudo-elements
- **JavaScript & State** — state-driven UI, external library integration
- **Accessibility** — philosophy, alt text, ARIA policy, keyboard navigation
- **Media & Performance** — image role, image handling, loading performance
- **Patterns** — structure hierarchy, popup/modal, form & table
- **Experience (UX)** — screen states, feedback, motion, form UX
- **Design System** — design tokens, components, app/auth shells & eight screen blueprints (viewable on the site), AI quickstart (skill installer at `docs.slur.co.kr/skill/install.sh` → unpacks `slur-skills.tar.gz`)
- **Reference** — prefix table, naming examples, do & don't, checklist, FAQ
- **Changelog** — version history

---

## How to Use

1. New to SLUR UX/UI System → start with the **Start Here** section.
2. Applying it in practice → use **Reference** and the relevant methodology sections as a working guide.
3. SLUR UX/UI System is **not a framework** → it is not tied to any library, build tool, or stack (HTML/CSS, Astro, React, Vue, or static markup).

---

## About This Repository

The published site is built with **Astro + Starlight**. Common commands:

```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the built site
```

Content lives in `src/content/docs/`. This repository is the **documentation** for the
methodology, not a code library.

The two AI skills (`skill/slur-guidelines`, `skill/slur-design`) and `system/demo.html` are copied into
`public/` at the start of every dev/build by `scripts/sync-assets.mjs` (wired as an Astro integration hook in
`astro.config.mjs`), so the site serves them at the same paths (`/skill/...`, `/system/demo.html`), and bundles the two skill folders
into `public/skill/slur-skills.tar.gz` for `install.sh` (a tarball, because Cloudflare's email obfuscation rewrites
individually served HTML). The copies are gitignored — edit the originals only.

---

## License

This documentation is available for personal learning and reference.
Guidelines for commercial use or redistribution may be defined later.

---

📘 이 문서를 [한국어](./README_KR.md)로 읽기
