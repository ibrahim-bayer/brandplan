import { writeFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { mkdirSync } from 'fs';
import { createJiti } from 'jiti';
import { getConfigPath, getCssOutputPath } from './utils.js';
import { getCssHeader } from './templates.js';
import { brandPlanToCss } from '@brandplan/core';

export interface BuildOptions {
  out?: string;
}

export async function build(
  cwd: string = process.cwd(),
  options: BuildOptions = {}
): Promise<void> {
  const configPath = getConfigPath(cwd);

  // Check if config exists
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}\n\nRun "npx brandplan init" to create one.`);
  }

  // Load config using jiti (supports TypeScript)
  const jiti = createJiti(cwd, {
    interopDefault: true,
    moduleCache: false,
  });

  const plan = jiti(configPath);

  if (!plan) {
    throw new Error('Config must export a default BrandPlan object');
  }

  // Generate CSS (validation happens inside brandPlanToCss via defineBrandPlan)
  const css = brandPlanToCss(plan);
  const output = getCssHeader() + css;

  // Determine output path
  const outputPath = options.out || getCssOutputPath(cwd);

  // Ensure directory exists
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Write CSS file
  writeFileSync(outputPath, output);
  console.log(`✓ Generated ${outputPath}`);
}
