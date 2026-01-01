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

## Documentation

All public-facing documentation lives in `/docs`:
- `docs/migration-guide.md` - Guide for migrating from vanilla Tailwind
- `docs/api-reference.md` - Complete API documentation for all packages
- `docs/troubleshooting.md` - Common issues and solutions
- `docs/comparison.md` - BrandPlan vs alternatives (Tailwind, Chakra, shadcn/ui, etc.)

Additional documentation:
- `CHANGELOG.md` - Version history following [Keep a Changelog](https://keepachangelog.com/) format
- `README.md` - Main project README with quick comparison table
- `CONTRIBUTING.md` - Contribution guidelines (if exists)

**When updating docs:**
- Keep technical accuracy above all else
- Show code examples for every concept
- Include "before/after" comparisons where relevant
- Link between related docs
- Update README if adding new major features

## Version Management

### CHANGELOG.md

**MUST update CHANGELOG.md for every release.**

Follow this format:
```markdown
## [0.x.x] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Removed
- Removed features
```

**When to update:**
- Before publishing any package to NPM
- Group related changes under unreleased section during development
- Move to versioned section when releasing

### Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):
- **Major (1.0.0)**: Breaking API changes, major architectural changes
- **Minor (0.x.0)**: New features, non-breaking API additions
- **Patch (0.0.x)**: Bug fixes, documentation updates, minor improvements

**Pre-1.0 note:** We're currently 0.x.x, so minor version bumps can include breaking changes (document clearly).

### Version Bumps

When bumping versions:
1. Update `CHANGELOG.md` first
2. Update version in all affected `package.json` files
3. Run `pnpm -r build` to ensure everything builds
4. Commit with message: `chore: bump version to X.Y.Z`
5. Tag release: `git tag vX.Y.Z`
6. Publish: `pnpm -r publish` (or selective publish)

**Version consistency:** All packages currently use the same version (0.1.2). Maintain this for simplicity.

## NPM Publishing

### Keywords Strategy

Each package has targeted keywords for NPM search optimization:

**@brandplan/core** focuses on:
- tailwindcss, tailwind-v4, design-tokens, theme-generator, css-variables

**@brandplan/ui** focuses on:
- react-components, ui-components, design-system, component-library

**@brandplan/eslint-plugin** focuses on:
- eslint-plugin, brand-enforcement, code-quality, linter

**brandplan (CLI)** focuses on:
- cli, command-line, scaffolding, build-tool

**When adding packages:**
- Include 10-18 relevant keywords
- Always include: `brandplan`, `tailwindcss`, `design-tokens`
- Think about what developers search for
- Check competitors' keywords

### Package Metadata

Ensure every `package.json` has:
- Accurate description (concise, highlights unique value)
- Repository URL with directory
- Homepage URL
- Bugs URL
- License (MIT)
- Node version requirement (>=20.9.0)
- Proper exports and types

## Marketing & Growth

**IMPORTANT:** Marketing strategy is documented in `GROWTH_PLAN.md` (private, in .gitignore).

**When creating content:**
- Check GROWTH_PLAN.md for content calendar and strategy
- All blog posts, videos, and tutorials should solve real problems
- Show before/after code examples
- Always link to GitHub repo and docs
- Focus on Tailwind consistency pain points

**Content types:**
- Blog posts (dev.to, Hashnode, Medium)
- Videos (YouTube tutorials)
- Social media (Twitter/X threads)
- Conference talks
- Guest posts

**DO NOT:**
- Create promotional content in public repo
- Add marketing copy to technical docs
- Spam communities

**DO:**
- Be helpful first, promote second
- Share real solutions to real problems
- Build in public (share metrics, progress)

## Release Procedures

### Pre-Release Checklist

Before any NPM publish:
1. [ ] Update CHANGELOG.md with all changes
2. [ ] Bump version in package.json files (keep all packages in sync)
3. [ ] Run full build: `pnpm -r build`
4. [ ] Run all tests: `pnpm -r test`
5. [ ] Run linting: `pnpm -r lint`
6. [ ] Test CLI locally: `npx brandplan init` and `npx brandplan build`
7. [ ] Test example app still works
8. [ ] Update docs if API changed
9. [ ] Commit: `chore: bump version to X.Y.Z`
10. [ ] Tag: `git tag vX.Y.Z`
11. [ ] Push: `git push && git push --tags`
12. [ ] Publish: `pnpm -r publish` (or selective)
13. [ ] Announce on Twitter/X (if GROWTH_PLAN.md says so)

### Post-Release

- Monitor npm download stats
- Watch for GitHub issues
- Update GROWTH_PLAN.md metrics
- Consider blog post for major releases

## Common Tasks

### Adding a New Component to @brandplan/ui

1. Create component in `packages/ui/src/ComponentName.tsx`
2. Export from `packages/ui/src/index.ts`
3. Add tests in `packages/ui/src/ComponentName.test.tsx`
4. Update `packages/ui/README.md` (if exists)
5. Update main `README.md` if significant
6. Update `docs/api-reference.md` with component API
7. Add example usage to `examples/next-app`
8. Update CHANGELOG.md under "Unreleased" or next version

### Adding a New ESLint Rule

1. Create rule in `packages/eslint-plugin/src/rules/rule-name.ts`
2. Add tests in `packages/eslint-plugin/src/rules/rule-name.test.ts`
3. Export from `packages/eslint-plugin/src/index.ts`
4. Update README.md with rule documentation
5. Update `docs/api-reference.md` with rule details
6. Update CHANGELOG.md

### Adding a New Token Type to @brandplan/core

**Think twice.** MVP scope is: space, radius, color only.

If truly necessary:
1. Update `BrandPlanConfig` type in `packages/core/src/types.ts`
2. Add validation in `packages/core/src/schema.ts`
3. Update CSS generation in `packages/core/src/generate.ts`
4. Add tests
5. Update all documentation
6. Update example config
7. Update CHANGELOG.md
8. Consider if ESLint rules need updates

### Fixing a Bug

1. Reproduce the bug (write a failing test)
2. Fix minimally
3. Ensure test passes
4. Update CHANGELOG.md under "Fixed"
5. Use conventional commit: `fix(package): description`
6. If urgent, consider patch release

### Updating Dependencies

**Be conservative.** Only update when:
- Security vulnerability
- Bug fix we need
- New feature we want to use

**Process:**
1. Update `package.json`
2. Run `pnpm install`
3. Run full test suite
4. Test example app
5. Update CHANGELOG.md under "Changed" (if user-facing) or "Internal" (if dev-only)

## Testing Strategy

### Unit Tests (Required)

- All public functions in @brandplan/core
- All ESLint rules with multiple test cases
- All React components (basic rendering)

**Run:** `pnpm -r test`

### Integration Tests (Manual for now)

- CLI commands (`init`, `build`)
- Example app builds and runs
- ESLint catches violations correctly

### E2E Tests (Future)

Not yet implemented. Consider adding for:
- CLI workflows
- Full app integration
- ESLint in real projects

## CI/CD

GitHub Actions runs on every push:
- Lint all packages
- Test all packages
- Build all packages

**If CI fails:**
- Fix immediately
- Don't merge broken code
- Don't publish broken packages

## Examples Maintenance

`examples/next-app` MUST:
- Use latest BrandPlan packages
- Show all components (Button, Card)
- Demonstrate dark/light mode
- Use ESLint enforcement
- Build without errors
- Serve as documentation by example

**When updating:**
- Test that it builds: `cd examples/next-app && pnpm build`
- Test that it runs: `pnpm dev`
- Update if BrandPlan API changes

## File Organization

**Existing structure:**
```
/
├── packages/
│   ├── core/          # Token schema + CSS generator
│   ├── ui/            # React components
│   ├── eslint-plugin/ # ESLint rules
│   └── cli/           # CLI (brandplan command)
├── examples/
│   └── next-app/      # Example Next.js app
├── docs/              # Public documentation
│   ├── migration-guide.md
│   ├── api-reference.md
│   ├── troubleshooting.md
│   └── comparison.md
├── CHANGELOG.md       # Version history
├── GROWTH_PLAN.md     # Marketing strategy (private)
├── README.md          # Main documentation
├── CLAUDE.md          # This file (AI instructions)
└── CONTRIBUTING.md    # Contribution guide (if exists)
```

**DO NOT:**
- Create new top-level packages without discussion
- Add build artifacts to git
- Add node_modules to git
- Commit GROWTH_PLAN.md (it's in .gitignore)

## Git

- Conventional commits preferred:
  - feat(core): ...
  - feat(ui): ...
  - feat(eslint): ...
  - fix(...): ...
  - docs(...): ... (for documentation changes)
  - chore: ... (for version bumps, dependency updates)
- Keep PRs small and focused.
- Always update CHANGELOG.md before releasing
- Tag releases: `git tag vX.Y.Z`

## Support & Community

**When users report issues:**
1. Reproduce the issue
2. Check if it's in docs/troubleshooting.md
3. Fix or document workaround
4. Update troubleshooting docs
5. Consider if it reveals a docs gap

**When users request features:**
1. Check if it fits MVP scope (likely NO)
2. If post-MVP, add to GitHub issues
3. Link to GROWTH_PLAN.md vision (but don't share file)
4. Be polite but firm about scope

**Response templates in issues:**
- Thank them for the suggestion
- Explain MVP constraints
- Offer workarounds if available
- Link to relevant docs