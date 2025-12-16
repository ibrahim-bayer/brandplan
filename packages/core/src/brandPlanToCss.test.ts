import { describe, it, expect } from 'vitest';
import { brandPlanToCss } from './brandPlanToCss.js';
import { defineBrandPlan } from './defineBrandPlan.js';

const samplePlan = defineBrandPlan({
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

describe('brandPlanToCss', () => {
  it('generates CSS with @import at the top', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toMatch(/^@import "tailwindcss";/);
  });

  it('generates @theme block at top-level', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toContain('@theme {');

    // Verify @theme appears after @import but before other blocks
    const importIndex = css.indexOf('@import');
    const themeIndex = css.indexOf('@theme');
    const rootIndex = css.indexOf(':root');

    expect(importIndex).toBeLessThan(themeIndex);
    expect(themeIndex).toBeLessThan(rootIndex);
  });

  it('maps color tokens to theme variables in @theme block', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toContain('--color-brand-surface-0: var(--brand-color-surface-0);');
    expect(css).toContain('--color-brand-surface-1: var(--brand-color-surface-1);');
    expect(css).toContain('--color-brand-text-primary: var(--brand-color-text-primary);');
    expect(css).toContain('--color-brand-text-secondary: var(--brand-color-text-secondary);');
  });

  it('maps radius tokens to theme variables in @theme block', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toContain('--radius-brand-sm: var(--brand-radius-sm);');
    expect(css).toContain('--radius-brand-md: var(--brand-radius-md);');
    expect(css).toContain('--radius-brand-lg: var(--brand-radius-lg);');
  });

  it('does not generate spacing theme variables', () => {
    const css = brandPlanToCss(samplePlan);
    const themeBlock = css.split('@theme {')[1]?.split('}')[0];
    expect(themeBlock).not.toContain('--spacing-');
    expect(themeBlock).not.toContain('--space-brand-');
  });

  it('generates @custom-variant dark for data-theme support', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toContain('@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));');
  });

  it('generates :root block with dark values', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toContain(':root {');
    expect(css).toContain('color-scheme: dark;');
    expect(css).toContain('--brand-space-2: 0.5rem;');
    expect(css).toContain('--brand-space-4: 1rem;');
    expect(css).toContain('--brand-radius-sm: 0.25rem;');
    expect(css).toContain('--brand-color-surface-0: #0b0f17;');
    expect(css).toContain('--brand-color-text-primary: #ffffff;');
  });

  it('generates [data-theme="light"] block with light values', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toContain('[data-theme="light"] {');
    expect(css).toContain('color-scheme: light;');
    expect(css).toContain('--brand-color-surface-0: #ffffff;');
    expect(css).toContain('--brand-color-text-primary: #0f172a;');
  });

  it('does not include space/radius in light theme block', () => {
    const css = brandPlanToCss(samplePlan);
    const lightBlock = css.split('[data-theme="light"]')[1];
    expect(lightBlock).not.toContain('--brand-space-');
    expect(lightBlock).not.toContain('--brand-radius-');
  });

  it('maintains stable ordering (sorted)', () => {
    const css = brandPlanToCss(samplePlan);
    const lines = css.split('\n');

    const spaceIndex2 = lines.findIndex((l) => l.includes('--brand-space-2'));
    const spaceIndex4 = lines.findIndex((l) => l.includes('--brand-space-4'));
    const spaceIndex6 = lines.findIndex((l) => l.includes('--brand-space-6'));
    expect(spaceIndex2).toBeLessThan(spaceIndex4);
    expect(spaceIndex4).toBeLessThan(spaceIndex6);

    const radiusLg = lines.findIndex((l) => l.includes('--brand-radius-lg'));
    const radiusMd = lines.findIndex((l) => l.includes('--brand-radius-md'));
    const radiusSm = lines.findIndex((l) => l.includes('--brand-radius-sm'));
    expect(radiusLg).toBeLessThan(radiusMd);
    expect(radiusMd).toBeLessThan(radiusSm);

    const surface0 = lines.findIndex((l) => l.includes('--brand-color-surface-0') && l.includes('#0b0f17'));
    const surface1 = lines.findIndex((l) => l.includes('--brand-color-surface-1') && l.includes('#111827'));
    expect(surface0).toBeLessThan(surface1);
  });

  it('generates deterministic output (snapshot)', () => {
    const css = brandPlanToCss(samplePlan);
    expect(css).toMatchSnapshot();
  });

  it('handles minimal plan', () => {
    const minimalPlan = defineBrandPlan({
      space: { '4': '1rem' },
      radius: { md: '0.5rem' },
      color: {
        text: {
          primary: { dark: '#fff', light: '#000' },
        },
      },
    });
    const css = brandPlanToCss(minimalPlan);
    expect(css).toContain('@import "tailwindcss";');
    expect(css).toContain('@theme {');
    expect(css).toContain('@custom-variant dark');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="light"] {');
    expect(css).toContain('--brand-space-4: 1rem;');
    expect(css).toContain('--brand-radius-md: 0.5rem;');
    expect(css).toContain('--brand-color-text-primary: #fff;');
    expect(css).toContain('--brand-color-text-primary: #000;');
    expect(css).toContain('--color-brand-text-primary: var(--brand-color-text-primary);');
    expect(css).toContain('--radius-brand-md: var(--brand-radius-md);');
  });
});
