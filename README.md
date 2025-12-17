# BrandPlan

BrandPlan is a strict branding layer on top of Tailwind that replaces freedom with consistency.

## What is BrandPlan?

BrandPlan eliminates visual drift by enforcing brand tokens through technical constraints:

- **One prefix system**: All design-critical utilities use `brand-*` prefix
- **Hard enforcement**: ESLint catches violations at build time
- **Dark-first theming**: `:root` contains dark values, `[data-theme="light"]` overrides
- **Semantic margin policy**: Margins restricted to layout elements
- **Tailwind v4 compatible**: Uses CSS-first `@theme` block

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

## Theme Toggle

BrandPlan uses the `data-theme` attribute for theme switching. Both dark and light modes require the attribute to be set explicitly for Tailwind's `dark:` variant to work correctly.

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
- `:root` contains dark mode values by default
- `[data-theme="light"]` overrides with light mode values
- `@custom-variant dark` enables Tailwind's `dark:` modifier when `data-theme="dark"`
- Always set `data-theme` explicitly (never leave it undefined) for consistent behavior

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

## Packages

- **`@brandplan/core`** - Token schema validation and CSS generation
- **`@brandplan/ui`** - React components (Button, Card)
- **`@brandplan/eslint-plugin`** - ESLint rules for enforcement
- **`brandplan`** - CLI for scaffolding and building

## Examples

See `examples/next-app` for a complete Next.js App Router integration.

## License

MIT
