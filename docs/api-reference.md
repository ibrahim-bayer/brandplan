# API Reference

Complete reference for all BrandPlan packages.

---

## @brandplan/core

Token schema validation and CSS generation engine.

### `defineBrandPlan(config)`

Defines and validates your brand token configuration.

**Parameters:**
- `config` (BrandPlanConfig): Configuration object

**Returns:** Validated configuration object

**Example:**
```typescript
import { defineBrandPlan } from '@brandplan/core';

export default defineBrandPlan({
  space: {
    '2': '0.5rem',
    '4': '1rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
  },
  color: {
    brand: {
      primary: { dark: '#3b82f6', light: '#2563eb' },
    },
    surface: {
      '0': { dark: '#0b0f17', light: '#ffffff' },
    },
    text: {
      primary: { dark: '#f9fafb', light: '#111827' },
    },
  },
});
```

### `generateCSS(config)`

Generates Tailwind v4-compatible CSS from brand tokens.

**Parameters:**
- `config` (BrandPlanConfig): Validated configuration

**Returns:** CSS string with `@theme` block

**Example:**
```typescript
import { generateCSS, defineBrandPlan } from '@brandplan/core';

const config = defineBrandPlan({ /* ... */ });
const css = generateCSS(config);
```

### Type: `BrandPlanConfig`

```typescript
interface BrandPlanConfig {
  space: Record<string, string>;
  radius: Record<string, string>;
  color: {
    [namespace: string]: {
      [token: string]: { dark: string; light: string };
    };
  };
}
```

**Validation Rules:**
- `space` keys: alphanumeric, hyphens allowed
- `space` values: valid CSS length (rem, px, em, etc.)
- `radius` keys: alphanumeric, hyphens allowed
- `radius` values: valid CSS length or 'full' (9999px)
- `color` namespaces: alphanumeric, hyphens allowed
- `color` tokens: alphanumeric, hyphens allowed
- `color` values: must have both `dark` and `light` properties with valid CSS colors

---

## @brandplan/ui

React components using brand tokens.

### `<Button>`

Brand-enforced button component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Visual style |
| `tone` | `'primary' \| 'secondary'` | `'primary'` | Color scheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `children` | `ReactNode` | - | Button content |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |
| `className` | `string` | - | Additional classes (layout only) |

**Example:**
```tsx
import { Button } from '@brandplan/ui';

<Button variant="solid" tone="primary" size="md" onClick={() => {}}>
  Click me
</Button>
```

**Brand Tokens Used:**
- Padding: `p-brand-2`, `p-brand-3`, `p-brand-4`
- Radius: `rounded-brand-md`
- Colors: `bg-brand-primary`, `text-brand-primary`, `border-brand-primary`

### `<Card>`

Brand-enforced card container.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Border radius |
| `border` | `boolean` | `true` | Show border |
| `shadow` | `boolean` | `false` | Show shadow |
| `children` | `ReactNode` | - | Card content |
| `className` | `string` | - | Additional classes (layout only) |
| `as` | `ElementType` | `'div'` | HTML element type |

