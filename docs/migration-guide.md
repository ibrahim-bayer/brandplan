# Migration Guide: Tailwind CSS → BrandPlan

This guide helps you migrate an existing Tailwind CSS project to BrandPlan.

## Overview

**Time estimate:** 2-4 hours for a small project, 1-2 days for a large codebase
**Difficulty:** Medium
**Recommended approach:** Incremental migration with `ignorePaths`

---

## Prerequisites

- Node.js 20.9.0 or higher
- Existing Tailwind CSS v3 or v4 project
- Basic understanding of design tokens

---

## Step 1: Install BrandPlan

```bash
npm install @brandplan/core @brandplan/ui brandplan
npm install --save-dev @brandplan/eslint-plugin
```

Or with pnpm:

```bash
pnpm add @brandplan/core @brandplan/ui brandplan
pnpm add -D @brandplan/eslint-plugin
```

---

## Step 2: Initialize Configuration

```bash
npx brandplan init
```

This creates:
- `brandplan.config.ts` - Your brand token definitions
- `app/brandplan.css` or `src/brandplan.css` - Generated CSS

---

## Step 3: Audit Your Current Design Tokens

Before migrating, identify your current design values:

### Spacing Audit
```bash
# Find all spacing utilities in your codebase
grep -r "p-\[" . --include="*.tsx" --include="*.jsx"
grep -r "m-\[" . --include="*.tsx" --include="*.jsx"
```

### Color Audit
```bash
# Find all color utilities
grep -r "bg-\[" . --include="*.tsx" --include="*.jsx"
grep -r "text-\[#" . --include="*.tsx" --include="*.jsx"
```

### Radius Audit
```bash
# Find all radius utilities
grep -r "rounded-\[" . --include="*.tsx" --include="*.jsx"
```

**Create a spreadsheet** listing all unique values you find.

---

## Step 4: Define Your Brand Tokens

Edit `brandplan.config.ts` based on your audit:

```typescript
import { defineBrandPlan } from '@brandplan/core';

export default defineBrandPlan({
  // Map your existing spacing values
  space: {
    '1': '0.25rem',    // Was: p-1
    '2': '0.5rem',     // Was: p-2
    '4': '1rem',       // Was: p-4
    '6': '1.5rem',     // Was: p-6
    '8': '2rem',       // Was: p-8
  },

  // Map your existing radius values
  radius: {
    none: '0',
    sm: '0.25rem',     // Was: rounded-sm
    md: '0.5rem',      // Was: rounded-md
    lg: '1rem',        // Was: rounded-lg
    xl: '1.5rem',      // Was: rounded-xl
    full: '9999px',    // Was: rounded-full
  },

  // Map your existing colors with dark/light variants
  color: {
    brand: {
      primary: { dark: '#3b82f6', light: '#2563eb' },
      secondary: { dark: '#8b5cf6', light: '#7c3aed' },
    },
    surface: {
      '0': { dark: '#0b0f17', light: '#ffffff' },
      '1': { dark: '#111827', light: '#f9fafb' },
      '2': { dark: '#1f2937', light: '#f3f4f6' },
    },
    text: {
      primary: { dark: '#f9fafb', light: '#111827' },
      secondary: { dark: '#9ca3af', light: '#6b7280' },
      tertiary: { dark: '#6b7280', light: '#9ca3af' },
    },
    border: {
      default: { dark: '#374151', light: '#e5e7eb' },
      focus: { dark: '#3b82f6', light: '#2563eb' },
    },
  },
});
```

---

## Step 5: Generate CSS

```bash
npx brandplan build
```

Import the generated CSS in your app:

```tsx
// app/layout.tsx (Next.js App Router)
import '@brandplan/ui/styles.css';
import './brandplan.css';
import './globals.css';
```

Or:

```tsx
// src/index.tsx (Vite/CRA)
import '@brandplan/ui/styles.css';
import './brandplan.css';
import './index.css';
```

---

## Step 6: Configure ESLint (Optional but Recommended)

Start with **warnings** to avoid breaking your build:

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
      // Start with warnings
      '@brandplan/brand-classnames-only': 'warn',
      '@brandplan/brand-margin-policy': 'warn',
    },
  },
];
```

---

## Step 7: Incremental Migration Strategy

### Option A: Full Migration (Small Projects)

Replace all design-critical utilities at once:

**Before:**
```tsx
<div className="p-4 bg-blue-500 rounded-lg">
  <p className="text-white">Hello</p>
