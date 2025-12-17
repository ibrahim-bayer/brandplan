import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { getCssOutputPath, getConfigPath } from './utils.js';

describe('getCssOutputPath', () => {
  const testDir = join(process.cwd(), 'test-temp');

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

  it('returns app/brandplan.css when app/ exists', () => {
    const appDir = join(testDir, 'app');
    mkdirSync(appDir);

    const result = getCssOutputPath(testDir);
    expect(result).toBe(join(testDir, 'app', 'brandplan.css'));
  });

  it('returns src/brandplan.css when src/ exists but app/ does not', () => {
    const srcDir = join(testDir, 'src');
    mkdirSync(srcDir);

    const result = getCssOutputPath(testDir);
    expect(result).toBe(join(testDir, 'src', 'brandplan.css'));
  });

  it('returns ./brandplan.css when neither app/ nor src/ exist', () => {
    const result = getCssOutputPath(testDir);
    expect(result).toBe(join(testDir, 'brandplan.css'));
  });

  it('prefers app/ over src/ when both exist', () => {
    const appDir = join(testDir, 'app');
    const srcDir = join(testDir, 'src');
    mkdirSync(appDir);
    mkdirSync(srcDir);

    const result = getCssOutputPath(testDir);
    expect(result).toBe(join(testDir, 'app', 'brandplan.css'));
  });
});

describe('getConfigPath', () => {
  it('returns brandplan.config.ts in the given directory', () => {
    const testDir = '/test/path';
    const result = getConfigPath(testDir);
    expect(result).toBe('/test/path/brandplan.config.ts');
  });
});
