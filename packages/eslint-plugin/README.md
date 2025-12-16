# @brandplan/eslint-plugin

ESLint plugin to enforce BrandPlan design token usage and prevent visual drift.

## Installation

```bash
pnpm add -D @brandplan/eslint-plugin
```

## Usage

### Basic Configuration

```javascript
// eslint.config.js
import brandplan from '@brandplan/eslint-plugin';

export default [
  {
    files: ['**/*.tsx'],
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

### Recommended Configuration

Use the recommended config to enable all rules:

```javascript
// eslint.config.js
import brandplan from '@brandplan/eslint-plugin';

export default [
  {
    files: ['**/*.tsx'],
    plugins: {
      '@brandplan': brandplan,
    },
    ...brandplan.configs.recommended,
  },
];
```

## Rules

### `brand-classnames-only`

Enforces brand-prefixed utilities for design-critical properties and allows layout utilities only.

**Blocked (design-critical, non-brand):**
- Spacing: `p-4`, `m-2`, `gap-6`
- Radius: `rounded-lg`, `rounded-md`
- Colors: `bg-slate-100`, `text-white`, `border-gray-300`
- Shadows: `shadow-md`, `shadow-lg`

**Allowed:**
- Layout utilities: `flex`, `grid`, `w-full`, `h-screen`, `max-w-md`, `items-center`, `justify-between`
- Brand utilities: `p-brand-4`, `rounded-brand-md`, `bg-brand-surface-0`, `text-brand-text-primary`

**Examples:**

```tsx
// ❌ Blocked
<div className="p-4 rounded-lg bg-white" />

// ✅ Allowed
<div className="p-brand-4 rounded-brand-md bg-brand-surface-0 flex w-full" />
```

### `brand-margin-policy`

Enforces margin utilities only on semantic layout elements.

**Allowed elements for margin:**
- `<main>`
- `<header>`
- `<footer>`
- `<section>` (configurable)

**Blocked elements for margin:**
- All other elements (div, span, Card, Button, etc.)

**Configuration:**

```javascript
{
  rules: {
    '@brandplan/brand-margin-policy': ['error', {
      allowSection: true  // Allow margin on <section> elements
    }]
  }
}
```

**Examples:**

```tsx
// ❌ Blocked - div with margin
<div className="m-brand-4">Content</div>

// ❌ Blocked - component with margin
<Card className="mt-brand-2">Content</Card>

// ✅ Allowed - semantic element with margin
<main className="m-brand-4">Content</main>

// ✅ Allowed - div without margin
<div className="p-brand-4 flex gap-brand-2">Content</div>

// ✅ Allowed - header with margin
<header className="mb-brand-2 px-brand-4">Header</header>
```

**Rationale:**

Margin creates external spacing that affects layout relationships between components. By restricting margins to semantic layout elements only, BrandPlan:
- Prevents margin conflicts and collapsing margin bugs
- Encourages proper component composition with gap-brand-*
- Keeps components predictable and reusable
- Makes layouts explicit in semantic structure

**Alternatives to margin:**
- Use `gap-brand-*` for spacing between flex/grid children
- Use `p-brand-*` (padding) for internal spacing
- Wrap content in semantic layout elements when margin is needed

## Advanced Usage

### Complex className Expressions

Both rules parse various className patterns:

```tsx
// String literals
<div className="flex p-brand-4" />

// Template literals
<div className={`flex ${active && "bg-brand-primary"}`} />

// cn() / clsx() helper
<div className={cn("flex", isActive && "bg-brand-primary")} />

// Arrays
<div className={clsx(["flex", "p-brand-4"])} />

// Conditional expressions
<div className={hasMargin ? "m-brand-4" : "p-brand-4"} />
```

All patterns are properly analyzed for violations.

## Error Messages

The plugin provides helpful error messages with suggestions:

```
Non-brand utility "p-4" is not allowed. Use brand-prefixed utilities (e.g., p-brand-4) or layout utilities only.

BrandPlan margin utilities are only allowed on semantic layout elements (main, header, footer). Consider using gap-brand-* or padding instead.
```

## Integration with BrandPlan Packages

This plugin works together with:
- **@brandplan/core**: Generates brand token CSS
- **@brandplan/ui**: React components using brand tokens

The ESLint plugin enforces what the other packages provide, creating a complete system that prevents visual drift at build time.

## License

MIT