</div>
```

**After:**
```tsx
<div className="p-brand-4 bg-brand-primary rounded-brand-lg">
  <p className="text-brand-primary">Hello</p>
</div>
```

### Option B: Path Exclusion (Large Projects with Third-Party Components)

Exclude vendor code from enforcement:

```javascript
// eslint.config.mjs
export default [
  {
    files: ['**/*.tsx', '**/*.ts'],
    plugins: {
      '@brandplan': brandplan,
    },
    rules: {
      '@brandplan/brand-classnames-only': [
        'warn',
        {
          // Exclude shadcn/ui and node_modules
          ignorePaths: [
            '**/components/ui/**',
            '**/node_modules/**',
          ],
        },
      ],
      '@brandplan/brand-margin-policy': [
        'warn',
        {
          ignorePaths: [
            '**/components/ui/**',
            '**/node_modules/**',
          ],
        },
      ],
    },
  },
];
```

Then migrate your **custom components** folder by folder.

---

## Step 8: Replace Utilities (Bulk Find & Replace)

Use your IDE's find & replace (with regex):

### Spacing
```
Find:    p-4\b
Replace: p-brand-4

Find:    m-6\b
Replace: m-brand-6

Find:    gap-4\b
Replace: gap-brand-4
```

### Colors
```
Find:    bg-blue-500\b
Replace: bg-brand-primary

Find:    text-gray-900\b
Replace: text-brand-primary

Find:    border-gray-300\b
Replace: border-brand-default
```

### Radius
```
Find:    rounded-lg\b
Replace: rounded-brand-lg

Find:    rounded-md\b
Replace: rounded-brand-md
```

### Arbitrary Values (Manual Review Required)
```
Find:    p-\[(\d+)px\]
Replace: (map to closest brand-* token)
```

---

## Step 9: Handle Edge Cases

### Arbitrary Values
**Before:**
```tsx
<div className="p-[12px] bg-[#ff0000]">
```

**After:**
Map to the closest brand token or add a new token:
```tsx
<div className="p-brand-3 bg-brand-error">
```

And update `brandplan.config.ts`:
```typescript
space: {
  '3': '0.75rem', // New token for 12px
},
color: {
  brand: {
    error: { dark: '#ff0000', light: '#dc2626' },
  },
},
```

### Margins on Non-Layout Elements
BrandPlan restricts margins to layout elements (`<main>`, `<header>`, `<footer>`).

**Before:**
```tsx
<div className="m-4">Content</div>
```

**After (Option 1):** Use padding on parent
```tsx
<div className="p-brand-4">
  <div>Content</div>
</div>
```

**After (Option 2):** Use margin on layout element
```tsx
<main className="m-brand-4">
  <div>Content</div>
</main>
```

---

## Step 10: Switch to Errors

Once migration is complete, switch from `warn` to `error`:

```javascript
rules: {
  '@brandplan/brand-classnames-only': 'error',
  '@brandplan/brand-margin-policy': 'error',
},
```

---

## Migration Checklist

- [ ] Install BrandPlan packages
- [ ] Run `npx brandplan init`
- [ ] Audit existing spacing, colors, radius values
- [ ] Define tokens in `brandplan.config.ts`
- [ ] Generate CSS with `npx brandplan build`
- [ ] Import CSS in app entry point
- [ ] Configure ESLint with `warn` level
- [ ] Choose migration strategy (full vs incremental)
- [ ] Replace utilities (bulk find & replace)
- [ ] Handle arbitrary values and edge cases
- [ ] Test all components in dark and light modes
- [ ] Switch ESLint to `error` level
- [ ] Remove old Tailwind config (optional)

---

## Common Pitfalls

### 1. Forgetting to Import CSS
**Error:** Brand utilities have no effect
**Fix:** Import `brandplan.css` and `@brandplan/ui/styles.css`

### 2. Token Naming Mismatch
**Error:** `p-brand-md` doesn't work
**Fix:** Use the token keys defined in your config: `p-brand-4` not `p-brand-md`

### 3. Missing Dark/Light Variants
**Error:** Colors don't change in light mode
**Fix:** Ensure all colors have both `dark` and `light` values

### 4. ESLint False Positives
**Error:** ESLint flags valid code
**Fix:** Use `ignorePaths` or disable rule for specific files

---

## Need Help?

- [Troubleshooting Guide](./troubleshooting.md)
- [API Reference](./api-reference.md)
- [GitHub Issues](https://github.com/ibrahim-bayer/brandplan/issues)
- [Professional Support](https://ibgroup.dev/)
