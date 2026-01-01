# BrandPlan vs Alternatives

How BrandPlan compares to other design system and styling approaches.

---

## Quick Comparison Table

| Feature | BrandPlan | Vanilla Tailwind | Theme UI | Chakra UI | shadcn/ui | Panda CSS |
|---------|-----------|------------------|----------|-----------|-----------|-----------|
| **Enforcement** | ✅ ESLint | ❌ None | ❌ None | ⚠️ Runtime only | ❌ None | ⚠️ Static only |
| **Tailwind Compatible** | ✅ Yes (v4) | ✅ Native | ❌ No | ❌ No | ✅ Yes | ⚠️ Alternative |
| **Design Tokens** | ✅ Enforced | ⚠️ Optional | ✅ Required | ✅ Required | ⚠️ Optional | ✅ Required |
| **Bundle Size** | 🟢 Tiny (~2KB) | 🟢 Tiny | 🟡 Medium (~50KB) | 🔴 Large (~200KB) | 🟢 Tiny | 🟢 Tiny |
| **Component Library** | ⚠️ Minimal (2) | ❌ None | ✅ Full | ✅ Full | ✅ Copy/paste | ❌ None |
| **Build-Time Errors** | ✅ Yes (ESLint) | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Dark Mode** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| **TypeScript** | ✅ Full | ⚠️ Config only | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Learning Curve** | 🟢 Low | 🟢 Low | 🟡 Medium | 🟡 Medium | 🟢 Low | 🟡 Medium |
| **Flexibility** | 🔴 Strict | 🟢 Total freedom | 🟡 Moderate | 🟡 Moderate | 🟢 High | 🟡 Moderate |
| **Use Case** | Brand consistency | Rapid prototyping | Full design system | Full design system | Component library | Type-safe CSS |

---

## Detailed Comparisons

### BrandPlan vs Vanilla Tailwind CSS

**When to use BrandPlan:**
- You need brand consistency enforcement
- Designers complain about visual drift
- Multiple developers working on UI
- You want to prevent arbitrary values
- You have strict brand guidelines

**When to use Vanilla Tailwind:**
- Rapid prototyping
- Solo developer or very small team
- Flexibility is more important than consistency
- No strict brand guidelines
- Experimenting with different styles

**Key Differences:**

| Aspect | BrandPlan | Vanilla Tailwind |
|--------|-----------|------------------|
| **Freedom** | Restricted to brand tokens | Total freedom |
| **Arbitrary values** | ❌ Blocked | ✅ Allowed (`p-[12px]`) |
| **Enforcement** | ✅ Build-time (ESLint) | ❌ None |
| **Consistency** | ✅ Guaranteed | ⚠️ Developer discipline |
| **Setup time** | ~30 minutes | ~5 minutes |
| **Brand drift** | ❌ Impossible | ✅ Easy to happen |

**Example:**

Vanilla Tailwind allows this inconsistency:
```tsx
// Developer A
<div className="p-4 bg-blue-500 rounded-lg">

// Developer B
<div className="p-[16px] bg-[#3b82f6] rounded-[12px]">

// Developer C
<div className="p-5 bg-blue-600 rounded-xl">
```

BrandPlan enforces consistency:
```tsx
// All developers MUST use
<div className="p-brand-4 bg-brand-primary rounded-brand-lg">
```

---

### BrandPlan vs Theme UI

**When to use BrandPlan:**
- You're already using Tailwind
- You prefer utility-first CSS
- You want build-time enforcement
- Smaller bundle size is important
- You need minimal overhead

**When to use Theme UI:**
- You need a full component library
- You prefer CSS-in-JS
- You're building an MDX-heavy site
- You want runtime theme switching
- You're okay with larger bundle

**Key Differences:**

| Aspect | BrandPlan | Theme UI |
|--------|-----------|----------|
| **Styling approach** | Utility-first (Tailwind) | CSS-in-JS |
| **Bundle size** | ~2KB | ~50KB |
| **Component count** | 2 (minimal) | 20+ (full) |
| **Enforcement** | Build-time (ESLint) | Runtime (Theme object) |
| **Tailwind compat** | ✅ Yes | ❌ No |
| **MDX support** | ⚠️ Manual | ✅ First-class |

---

### BrandPlan vs Chakra UI

