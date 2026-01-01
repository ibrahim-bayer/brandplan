# Changelog

All notable changes to BrandPlan will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2025-01-01

### Fixed
- **deps**: Update pnpm-lock.yaml to match explicit version dependencies
- **deps**: Replace workspace dependencies with version numbers for proper publishing
- **core**: Include spacing variables in @theme block for Tailwind v4 compatibility

## [0.1.1] - 2024-12-XX

### Added
- **docs,eslint**: Clarify typography handling and add Node requirement documentation
- **all packages**: Add Node version requirement (>=20.9.0) to all packages
- **docs,eslint**: README improvements and ignorePaths hardening
- **eslint**: Add `ignorePaths` option for shadcn/ui compatibility

### Fixed
- **core**: Add `[data-theme="dark"]` hardening rule for explicit dark mode
- **example**: Correct theme toggle implementation and CLI import paths
- **example**: Add tailwindcss dependency and skip build in example app

## [0.1.0] - 2024-12-XX

### Added
- **cli**: Implement brandplan CLI with `init` and `build` commands
- **cli**: Add jiti-based config loading for better error handling
- **core**: Tailwind v4 @theme integration and dark variant support
- **core**: Implement token schema validation and CSS generator
- **ui**: Implement Button and Card components with strict brand tokens
- **eslint-plugin**: Add `brand-classnames-only` rule to enforce brand-prefixed utilities
- **eslint-plugin**: Add `brand-margin-policy` rule to restrict margin usage
- **examples**: Add Next.js App Router example application
- Initial project setup with MIT license

### Fixed
- **cli**: Replace dynamic import with jiti for better Node compatibility
- **core**: Harden length validation to reject whitespace-only values

### Changed
- Enforce brand-only utilities with ESLint enforcement
- Eliminate bp-* prefix drift in favor of brand-* prefix

## [0.0.1] - Initial Development

### Added
- Initial repository setup
- Project structure and monorepo configuration
- Claude instructions for development guidance

---

## Versioning Strategy

- **Major (1.0.0)**: Breaking API changes, major architectural changes
- **Minor (0.x.0)**: New features, non-breaking API additions
- **Patch (0.0.x)**: Bug fixes, documentation updates, minor improvements

## Upgrade Guides

For migration guides between major versions, see [UPGRADING.md](./UPGRADING.md) (coming soon).
