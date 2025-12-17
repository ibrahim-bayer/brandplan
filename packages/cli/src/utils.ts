import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Determine the output CSS file path based on project structure
 */
export function getCssOutputPath(cwd: string): string {
  const appDir = join(cwd, 'app');
  const srcDir = join(cwd, 'src');

  if (existsSync(appDir)) {
    return join(appDir, 'brandplan.css');
  } else if (existsSync(srcDir)) {
    return join(srcDir, 'brandplan.css');
  } else {
    return join(cwd, 'brandplan.css');
  }
}

/**
 * Get the config file path
 */
export function getConfigPath(cwd: string): string {
  return join(cwd, 'brandplan.config.ts');
}
