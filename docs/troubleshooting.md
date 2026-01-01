# Troubleshooting Guide

Common issues and solutions when using BrandPlan.

---

## Installation Issues

### Node Version Error

**Error:**
```
error @brandplan/core@0.1.2: The engine "node" is incompatible with this module. Expected version ">=20.9.0".
```

**Solution:**
Upgrade to Node.js 20.9.0 or higher:
```bash
# Using nvm
nvm install 20
nvm use 20

# Using fnm
fnm install 20
fnm use 20
```

### Package Not Found

**Error:**
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@brandplan/core
```

**Solution:**
Ensure you're using the correct package names:
- `@brandplan/core`
- `@brandplan/ui`
- `@brandplan/eslint-plugin`
- `brandplan` (CLI)

Check for typos and verify the packages exist on npmjs.com.

---

## Configuration Issues

### Config File Not Found

**Error:**
```
Error: brandplan.config.ts not found
```

**Solution:**
Create config file:
```bash
npx brandplan init
```

Or create manually:
```typescript
// brandplan.config.ts
import { defineBrandPlan } from '@brandplan/core';

export default defineBrandPlan({
  space: { '4': '1rem' },
  radius: { md: '0.5rem' },
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

### Validation Error: Invalid Space Value

**Error:**
```
BrandPlan validation error: space.md must be a valid CSS length (got: "medium")
```

**Solution:**
Use valid CSS length units:
```typescript
// ❌ Wrong
space: {
  md: 'medium',
}

// ✅ Correct
space: {
  md: '1rem',    // or '16px', '1em', etc.
}
```

### Validation Error: Missing Dark/Light

**Error:**
```
BrandPlan validation error: color.brand.primary must have both 'dark' and 'light' properties
```

**Solution:**
All colors require both dark and light values:
```typescript
// ❌ Wrong
color: {
  brand: {
    primary: '#3b82f6',
  },
}

// ✅ Correct
color: {
  brand: {
    primary: { dark: '#3b82f6', light: '#2563eb' },
  },
}
```

---

## CSS Generation Issues

### CSS File Not Generated

**Problem:**
Ran `npx brandplan build` but no CSS file was created.

**Solution:**
1. Check for errors in console output
2. Verify `brandplan.config.ts` exists and is valid
3. Specify output path manually:
   ```bash
   npx brandplan build --out ./src/brandplan.css
   ```

### Brand Utilities Have No Effect

**Problem:**
Using `p-brand-4` but padding is not applied.

**Solution:**
1. Ensure you imported the generated CSS:
   ```tsx
   import './brandplan.css';
   ```
2. Check import order (brandplan.css should come before globals.css):
   ```tsx
   import '@brandplan/ui/styles.css';
   import './brandplan.css';      // Before globals
   import './globals.css';
   ```
3. Verify the token exists in your config:
   ```typescript
   space: {
     '4': '1rem', // ✅ Enables p-brand-4
   }
   ```

---

## ESLint Issues

### ESLint Plugin Not Working

**Problem:**
ESLint is not catching violations.

**Solution:**
1. Verify plugin is installed:
   ```bash
   npm list @brandplan/eslint-plugin
   ```

2. Check ESLint config (flat config):
   ```javascript
   // eslint.config.mjs
   import brandplan from '@brandplan/eslint-plugin';

   export default [
     {
       files: ['**/*.tsx', '**/*.ts'],
       plugins: {
         '@brandplan': brandplan,  // Must match rule prefix
       },
       rules: {
         '@brandplan/brand-classnames-only': 'error',
         '@brandplan/brand-margin-policy': 'error',
       },
     },
   ];
   ```

3. Ensure files are included in `files` pattern

### Too Many False Positives

**Problem:**
ESLint flagging valid code or third-party components.

**Solution:**
Use `ignorePaths` to exclude specific paths:
```javascript
rules: {
  '@brandplan/brand-classnames-only': [
    'error',
    {
      ignorePaths: [
        '**/components/ui/**',      // shadcn/ui
        '**/node_modules/**',       // Dependencies
        '**/*.vendor.tsx',          // Vendor files
      ],
    },
  ],
}
```

### ESLint Crashes or Errors

**Error:**
```
TypeError: Cannot read property 'value' of undefined
```

**Solution:**
1. Update to latest ESLint version (9.x)
2. Update to latest @brandplan/eslint-plugin
3. Report issue with minimal reproduction

---

## Theme Switching Issues

### Dark/Light Mode Not Switching

**Problem:**
Theme toggle doesn't change colors.

**Solution:**
1. Ensure `data-theme` attribute is set on `<html>`:
   ```tsx
   document.documentElement.dataset.theme = 'dark'; // or 'light'
   ```

2. Verify all colors have dark/light variants:
   ```typescript
   color: {
     brand: {
       primary: { dark: '#3b82f6', light: '#2563eb' }, // ✅
     },
   }
   ```

3. Check CSS import order:
   ```tsx
   import './brandplan.css';  // Must be imported
   ```

### Flickering on Page Load

**Problem:**
Page loads in wrong theme, then flashes to correct theme.

**Solution:**
Set `data-theme` BEFORE React renders:
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.dataset.theme = theme;
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Component Issues

### Button Styling Not Applied

**Problem:**
`<Button>` component looks unstyled.

**Solution:**
1. Import Button styles:
   ```tsx
   import '@brandplan/ui/styles.css';
   ```

2. Verify required tokens exist in config:
   ```typescript
   space: { '2': '0.5rem', '3': '0.75rem', '4': '1rem' },
   radius: { md: '0.5rem' },
   color: {
     brand: {
       primary: { dark: '#...', light: '#...' },
     },
   }
   ```

### Card Border Not Showing

**Problem:**
`<Card border>` doesn't show border.

**Solution:**
Add border color token:
```typescript
color: {
  border: {
    default: { dark: '#374151', light: '#e5e7eb' },
  },
}
```

Then rebuild:
```bash
npx brandplan build
```

---

## Build/CI Issues

### Build Fails in CI

**Error:**
```
ESLint errors found
```

**Solution:**
1. Run locally to see errors:
   ```bash
   npm run lint
   ```

2. Fix violations or adjust rules:
   ```javascript
   // Start with warnings in CI
   rules: {
     '@brandplan/brand-classnames-only': 'warn',
   }
   ```

3. Exclude problematic paths temporarily

### Type Errors

**Error:**
```
Type 'string' is not assignable to type '"solid" | "outline" | "ghost"'
```

**Solution:**
Use literal types:
```tsx
// ❌ Wrong
const variant = 'solid';
<Button variant={variant} />

// ✅ Correct
const variant = 'solid' as const;
<Button variant={variant} />

// ✅ Or use literal directly
<Button variant="solid" />
```

---

## Migration Issues

### Can't Find All Arbitrary Values

**Problem:**
Need to find all `p-[...]` patterns for migration.

**Solution:**
Use ripgrep or grep:
```bash
# Find all arbitrary padding
rg "p-\[" --type tsx --type jsx

# Find all arbitrary colors
rg "bg-\[" --type tsx --type jsx

# Find all arbitrary radius
rg "rounded-\[" --type tsx --type jsx
```

### Too Many Violations to Fix

**Problem:**
100s of ESLint errors after enabling rules.

**Solution:**
Incremental migration approach:
1. Start with `warn` instead of `error`
2. Use `ignorePaths` to exclude most files
3. Migrate one folder at a time:
   ```javascript
   ignorePaths: [
     '**/components/**',  // Exclude all for now
     '!**/components/layout/**',  // But include layout
   ]
   ```

---

## Performance Issues

### Slow ESLint

**Problem:**
ESLint takes too long to run.

**Solution:**
1. Use `ignorePaths` to exclude large vendor folders:
   ```javascript
   ignorePaths: ['**/node_modules/**', '**/dist/**']
   ```

2. Run ESLint only on changed files in CI:
   ```bash
   # Using lint-staged
   npx lint-staged
   ```

### Large CSS File

**Problem:**
Generated `brandplan.css` is very large.

**Solution:**
BrandPlan generates minimal CSS (typically <5KB). If file is large:
1. Check for duplicate tokens in config
2. Remove unused tokens
3. Use Tailwind's purge/content config to remove unused utilities

---

## Integration Issues

### Conflicts with Existing Tailwind Config

**Problem:**
BrandPlan CSS conflicts with existing Tailwind config.

**Solution:**
BrandPlan CSS is additive - it extends Tailwind. Import order matters:
```tsx
import './brandplan.css';    // BrandPlan tokens
import './tailwind.css';     // Your Tailwind config
```

You can keep your existing Tailwind config for non-brand utilities.

### Conflicts with CSS-in-JS

**Problem:**
Using styled-components or emotion alongside BrandPlan.

**Solution:**
BrandPlan works with CSS-in-JS. Use CSS variables:
```tsx
import styled from 'styled-components';

const StyledDiv = styled.div`
  padding: var(--spacing-brand-4);
  background: var(--color-brand-surface-0);
  border-radius: var(--radius-brand-md);
`;
```

### Next.js Turbopack Issues

**Problem:**
BrandPlan doesn't work with Next.js Turbopack.

**Solution:**
Turbopack is experimental. Use webpack for now:
```bash
# Disable turbopack
next dev  # (no --turbo flag)
```

---

## Getting Help

If you've tried the solutions above and still have issues:

1. **Check existing issues:** [GitHub Issues](https://github.com/ibrahim-bayer/brandplan/issues)
2. **Create minimal reproduction:** Use StackBlitz or CodeSandbox
3. **Open new issue:** Include:
   - BrandPlan version (`npm list @brandplan/core`)
   - Node version (`node -v`)
   - Error messages
   - Minimal reproduction
4. **Professional support:** [ibgroup.dev](https://ibgroup.dev/)

---

## Debug Checklist

When something isn't working:

- [ ] Node version >= 20.9.0
- [ ] All BrandPlan packages installed
- [ ] `brandplan.config.ts` exists and is valid
- [ ] Ran `npx brandplan build` after config changes
- [ ] Imported `brandplan.css` in app
- [ ] CSS import order correct (brandplan.css before globals.css)
- [ ] ESLint plugin installed and configured
- [ ] Tokens exist in config for utilities you're using
- [ ] `data-theme` attribute set on `<html>` for theme switching
- [ ] No typos in utility names (e.g., `p-brand-4` not `p-4-brand`)

---

## Still Stuck?

[Open an issue](https://github.com/ibrahim-bayer/brandplan/issues/new) with:
- What you're trying to do
- What you expected to happen
- What actually happened
- Minimal code to reproduce
