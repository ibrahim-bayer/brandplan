# Contributing to BrandPlan

Thank you for your interest in contributing to BrandPlan!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ibrahim-bayer/brandplan.git
   cd brandplan
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build all packages:
   ```bash
   pnpm build
   ```

4. Run tests:
   ```bash
   pnpm test
   ```

## Project Structure

- `packages/core` - Token schema validation and CSS generation
- `packages/ui` - React components (Button, Card)
- `packages/eslint-plugin` - ESLint rules for enforcement
- `packages/cli` - CLI for scaffolding and building
- `examples/next-app` - Example Next.js application

## Contribution Guidelines

### Pull Requests

- Keep changes focused and atomic
- Add tests for new features
- Update documentation when needed
- Follow existing code style
- Ensure all tests pass: `pnpm test`
- Ensure linting passes: `pnpm lint`

### Commit Messages

Use conventional commit format:
- `feat(core):` - New features
- `fix(ui):` - Bug fixes
- `docs:` - Documentation changes
- `test(eslint):` - Test additions/changes
- `chore:` - Maintenance tasks

### Testing

- All packages have test suites using Vitest
- Run tests for a specific package: `cd packages/core && pnpm test`
- Run tests in watch mode: `pnpm test:watch`

### Code Style

- TypeScript strict mode enabled
- ESLint configured for all packages
- Run `pnpm lint` before committing

## Questions?

Open an issue for questions or discussion before starting major work.