**When to use BrandPlan:**
- You want lightweight solution
- You're already using Tailwind
- You prefer utility-first
- Bundle size is critical
- You need minimal component set

**When to use Chakra UI:**
- You need full component library (50+ components)
- You prefer component props over utilities
- You want accessibility built-in
- You're okay with larger bundle
- You need complex components (Modal, Menu, etc.)

**Key Differences:**

| Aspect | BrandPlan | Chakra UI |
|--------|-----------|-----------|
| **Bundle size** | 🟢 ~2KB | 🔴 ~200KB |
| **Component count** | 2 | 50+ |
| **Styling** | Utility classes | Component props |
| **Accessibility** | ⚠️ Manual | ✅ Built-in (WAI-ARIA) |
| **Design tokens** | CSS variables | JS theme object |
| **Enforcement** | Build-time | Runtime |
| **Customization** | ⚠️ Strict tokens | ✅ Highly customizable |

**Example:**

BrandPlan:
```tsx
<Button variant="solid" tone="primary" className="w-full">
  Submit
</Button>
```

Chakra:
```tsx
<Button colorScheme="blue" size="md" width="full">
  Submit
</Button>
```

---

### BrandPlan vs shadcn/ui

**These are COMPLEMENTARY, not competitors.**

You can use both together:
- BrandPlan: Enforces brand tokens in YOUR custom components
- shadcn/ui: Provides pre-built components (copy/paste)

**How to combine:**

1. Install both:
   ```bash
   npx brandplan init
   npx shadcn-ui@latest init
   ```

2. Exclude shadcn from enforcement:
   ```javascript
   // eslint.config.mjs
   rules: {
     '@brandplan/brand-classnames-only': [
       'error',
       { ignorePaths: ['**/components/ui/**'] }  // shadcn location
     ],
   }
   ```

3. Use shadcn for complex components, BrandPlan for custom ones:
   ```tsx
   // Use shadcn's complex components as-is
   import { Dialog, DropdownMenu } from '@/components/ui';

   // Use BrandPlan for your custom components
   import { Button, Card } from '@brandplan/ui';
   ```

**Key Differences:**

| Aspect | BrandPlan | shadcn/ui |
|--------|-----------|-----------|
| **Purpose** | Brand enforcement | Component library |
| **Installation** | npm package | Copy/paste code |
| **Components** | 2 (minimal) | 40+ (full) |
| **Enforcement** | ✅ Yes | ❌ No |
| **Customization** | ⚠️ Via tokens | ✅ Edit source directly |
| **Updates** | npm update | Manual re-copy |
| **Ownership** | ⚠️ Package | ✅ Your codebase |

---

### BrandPlan vs Panda CSS

**When to use BrandPlan:**
- You're already using Tailwind
- You prefer utility-first
- You want simpler setup
- You need ESLint enforcement
- Tailwind ecosystem is important

**When to use Panda CSS:**
- You want type-safe styles
- You prefer CSS-in-JS patterns
- You need atomic CSS with zero runtime
- You want generated types
- You're okay with build complexity

**Key Differences:**

| Aspect | BrandPlan | Panda CSS |
|--------|-----------|-----------|
| **Base** | Tailwind v4 | Custom engine |
| **Type safety** | ⚠️ Via TypeScript | ✅ Generated types |
| **Enforcement** | ESLint rules | Static analysis |
| **Styling** | Utility classes | CSS-in-JS + utilities |
| **Setup complexity** | 🟢 Low | 🟡 Medium |
| **Build step** | Minimal | Required |
| **Ecosystem** | Tailwind | Custom |

**Example:**

BrandPlan:
```tsx
<div className="p-brand-4 bg-brand-primary">
  Content
</div>
```

Panda CSS:
```tsx
import { css } from '../styled-system/css';

<div className={css({ p: '4', bg: 'primary' })}>
  Content
</div>
```

---

## Design System Approaches Compared

### 1. Configuration-Based (Tailwind, BrandPlan)

**Pros:**
- Fast development
- Predictable output
- Easy to learn
- Great performance

**Cons:**
- Less flexible
- Harder to do one-offs
- Can feel restrictive

### 2. Component-Based (Chakra, Theme UI)

**Pros:**
- Accessibility built-in
- Consistent API
- Easy theming
- Rich features

**Cons:**
- Larger bundle size
- Runtime overhead
- Vendor lock-in
- Learning curve

