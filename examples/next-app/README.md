# BrandPlan Next.js Example

Minimal Next.js App Router example demonstrating end-to-end BrandPlan integration.

## Features

- **Token generation**: Brand tokens defined in `brandplan.config.ts` and generated to `app/brandplan.css`
- **Tailwind v4 CSS-first**: Uses `@import "tailwindcss"` with `@theme` block
- **UI Components**: `Button` and `Card` from `@brandplan/ui` with all variants
- **Theme toggle**: Switch between dark (default) and light mode using `data-theme` attribute
- **ESLint enforcement**: BrandPlan rules catch violations at lint time

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the example.

## BrandPlan Integration

### 1. Token Definition

`brandplan.config.ts` defines:
- Space tokens: 2, 3, 4, 6, 8
- Radius tokens: sm, md, lg
- Colors: brand (primary/accent), surface (0/1), text (primary/secondary)

### 2. CSS Generation

Generated CSS is committed at `app/brandplan.css`. To regenerate:

```bash
pnpm brandplan:build
```

The CSS includes:
- `@theme` block mapping tokens to Tailwind utilities
- `:root` with dark defaults
- `[data-theme="light"]` overrides
- `@custom-variant dark` for data-theme support

### 3. CSS Imports

`app/layout.tsx` imports:
1. `@brandplan/ui/styles.css` - Brand utility classes
2. `./brandplan.css` - Generated theme tokens
3. `./globals.css` - Base styles

### 4. Components

All components use brand-only utilities:
- Spacing: `p-brand-*`, `gap-brand-*`
- Radius: `rounded-brand-*`
- Colors: `bg-brand-*`, `text-brand-*`, `border-brand-*`
- Margin: Only on semantic elements (`<main>`, `<header>`, `<footer>`)

### 5. ESLint Enforcement

Run linting:

```bash
pnpm lint
```

**Violations caught:**
- `app/_lint-demo.tsx` - Intentionally violates rules to demonstrate enforcement
- Non-brand utilities like `p-4`, `rounded-lg`, `bg-white`
- Margin on non-semantic elements

**Passing files:**
- All actual components use brand-only utilities
- Layout respects semantic margin policy

## Theme Toggle

The `ThemeToggle` component switches between:
- **Dark** (default): No `data-theme` attribute or `data-theme="dark"`
- **Light**: `data-theme="light"` on document element

Theme changes are applied instantly via CSS custom properties.

## File Structure

```
examples/next-app/
├── app/
│   ├── components/
│   │   └── ThemeToggle.tsx       # Client-side theme switcher
│   ├── _lint-demo.tsx             # Intentional violations for demo
│   ├── brandplan.css              # Generated theme CSS (committed)
│   ├── globals.css                # Base styles
│   ├── layout.tsx                 # Root layout with CSS imports
│   └── page.tsx                   # Homepage with examples
├── brandplan.config.ts            # Token definition + generator
├── eslint.config.mjs              # ESLint with BrandPlan rules
├── next.config.ts                 # Next.js config
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript config
```

## What This Proves

1. ✅ BrandPlan tokens work with Tailwind v4
2. ✅ UI components render correctly in Next.js
3. ✅ Theme toggle works with `data-theme` attribute
4. ✅ ESLint catches violations at build time
5. ✅ System prevents visual drift through enforcement
6. ✅ All styling uses brand-* utilities only

## Learn More

- [BrandPlan Core](../../packages/core/README.md)
- [BrandPlan UI](../../packages/ui/README.md)
- [BrandPlan ESLint Plugin](../../packages/eslint-plugin/README.md)