**Example:**
```tsx
import { Card } from '@brandplan/ui';

<Card padding="lg" radius="lg" border shadow>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

**Brand Tokens Used:**
- Padding: `p-brand-0`, `p-brand-2`, `p-brand-4`, `p-brand-6`, `p-brand-8`
- Radius: `rounded-brand-none`, `rounded-brand-sm`, `rounded-brand-md`, etc.
- Colors: `bg-brand-surface-0`, `border-brand-default`

---

## @brandplan/eslint-plugin

ESLint rules for brand token enforcement.

### Rules

#### `@brandplan/brand-classnames-only`

Enforces brand-prefixed utilities for design-critical properties.

**Severity:** error | warn | off

**Options:**
```typescript
{
  ignorePaths?: string[];
}
```

**Default:** `{ ignorePaths: [] }`

**Example:**
```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      '@brandplan/brand-classnames-only': [
        'error',
        {
          ignorePaths: ['**/components/ui/**'],
        },
      ],
    },
  },
];
```

**What it enforces:**
- Spacing utilities: `p-brand-*`, `m-brand-*`, `gap-brand-*`, `space-brand-*`
- Radius utilities: `rounded-brand-*`
- Color utilities: `bg-brand-*`, `text-brand-*` (color only), `border-brand-*`, `ring-brand-*`
- Shadow utilities: `shadow-brand-*`

**What it blocks:**
- Non-brand utilities: `p-4`, `bg-blue-500`, `rounded-lg`
- Arbitrary values: `p-[12px]`, `bg-[#ff0000]`
- Text color utilities: `text-white`, `text-blue-500` (use `text-brand-*`)

**What it allows:**
- Layout utilities: `flex`, `grid`, `w-*`, `h-*`, etc.
- Text size utilities: `text-sm`, `text-xl`, `text-2xl`, etc.
- Typography utilities: `font-*`, `leading-*`, `tracking-*`

#### `@brandplan/brand-margin-policy`

Restricts margin usage to semantic layout elements.

**Severity:** error | warn | off

**Options:**
```typescript
{
  ignorePaths?: string[];
}
```

**Default:** `{ ignorePaths: [] }`

**Example:**
```javascript
export default [
  {
    rules: {
      '@brandplan/brand-margin-policy': [
        'error',
        {
          ignorePaths: ['**/components/ui/**'],
        },
      ],
    },
  },
];
```

**What it enforces:**
- Margins ONLY on: `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`, `<nav>`, `<aside>`
- Must use `m-brand-*` prefix

**What it blocks:**
- Margins on `<div>`, `<span>`, `<button>`, etc.
- Non-brand margin utilities: `m-4`, `mt-2`
- Inline styles with margin properties

---

## brandplan (CLI)

Command-line interface for scaffolding and building.

### `brandplan init`

Scaffolds BrandPlan configuration and generates initial CSS.

**Usage:**
```bash
npx brandplan init
```

**What it does:**
1. Creates `brandplan.config.ts` (if missing)
2. Detects project structure (Next.js, Vite, etc.)
3. Generates CSS file at appropriate location:
   - `./app/brandplan.css` (Next.js App Router)
   - `./src/brandplan.css` (Vite/CRA)
   - `./brandplan.css` (fallback)
4. Prints setup instructions

**Files created:**
- `brandplan.config.ts` - Token configuration
- `brandplan.css` - Generated Tailwind v4 CSS

### `brandplan build`

Regenerates CSS from configuration.

**Usage:**
```bash
npx brandplan build [options]
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `--out <path>` | string | Custom output path for CSS |

**Examples:**
```bash
# Auto-detect output location
npx brandplan build

# Custom output
npx brandplan build --out ./styles/brand.css
```

**Exit codes:**
- `0` - Success
- `1` - Configuration file not found
- `1` - Configuration validation failed
- `1` - CSS generation failed

---

## CSS Output

### Generated Theme Block

BrandPlan generates Tailwind v4-compatible CSS:

```css
@theme {
  /* Spacing */
  --spacing-brand-2: 0.5rem;
  --spacing-brand-4: 1rem;
  --spacing-brand-6: 1.5rem;

  /* Radius */
  --radius-brand-sm: 0.25rem;
  --radius-brand-md: 0.5rem;
  --radius-brand-lg: 1rem;

  /* Colors (dark mode default) */
  --color-brand-primary: #3b82f6;
  --color-brand-surface-0: #0b0f17;
  --color-brand-text-primary: #f9fafb;
}

:root {
  color-scheme: dark;
}

[data-theme="dark"] {
  color-scheme: dark;
}

[data-theme="light"] {
  color-scheme: light;
  --color-brand-primary: #2563eb;
  --color-brand-surface-0: #ffffff;
  --color-brand-text-primary: #111827;
}

@custom-variant dark (&:is([data-theme="dark"], [data-theme="dark"] *));
```

### Using Generated Variables

In custom CSS:
```css
.my-component {
  padding: var(--spacing-brand-4);
  background: var(--color-brand-surface-0);
  border-radius: var(--radius-brand-md);
}
```

In Tailwind utilities:
```tsx
<div className="p-brand-4 bg-brand-surface-0 rounded-brand-md">
  Content
</div>
```

---

## Type Definitions

All packages export TypeScript types.

### `@brandplan/core`

```typescript
export interface BrandPlanConfig {
  space: Record<string, string>;
  radius: Record<string, string>;
  color: {
    [namespace: string]: {
      [token: string]: { dark: string; light: string };
    };
  };
}

export function defineBrandPlan(config: BrandPlanConfig): BrandPlanConfig;
export function generateCSS(config: BrandPlanConfig): string;
```

### `@brandplan/ui`

```typescript
export interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  tone?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  shadow?: boolean;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Button: React.FC<ButtonProps>;
export const Card: React.FC<CardProps>;
```

---

## Error Messages

### Configuration Validation Errors

**Invalid space value:**
```
BrandPlan validation error: space.4 must be a valid CSS length (got: "invalid")
```

**Missing dark/light color:**
```
BrandPlan validation error: color.brand.primary must have both 'dark' and 'light' properties
```

**Invalid color namespace:**
```
BrandPlan validation error: color namespace 'invalid@name' contains invalid characters
```

### CLI Errors

**Config file not found:**
```
Error: brandplan.config.ts not found
Run 'npx brandplan init' to create one
```

**Config validation failed:**
```
Error: Configuration validation failed
[validation error details]
```

---

## Environment Variables

BrandPlan does not use environment variables. Configuration is defined in `brandplan.config.ts`.

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS custom properties support
- Requires `color-scheme` property support
- IE11 not supported

---

## Version Compatibility

| BrandPlan | Tailwind CSS | React | Node.js |
|-----------|--------------|-------|---------|
| 0.1.x     | 4.x          | 18-19 | 20.9+   |

---

## See Also

- [Migration Guide](./migration-guide.md)
- [Troubleshooting](./troubleshooting.md)
- [Comparison Guide](./comparison.md)