### 3. Copy/Paste (shadcn/ui)

**Pros:**
- Full ownership
- Highly customizable
- No abstraction
- No dependencies

**Cons:**
- Manual updates
- No enforcement
- Code duplication
- Maintenance burden

### 4. BrandPlan (Hybrid: Tokens + Enforcement)

**Pros:**
- Best of configuration + enforcement
- Build-time errors
- Tiny bundle
- Tailwind compatible

**Cons:**
- Strict (by design)
- Small component set
- Requires discipline
- Learning curve for tokens

---

## Migration Paths

### From Vanilla Tailwind → BrandPlan

**Effort:** Medium (2-4 hours for small project)

1. Install BrandPlan
2. Define tokens from existing styles
3. Replace utilities with brand-prefixed versions
4. Enable ESLint rules

[See full migration guide](./migration-guide.md)

### From Chakra UI → BrandPlan

**Effort:** High (days to weeks)

1. Replace all Chakra components with Tailwind utilities
2. Extract theme to BrandPlan tokens
3. Rebuild accessibility features
4. Test thoroughly

**Recommendation:** Only if bundle size is critical or you want to move to Tailwind ecosystem.

### From Theme UI → BrandPlan

**Effort:** High (days to weeks)

1. Replace `sx` props with Tailwind utilities
2. Convert theme object to BrandPlan tokens
3. Replace CSS-in-JS with utility classes
4. Update MDX components

**Recommendation:** Only if moving away from CSS-in-JS is a priority.

---

## Decision Matrix

Use this to decide which approach fits your needs:

### Choose BrandPlan if:
- ✅ Brand consistency is critical
- ✅ You're already using Tailwind
- ✅ You have strict design guidelines
- ✅ Multiple developers work on UI
- ✅ You want build-time enforcement
- ✅ Bundle size matters

### Choose Vanilla Tailwind if:
- ✅ Flexibility > consistency
- ✅ Solo developer or tiny team
- ✅ Rapid prototyping
- ✅ No strict brand guidelines
- ❌ Don't need enforcement

### Choose Chakra UI if:
- ✅ Need full component library
- ✅ Accessibility is priority #1
- ✅ Prefer component props
- ❌ Bundle size not a concern
- ✅ Want complex components out of box

### Choose shadcn/ui if:
- ✅ Need components but want ownership
- ✅ Highly custom design system
- ✅ Want to modify source freely
- ⚠️ Can maintain copied code
- ✅ Using Tailwind already

### Choose Panda CSS if:
- ✅ Want type-safe styles
- ✅ Like CSS-in-JS patterns
- ✅ Need atomic CSS with zero runtime
- ⚠️ Okay with complex setup
- ❌ Don't need Tailwind ecosystem

### Combine BrandPlan + shadcn/ui if:
- ✅ Need brand enforcement + rich components
- ✅ Want custom components enforced
- ✅ Okay with shadcn components not enforced
- ✅ Using Tailwind already
- ✅ Best of both worlds

---

## Real-World Use Cases

### Startup Dashboard (BrandPlan ✅)
- Small team (3-5 developers)
- Strict brand guidelines from designer
- Needs consistency across features
- Fast development important
- Small bundle size

### Marketing Website (Vanilla Tailwind ✅)
- Freelancer or agency
- Unique design per page
- Lots of one-off styles
- No need for enforcement
- Speed over consistency

### SaaS Application (BrandPlan + shadcn/ui ✅)
- Medium team (10+ developers)
- Need complex components (Dialogs, Dropdowns)
- Brand consistency critical
- Want enforcement on custom components
- Okay with shadcn components not enforced

### Component Library (Chakra/Theme UI ✅)
- Building reusable library for other teams
- Need full accessibility
- Need documentation
- Bundle size less important
- Want comprehensive component set

---

## Summary

**BrandPlan is best for:**
Teams that value brand consistency over flexibility, already use Tailwind, and want build-time enforcement without the overhead of a full component library.

**BrandPlan is NOT for:**
Projects that need flexibility, one-off custom styles, or a comprehensive component library with complex widgets.

**Combine with shadcn/ui when:**
You need both brand enforcement (for custom components) and rich components (copy/paste from shadcn).

---

## See Also

- [Migration Guide](./migration-guide.md) - How to migrate from Tailwind
- [API Reference](./api-reference.md) - Full API documentation
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
