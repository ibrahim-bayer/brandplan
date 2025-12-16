# @brandplan/ui

Minimal React UI primitives for BrandPlan - strict, brand-token-only components.

This package provides `Button` and `Card` components that exclusively use BrandPlan theme variables, eliminating visual drift by enforcing brand tokens for all design-critical styling.

## Installation

```bash
pnpm add @brandplan/ui @brandplan/core
```

## Setup

### 1. Generate your brand theme CSS

```typescript
// theme-gen.ts
import { defineBrandPlan, brandPlanToCss } from '@brandplan/core';
import { writeFileSync } from 'fs';

const plan = defineBrandPlan({
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
      '1': { dark: '#111827', light: '#f1f5f9' },
    },
    text: {
      primary: { dark: '#ffffff', light: '#0f172a' },
      secondary: { dark: '#9ca3af', light: '#64748b' },
    },
  },
});

writeFileSync('app/theme.css', brandPlanToCss(plan));
```

### 2. Import CSS in your app

```typescript
// app/layout.tsx or app/main.tsx
import '@brandplan/ui/styles.css';
import './theme.css'; // Your generated theme
```

### 3. Use components

```tsx
import { Button, Card } from '@brandplan/ui';

export default function App() {
  return (
    <div>
      <Card padding="lg" radius="md">
        <h1>Welcome to BrandPlan</h1>
        <Button variant="solid" tone="primary" size="md" radius="md">
          Get Started
        </Button>
      </Card>
    </div>
  );
}
```

## Components

### Button

A button component that enforces brand tokens for colors, spacing, and radius.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"solid" \| "outline" \| "ghost"` | `"solid"` | Visual style variant |
| `tone` | `"primary" \| "accent"` | `"primary"` | Color tone from brand tokens |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size using brand spacing |
| `radius` | `"sm" \| "md" \| "lg"` | `"md"` | Border radius using brand tokens |
| `className` | `string` | `undefined` | Additional layout utilities only |
| `disabled` | `boolean` | `false` | Disabled state |

#### Examples

```tsx
// Solid primary button (default)
<Button>Click me</Button>

// Outline accent button
<Button variant="outline" tone="accent">
  Secondary Action
</Button>

// Ghost button with small size
<Button variant="ghost" size="sm">
  Tertiary Action
</Button>

// Large button with custom radius
<Button size="lg" radius="lg">
  Call to Action
</Button>

// Disabled button
<Button disabled>
  Not Available
</Button>

// With layout utilities (allowed)
<Button className="w-full">
  Full Width Button
</Button>
```

#### Required Brand Tokens

- `color.brand.primary` (dark + light)
- `color.brand.accent` (dark + light)
- `color.surface.0` (dark + light)
- `color.text.primary` (dark + light)
- `radius.sm`, `radius.md`, `radius.lg`
- `space.2`, `space.4`, `space.6`

### Card

A surface component that provides consistent background, padding, and radius using brand tokens.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tone` | `"default" \| "muted"` | `"default"` | Surface tone variant |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Padding using brand spacing |
| `radius` | `"sm" \| "md" \| "lg"` | `"md"` | Border radius using brand tokens |
| `className` | `string` | `undefined` | Additional layout utilities only |

#### Examples

```tsx
// Default card
<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>

// Muted tone with large padding
<Card tone="muted" padding="lg">
  <p>Muted background with more spacing</p>
</Card>

// Small padding with large radius
<Card padding="sm" radius="lg">
  <p>Compact card with rounded corners</p>
</Card>

// No padding (for custom layouts)
<Card padding="none">
  <img src="banner.jpg" alt="Banner" />
  <div className="bp-card--p-md">
    <h3>Custom Layout</h3>
  </div>
</Card>

// With layout utilities (allowed)
<Card className="max-w-2xl mx-auto">
  <p>Centered card with max width</p>
</Card>
```

#### Required Brand Tokens

- `color.surface.0` (dark + light)
- `color.surface.1` (dark + light)
- `radius.sm`, `radius.md`, `radius.lg`
- `space.2`, `space.4`, `space.6`

## Dark Mode

Control theme mode by setting the `data-theme` attribute on your root element:

```html
<!-- Dark mode (default) -->
<html>
  <body>
    <Button>Dark Mode Button</Button>
  </body>
</html>

<!-- Light mode -->
<html data-theme="light">
  <body>
    <Button>Light Mode Button</Button>
  </body>
</html>
```

React example with theme toggle:

```tsx
import { useState } from 'react';
import { Button, Card } from '@brandplan/ui';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Card>
      <h1>Current theme: {theme}</h1>
      <Button onClick={toggleTheme}>
        Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
    </Card>
  );
}
```

## Design Constraints

These components are intentionally constrained to enforce brand consistency:

### ✅ Allowed

- Layout utilities: `flex`, `grid`, `w-full`, `max-w-*`, `mx-auto`, etc.
- Using `className` prop for positioning and layout

### ❌ Prohibited

- Arbitrary Tailwind spacing: `p-4`, `m-2`, `gap-6` (use brand spacing via component props)
- Non-brand colors: `bg-slate-100`, `text-blue-500` (use brand color tokens)
- Non-brand radius: `rounded-lg`, `rounded-xl` (use brand radius via component props)
- Arbitrary values: `bg-[#123456]`, `p-[13px]`, `rounded-[9px]`

### className Usage

The `className` prop is provided for **layout utilities only**. Do not use it to override brand-critical styling:

```tsx
// ✅ Good - layout utilities
<Button className="w-full mt-4">Submit</Button>
<Card className="max-w-md mx-auto">Content</Card>

// ❌ Bad - overriding brand styling
<Button className="bg-red-500 rounded-full p-8">Don't do this</Button>
<Card className="bg-white p-12">Don't do this</Card>
```

## Styling Philosophy

BrandPlan enforces strict brand tokens to eliminate visual drift:

1. **Space**: All padding/spacing uses CSS variables (`var(--brand-space-*)`)
2. **Radius**: All border radius uses brand tokens (`rounded-brand-*`)
3. **Colors**: All colors use brand tokens (`bg-brand-*`, `text-brand-*`, `border-brand-*`)
4. **No Escapes**: No arbitrary values or non-brand Tailwind utilities

This approach ensures that:
- Design changes happen in one place (your brand plan)
- Visual consistency is enforced at the component level
- Developers can't accidentally introduce off-brand styling

## API Stability

This is an MVP package. The API is intentionally minimal and may expand in future versions. Breaking changes will follow semantic versioning.

## License

MIT
