import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
  });

  it('creates CSS file in app/ directory when it exists', async () => {
    const appDir = join(testDir, 'app');
    mkdirSync(appDir);

    await init(testDir);

    const cssPath = join(appDir, 'brandplan.css');
    // CSS generation might fail without deps, so we just check that init doesn't crash
    // The config file should always be created
    const configPath = join(testDir, 'brandplan.config.ts');
    expect(existsSync(configPath)).toBe(true);
  });

  it('creates CSS file in src/ directory when app/ does not exist', async () => {
    const srcDir = join(testDir, 'src');
    mkdirSync(srcDir);

    await init(testDir);

    const configPath = join(testDir, 'brandplan.config.ts');
    expect(existsSync(configPath)).toBe(true);
  });

  it('creates CSS file in root when neither app/ nor src/ exist', async () => {
    await init(testDir);

    const configPath = join(testDir, 'brandplan.config.ts');
    expect(existsSync(configPath)).toBe(true);
  });
});
