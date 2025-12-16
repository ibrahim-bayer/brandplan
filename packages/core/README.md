# @brandplan/core

Strict token schema and CSS theme generator for BrandPlan - a branding layer on top of Tailwind CSS v4.

## Installation

```bash
pnpm add @brandplan/core
```

## Usage

### Define your brand plan

```typescript
import { defineBrandPlan, brandPlanToCss } from '@brandplan/core';

const plan = defineBrandPlan({
  space: {
    '2': '0.5rem',
    '4': '1rem',
    '6': '1.5rem',
    '8': '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  color: {
    surface: {
      '0': { dark: '#0b0f17', light: '#ffffff' },
      '1': { dark: '#111827', light: '#f1f5f9' },
    },
    text: {
      primary: { dark: '#ffffff', light: '#0f172a' },
      secondary: { dark: '#9ca3af', light: '#64748b' },
    },
    brand: {
      primary: { dark: '#3b82f6', light: '#2563eb' },
      accent: { dark: '#8b5cf6', light: '#7c3aed' },
    },
  },
});
```

### Generate CSS

```typescript
const css = brandPlanToCss(plan);

// Write to a file (e.g., theme.css)
import { writeFileSync } from 'fs';
writeFileSync('theme.css', css);
```

### Generated CSS Output

```css
@import "tailwindcss";

@theme {
  --color-brand-brand-accent: var(--brand-color-brand-accent);
  --color-brand-brand-primary: var(--brand-color-brand-primary);
  --color-brand-surface-0: var(--brand-color-surface-0);
  --color-brand-surface-1: var(--brand-color-surface-1);
  --color-brand-text-primary: var(--brand-color-text-primary);
  --color-brand-text-secondary: var(--brand-color-text-secondary);
  --radius-brand-lg: var(--brand-radius-lg);
  --radius-brand-md: var(--brand-radius-md);
  --radius-brand-sm: var(--brand-radius-sm);
}

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  color-scheme: dark;
  --brand-space-2: 0.5rem;
  --brand-space-4: 1rem;
  --brand-space-6: 1.5rem;
  --brand-space-8: 2rem;
  --brand-radius-lg: 1rem;
  --brand-radius-md: 0.5rem;
  --brand-radius-sm: 0.25rem;
  --brand-color-brand-accent: #8b5cf6;
  --brand-color-brand-primary: #3b82f6;
  --brand-color-surface-0: #0b0f17;
  --brand-color-surface-1: #111827;
  --brand-color-text-primary: #ffffff;
  --brand-color-text-secondary: #9ca3af;
}

[data-theme="light"] {
  color-scheme: light;
  --brand-color-brand-accent: #7c3aed;
  --brand-color-brand-primary: #2563eb;
  --brand-color-surface-0: #ffffff;
  --brand-color-surface-1: #f1f5f9;
  --brand-color-text-primary: #0f172a;
  --brand-color-text-secondary: #64748b;
}
```

The `@theme` block maps brand tokens to Tailwind v4 theme variables, enabling utilities like `bg-brand-surface-0` and `rounded-brand-md`. The `@custom-variant` enables `dark:` prefix support for `data-theme="dark"` elements.

## Usage in HTML

Control theme mode by setting the `data-theme` attribute on your root element:

```html
<!-- Dark mode (default) -->
<html>
  <body class="bg-brand-surface-0 text-brand-text-primary">
    <button class="bg-brand-brand-primary rounded-brand-md">
      Click me
    </button>
  </body>
</html>

<!-- Light mode -->
<html data-theme="light">
  <body class="bg-brand-surface-0 text-brand-text-primary">
    <button class="bg-brand-brand-primary rounded-brand-md dark:bg-brand-brand-accent">
      Click me
    </button>
  </body>
</html>
```

Available utility classes:
- **Colors**: `bg-brand-{group}-{token}`, `text-brand-{group}-{token}`, `border-brand-{group}-{token}`
- **Radius**: `rounded-brand-{token}`
- **Dark variant**: Use `dark:` prefix for `data-theme="dark"` specific styles

## Token Schema

### Space Tokens

Record of token names to CSS length values:

```typescript
space: {
  '2': '0.5rem',
  '4': '1rem',
  // ... more tokens
}
```

Generates: `--brand-space-{token}`

### Radius Tokens

Record of token names to CSS length values:

```typescript
radius: {
  sm: '0.25rem',
  md: '0.5rem',
  // ... more tokens
}
```

Generates: `--brand-radius-{token}`

### Color Tokens

Nested record with dark and light values:

```typescript
color: {
  surface: {
    '0': { dark: '#0b0f17', light: '#ffffff' },
  },
  text: {
    primary: { dark: '#ffffff', light: '#0f172a' },
  },
}
```

Generates: `--brand-color-{group}-{token}`

## Validation

`defineBrandPlan` performs strict runtime validation:

- All token values must be non-empty strings
- `space` and `radius` values must be valid CSS lengths (px, rem, em, %, vh, vw, etc.) or `0`
- `color` values must be valid hex colors (#RGB or #RRGGBB)
- Every color token must have both `dark` and `light` properties
- Unknown top-level keys are rejected

### Error Examples

```typescript
// Missing light value
defineBrandPlan({
  space: { '4': '1rem' },
  radius: { md: '0.5rem' },
  color: {
    text: {
      primary: { dark: '#fff' }, // Error: missing 'light' property
    },
  },
});

// Invalid CSS length
defineBrandPlan({
  space: { '4': 'not-a-length' }, // Error: not a valid CSS length
  radius: { md: '0.5rem' },
  color: {},
});

// Invalid hex color
defineBrandPlan({
  space: { '4': '1rem' },
  radius: { md: '0.5rem' },
  color: {
    text: {
      primary: { dark: 'blue', light: '#fff' }, // Error: not a valid hex color
    },
  },
});
```

## Design Principles

- **Dark mode first**: `:root` contains dark values, light mode is an override via `data-theme="light"`
- **Brand-prefixed variables**: All CSS variables use `--brand-*` prefix
- **Tailwind v4 theme integration**: `@theme` block maps brand tokens to Tailwind utilities
- **Data-theme variant support**: `@custom-variant dark` enables `dark:` prefix for theme-aware styling
- **Tailwind v4 compatible**: Output includes `@import "tailwindcss"` for drop-in usage
- **Deterministic output**: Stable, sorted variable ordering for consistent diffs
- **Zero runtime dependencies**: Lightweight and fast

## API Reference

### `defineBrandPlan(plan: unknown): BrandPlan`

Validates and normalizes a brand plan configuration.

**Parameters:**
- `plan`: Brand plan configuration object

**Returns:** Normalized `BrandPlan` object

**Throws:** `BrandPlanValidationError` if validation fails

### `brandPlanToCss(plan: BrandPlan): string`

Generates Tailwind v4 compatible CSS from a brand plan.

**Parameters:**
- `plan`: A validated brand plan (from `defineBrandPlan`)

**Returns:** CSS string with `@import`, `:root`, and `[data-theme="light"]` blocks

## License

MIT
