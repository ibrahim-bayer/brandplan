import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { build } from './build.js';

describe('build', () => {
  const testDir = join(process.cwd(), 'test-temp-build');

  beforeEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir);
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('generates CSS file from valid config', async () => {
    // Create a valid config file
    const configContent = `
import { defineBrandPlan } from '@brandplan/core';

export default defineBrandPlan({
  space: { '2': '0.5rem', '4': '1rem' },
  radius: { sm: '0.25rem', md: '0.5rem' },
  color: {
    brand: {
      primary: { dark: '#3b82f6', light: '#2563eb' },
    },
    surface: {
      '0': { dark: '#000000', light: '#ffffff' },
    },
    text: {
      primary: { dark: '#ffffff', light: '#000000' },
    },
  },
});
`;
    writeFileSync(join(testDir, 'brandplan.config.ts'), configContent);

    // Run build
    await build(testDir);

    // Check that CSS was generated
    const cssPath = join(testDir, 'brandplan.css');
    expect(existsSync(cssPath)).toBe(true);

    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain('BrandPlan Generated CSS');
    expect(css).toContain('@import "tailwindcss"');
    expect(css).toContain('--brand-space-2: 0.5rem');
    expect(css).toContain('--brand-radius-sm: 0.25rem');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
  });

  it('respects --out option', async () => {
    // Create a valid config file
    const configContent = `
import { defineBrandPlan } from '@brandplan/core';

export default defineBrandPlan({
  space: { '2': '0.5rem' },
  radius: { sm: '0.25rem' },
  color: {
    brand: { primary: { dark: '#000', light: '#fff' } },
    surface: { '0': { dark: '#000', light: '#fff' } },
    text: { primary: { dark: '#fff', light: '#000' } },
  },
});
`;
    writeFileSync(join(testDir, 'brandplan.config.ts'), configContent);

    // Run build with custom output
    const customOut = join(testDir, 'custom', 'output.css');
    await build(testDir, { out: customOut });

    // Check that CSS was generated at custom path
    expect(existsSync(customOut)).toBe(true);

    const css = readFileSync(customOut, 'utf-8');
    expect(css).toContain('BrandPlan Generated CSS');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
  });

  it('creates output directory if it does not exist', async () => {
    // Create a valid config file
    const configContent = `
import { defineBrandPlan } from '@brandplan/core';

export default defineBrandPlan({
  space: { '2': '0.5rem' },
  radius: { sm: '0.25rem' },
  color: {
    brand: { primary: { dark: '#000', light: '#fff' } },
    surface: { '0': { dark: '#000', light: '#fff' } },
    text: { primary: { dark: '#fff', light: '#000' } },
  },
});
`;
    writeFileSync(join(testDir, 'brandplan.config.ts'), configContent);

    // Create app directory
    const appDir = join(testDir, 'app');
    mkdirSync(appDir);

    // Run build
    await build(testDir);

    // Check that CSS was generated
    const cssPath = join(appDir, 'brandplan.css');
    expect(existsSync(cssPath)).toBe(true);

    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
  });
});
