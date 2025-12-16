# BrandPlan (Claude Code Instructions)

This file provides persistent guidance to Claude Code when working in this repository.

## Project Summary

BrandPlan is a strict branding layer on top of Tailwind CSS v4.
Goal: eliminate visual drift by enforcing brand tokens and brand-prefixed utilities for design-critical styling.

Core principles:
- All design tokens MUST be --brand-* CSS variables.
- Dark mode is the default on :root.
- Light mode is an override via [data-theme="light"].
- Brand-critical styling (spacing, radius, color, shadow, typography) MUST NOT use non-brand Tailwind utilities or arbitrary values.
- MVP targets React only (UI package). Enforcement via ESLint plugin.

## Monorepo Layout

Expected structure:
- packages/core: token schema + CSS output generator (Tailwind v4 compatible)
- packages/ui: React components (Button, Card) that ONLY use brand tokens
- packages/eslint-plugin: rules enforcing brand-only classes and prohibiting escapes
- examples/next-app: minimal demo (later; not required for core MVP)

## Tech Stack

- TypeScript everywhere
- Tailwind CSS v4 (CSS-first)
- pnpm preferred for workspace management

## MVP Scope (Do Not Expand)

MVP deliverables:
1) @brandplan/core: defineBrandPlan() + CSS output for tokens (dark default, light override)
2) @brandplan/ui: Button + Card (no Box/Grid/Container abstractions)
3) @brandplan/eslint-plugin: enforce brand-only for:
   - spacing (p-*, m-*, gap-*, space-*)
   - radius (rounded-*)
   - colors (bg-*, text-*, border-*, ring-*)
   - shadows (shadow-*)
   - forbid arbitrary values: *-[...]
   - forbid inline styles for margin/padding/background/color/radius/shadow on React nodes
4) Margin policy:
   - MVP: ban margin everywhere OR
   - allow margin ONLY on semantic layout tags: main/header/footer AND only brand-prefixed forms (m-brand-*)

If a task isn't in this list, it's not MVP.

## Coding Standards

- Keep public APIs small and stable.
- No "magic" global side effects; explicit exports.
- Add runtime validation where it improves error messages (but keep it lightweight).
- Avoid external dependencies unless truly necessary.

## Dev Workflow (Strict)

For any change:
1) Plan first: list files and expected outcomes.
2) Implement minimal diff.
3) Run:
   - pnpm -r lint
   - pnpm -r test
   - pnpm -r build
4) Summarize:
   - what changed
   - why
   - any follow-ups or TODOs

## Git

- Conventional commits preferred:
  - feat(core): ...
  - feat(ui): ...
  - feat(eslint): ...
  - fix(...): ...
- Keep PRs small and focused.