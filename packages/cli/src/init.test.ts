import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { init } from './init.js';

describe('init', () => {
  const testDir = join(process.cwd(), 'test-temp-init');

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

  it('creates brandplan.config.ts when missing', async () => {
    await init(testDir);

    const configPath = join(testDir, 'brandplan.config.ts');
    expect(existsSync(configPath)).toBe(true);

    const config = readFileSync(configPath, 'utf-8');
    expect(config).toContain('defineBrandPlan');
    expect(config).toContain('space:');
    expect(config).toContain('radius:');
    expect(config).toContain('color:');

    // Also check that CSS was generated
    const cssPath = join(testDir, 'brandplan.css');
    expect(existsSync(cssPath)).toBe(true);

    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
  });

  it('does not overwrite existing config', async () => {
    const configPath = join(testDir, 'brandplan.config.ts');
    const existingContent = '// existing config';

    // Write existing config
    const { writeFileSync } = await import('fs');
    writeFileSync(configPath, existingContent);

    // Run init
    await init(testDir);

    // Config should not be overwritten
    const config = readFileSync(configPath, 'utf-8');
    expect(config).toBe(existingContent);

    // CSS should NOT be generated when config already exists
    const cssPath = join(testDir, 'brandplan.css');
    expect(existsSync(cssPath)).toBe(false);
  });

  it('creates CSS file in app/ directory when it exists', async () => {
    const appDir = join(testDir, 'app');
    mkdirSync(appDir);

    await init(testDir);

    const configPath = join(testDir, 'brandplan.config.ts');
    expect(existsSync(configPath)).toBe(true);

    const cssPath = join(appDir, 'brandplan.css');
    expect(existsSync(cssPath)).toBe(true);

    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
  });

  it('creates CSS file in src/ directory when app/ does not exist', async () => {
    const srcDir = join(testDir, 'src');
    mkdirSync(srcDir);

    await init(testDir);

    const configPath = join(testDir, 'brandplan.config.ts');
    expect(existsSync(configPath)).toBe(true);

    const cssPath = join(srcDir, 'brandplan.css');
    expect(existsSync(cssPath)).toBe(true);

    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
  });

  it('creates CSS file in root when neither app/ nor src/ exist', async () => {
    await init(testDir);

    const configPath = join(testDir, 'brandplan.config.ts');
    expect(existsSync(configPath)).toBe(true);

    const cssPath = join(testDir, 'brandplan.css');
    expect(existsSync(cssPath)).toBe(true);

    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
  });

  it('prints correct import path for app/ directory', async () => {
    const appDir = join(testDir, 'app');
    mkdirSync(appDir);

    const consoleSpy = vi.spyOn(console, 'log');
    await init(testDir);

    const output = consoleSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(output).toContain("import './brandplan.css';");
    expect(output).not.toContain("import './app/brandplan.css';");

    consoleSpy.mockRestore();
  });

  it('prints correct import path for src/ directory', async () => {
    const srcDir = join(testDir, 'src');
    mkdirSync(srcDir);

    const consoleSpy = vi.spyOn(console, 'log');
    await init(testDir);

    const output = consoleSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(output).toContain("import './brandplan.css';");
    expect(output).not.toContain("import './src/brandplan.css';");

    consoleSpy.mockRestore();
  });

  it('prints correct import path for root directory', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    await init(testDir);

    const output = consoleSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(output).toContain("import '../brandplan.css';");

    consoleSpy.mockRestore();
  });
});
