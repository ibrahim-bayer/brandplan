# BrandPlan

[![CI](https://github.com/ibrahim-bayer/brandplan/actions/workflows/ci.yml/badge.svg)](https://github.com/ibrahim-bayer/brandplan/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/brandplan.svg)](https://www.npmjs.com/package/brandplan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

BrandPlan is a strict branding layer on top of Tailwind that replaces freedom with consistency.

## Why BrandPlan exists

Tailwind gives you freedom. That freedom causes brand inconsistency.

BrandPlan turns your brand tokens into an enforceable system. It is NOT a UI kit, NOT a replacement for Tailwind, and NOT a design system. It is a token engine with ESLint enforcement.

What it does:

- Validates brand tokens (space, radius, color with dark/light variants)
- Generates Tailwind v4-compatible CSS from your tokens
- Enforces brand-prefixed utilities via ESLint rules
- Optionally provides minimal UI primitives (Button, Card)

## What is BrandPlan?

BrandPlan eliminates visual drift by enforcing brand tokens through technical constraints:

- **One prefix system**: All design-critical utilities use `brand-*` prefix
- **Hard enforcement**: ESLint catches violations at build time
- **Dark-first theming**: `:root` contains dark values, `[data-theme="light"]` overrides
- **Semantic margin policy**: Margins restricted to layout elements
- **Tailwind v4 compatible**: Uses CSS-first `@theme` block

## What's Enforced

BrandPlan **requires** brand-prefixed utilities for these design-critical properties:

- **Spacing**: `p-brand-*`, `m-brand-*`, `gap-brand-*`, `space-brand-*`
- **Radius**: `rounded-brand-*`
- **Colors**: `bg-brand-*`, `text-brand-*`, `border-brand-*`, `ring-brand-*`
- **Shadows**: `shadow-brand-*`

## What's Forbidden

- Arbitrary values: `p-[12px]`, `bg-[#ff0000]`
- Non-brand utilities for design properties: `p-4`, `bg-blue-500`, `rounded-lg`
- Inline styles for margin, padding, color, radius, shadow
- Margins on non-layout elements (unless using `m-brand-*`)

**Utilities NOT affected** (use Tailwind freely):

- Layout: `flex`, `grid`, `block`, `hidden`, `w-*`, `h-*`, etc.
- Typography: `font-*`, `text-sm`, `leading-*`, etc.
- Effects: `opacity-*`, `blur-*`, `transition-*`, etc.

## Problems BrandPlan solves

**Problem:** Inconsistent spacing, radius, and colors across components.

**Solution:** Single brand token source + ESLint enforcement. Violations caught at build time.

**Problem:** Developers use arbitrary values (`p-[12px]`) or non-brand utilities (`bg-blue-500`).

**Solution:** ESLint rules block non-brand design utilities. Only `brand-*` prefixed or layout utilities allowed.

**Problem:** Design tokens exist but aren't enforced.

**Solution:** BrandPlan validates tokens at build time and enforces usage via ESLint. No escape hatch.

**Problem:** Tailwind config alone doesn't prevent inconsistency.

**Solution:** Tailwind config is permissive. BrandPlan restricts what developers can use through ESLint rules.

## Common questions

**Is this a UI component library?**

No. BrandPlan provides optional minimal UI primitives (Button, Card). The core is a token engine + ESLint enforcement. Use it with shadcn/ui or your own components.

**Why not just use Tailwind config?**

Tailwind config defines tokens but doesn't enforce their use. Developers can still use `p-4` or `bg-blue-500`. BrandPlan blocks non-brand utilities via ESLint.

**How is this different from design tokens?**

BrandPlan IS a design token system, but with enforcement. Tokens are validated, mapped to Tailwind v4 `@theme` variables, and enforced via ESLint. You can't bypass them.

**Does this replace shadcn/ui?**

No. BrandPlan works WITH shadcn/ui. Use `ignorePaths` to exclude `components/ui/**` from enforcement. Your custom components use brand tokens, shadcn components use standard Tailwind.

**Can I use this in an existing project?**

Yes, but it requires migration. All design-critical utilities (`p-*`, `m-*`, `bg-*`, `rounded-*`, etc.) must be replaced with `brand-*` versions. Use `ignorePaths` to exclude vendor code during migration.

**What happens if a developer uses non-brand classes?**

ESLint fails. CI fails. The build is blocked. No escape hatch unless you disable the rules or use `ignorePaths`.

**Is this opinionated?**

Yes. BrandPlan enforces:

- `brand-*` prefix for all design-critical utilities
- Margins only on semantic layout elements (`main`, `header`, `footer`)
- Dark-first theming with explicit `data-theme` attribute
- No arbitrary values, no inline styles for design properties

If you want freedom, use Tailwind directly.

## Quick Start

### 1. Install BrandPlan

```bash
npm install @brandplan/core @brandplan/ui brandplan
# or
pnpm add @brandplan/core @brandplan/ui brandplan
```

### 2. Initialize in your project

```bash
npx brandplan init
```

This creates:

- `brandplan.config.ts` - Your brand token definitions
- `app/brandplan.css` - Generated Tailwind v4 CSS (or `src/brandplan.css` based on project structure)

### 3. Import CSS in your Next.js layout

```tsx
// app/layout.tsx
import '@brandplan/ui/styles.css';
import './brandplan.css';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 4. Use BrandPlan components

```tsx
import { Button, Card } from '@brandplan/ui';

export default function Page() {
  return (
    <Card padding="md" radius="lg">
      <Button variant="solid" tone="primary" size="md">
        Click me
      </Button>
    </Card>
  );
}
```

## CLI Commands

### `brandplan init`

Scaffolds BrandPlan configuration and generates initial CSS.

```bash
npx brandplan init
```

**What it does:**

- Creates `brandplan.config.ts` with default tokens (if missing)
- Generates CSS file at:
  - `./app/brandplan.css` if `app/` directory exists (Next.js App Router)
  - `./src/brandplan.css` if `src/` directory exists
  - `./brandplan.css` otherwise
- Prints setup instructions

### `brandplan build`

Regenerates CSS from your config file.

```bash
npx brandplan build
```

**Options:**

- `--out <path>` - Custom output path for generated CSS

**Examples:**

```bash
# Default output (auto-detected)
npx brandplan build

# Custom output path
npx brandplan build --out ./styles/brand.css
```

## Configuration

Edit `brandplan.config.ts` to define your brand tokens:

```typescript
import { defineBrandPlan } from '@brandplan/core';

export default defineBrandPlan({
  space: {
    '2': '0.5rem',
    '4': '1rem',
    '6': '1.5rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  color: {
    brand: {
      primary: { dark: '#3b82f6', light: '#2563eb' },
      accent: { dark: '#8b5cf6', light: '#7c3aed' },
    },
    surface: {
      '0': { dark: '#0b0f17', light: '#ffffff' },
      '1': { dark: '#111827', light: '#f9fafb' },
    },
    text: {
      primary: { dark: '#f9fafb', light: '#111827' },
      secondary: { dark: '#9ca3af', light: '#6b7280' },
    },
  },
});
```

After editing, regenerate CSS:

```bash
npx brandplan build
```

## Dark/Light Theme Switching

BrandPlan uses explicit `data-theme` attribute for theme switching:

- **Dark mode** (default): `data-theme="dark"`
- **Light mode**: `data-theme="light"`
- Always set explicitly - never leave undefined
- Tailwind's `dark:` variant triggers when `data-theme="dark"`

```tsx
'use client';

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    } else {
      // Set default dark mode
      document.documentElement.dataset.theme = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.dataset.theme = newTheme;
  };

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
```

**How it works:**

- `:root` contains dark mode values by default with `color-scheme: dark`
- `[data-theme="dark"]` explicitly sets `color-scheme: dark` (hardening rule)
- `[data-theme="light"]` overrides with light mode values and `color-scheme: light`
- `@custom-variant dark` enables Tailwind's `dark:` modifier when `data-theme="dark"`
- Always set `data-theme` explicitly to `"dark"` or `"light"` for consistent behavior

## ESLint Enforcement

Install the ESLint plugin to catch violations:

```bash
npm install --save-dev @brandplan/eslint-plugin
# or
pnpm add -D @brandplan/eslint-plugin
```

Configure ESLint (flat config):

```javascript
// eslint.config.mjs
import brandplan from '@brandplan/eslint-plugin';

export default [
  {
    files: ['**/*.tsx', '**/*.ts'],
    plugins: {
      '@brandplan': brandplan,
    },
    rules: {
      '@brandplan/brand-classnames-only': 'error',
      '@brandplan/brand-margin-policy': 'error',
    },
  },
];
```

## Using BrandPlan with shadcn/ui (Optional Path Exclusion)

By default, BrandPlan ESLint rules are **strict everywhere**. If you're using shadcn/ui or other third-party component libraries that don't follow BrandPlan conventions, you can optionally exclude those paths from enforcement.

### Why Exclude Paths?

shadcn/ui components are generated into your project and often use standard Tailwind utilities (`p-4`, `rounded-lg`, `bg-white`, etc.) instead of brand-prefixed utilities. Rather than rewriting every shadcn component, you can exclude the shadcn folder from BrandPlan rules.

**Important:** Excluded paths are **not enforced** by BrandPlan. Only exclude vendor/third-party code you don't control.

### Configuration

Use the `ignorePaths` option to exclude specific paths from both rules:

```javascript
// eslint.config.mjs
import brandplan from '@brandplan/eslint-plugin';

export default [
  {
    files: ['**/*.tsx', '**/*.ts'],
    plugins: {
      '@brandplan': brandplan,
    },
    rules: {
      '@brandplan/brand-classnames-only': [
        'error',
        {
          ignorePaths: ['**/components/ui/**'], // Exclude shadcn/ui
        },
      ],
      '@brandplan/brand-margin-policy': [
        'error',
        {
          ignorePaths: ['**/components/ui/**'], // Exclude shadcn/ui
        },
      ],
    },
  },
];
```

### Recommended Patterns

Common patterns for exclusion:

- `**/components/ui/**` - shadcn/ui default location
- `src/components/ui/**` - if shadcn generates into `src/`
- `**/lib/shadcn/**` - alternative shadcn location
- `**/*.vendor.tsx` - vendor component files

### Pattern Matching

The `ignorePaths` option uses [picomatch](https://github.com/micromatch/picomatch) for glob pattern matching:

- `**` matches any number of directories
- `*` matches any characters within a directory name
- Paths are normalized to forward slashes automatically

### Example: Mixed Enforcement

```javascript
// Your custom components - ENFORCED
// src/components/Button.tsx - Must use brand-* utilities

// shadcn components - EXCLUDED
// src/components/ui/button.tsx - Skipped (uses standard Tailwind)
// src/components/ui/card.tsx - Skipped (uses standard Tailwind)
```

**Best practice:** Keep your ignorePaths list minimal. Only exclude what you truly can't control.

## Packages

- `@brandplan/core` - Token schema validation and CSS generation
- `@brandplan/ui` - React components (Button, Card)
- `@brandplan/eslint-plugin` - ESLint rules for enforcement
- `brandplan` - CLI for scaffolding and building

## Examples

See `examples/next-app` for a complete Next.js App Router integration.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## Need help or advanced setups?

For complex setups, migrations, or team-wide enforcement strategies, visit [ibgroup.dev](https://ibgroup.dev/).

## License

MIT
