# BrandPlan

[![CI](https://github.com/ibrahim-bayer/brandplan/actions/workflows/ci.yml/badge.svg)](https://github.com/ibrahim-bayer/brandplan/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/brandplan.svg)](https://www.npmjs.com/package/brandplan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

BrandPlan is a strict branding layer on top of Tailwind that replaces freedom with consistency.

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

- ❌ Arbitrary values: `p-[12px]`, `bg-[#ff0000]`
- ❌ Non-brand utilities for design properties: `p-4`, `bg-blue-500`, `rounded-lg`
- ❌ Inline styles for margin, padding, color, radius, shadow
- ❌ Margins on non-layout elements (unless using `m-brand-*`)

**Utilities NOT affected** (use Tailwind freely):
- Layout: `flex`, `grid`, `block`, `hidden`, `w-*`, `h-*`, etc.
- Typography: `font-*`, `text-sm`, `leading-*`, etc.
- Effects: `opacity-*`, `blur-*`, `transition-*`, etc.

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
      {theme === 'dark' ? '☀️' : '🌙'}
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
// src/components/Button.tsx ✅ Must use brand-* utilities

// shadcn components - EXCLUDED
// src/components/ui/button.tsx ⏭️ Skipped (uses standard Tailwind)
// src/components/ui/card.tsx ⏭️ Skipped (uses standard Tailwind)
```

**Best practice:** Keep your ignorePaths list minimal. Only exclude what you truly can't control.

## Packages

- **`@brandplan/core`** - Token schema validation and CSS generation
- **`@brandplan/ui`** - React components (Button, Card)
- **`@brandplan/eslint-plugin`** - ESLint rules for enforcement
- **`brandplan`** - CLI for scaffolding and building

## Examples

See `examples/next-app` for a complete Next.js App Router integration.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

MIT
