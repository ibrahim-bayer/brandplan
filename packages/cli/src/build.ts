import { writeFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { mkdirSync } from 'fs';
import { getConfigPath, getCssOutputPath } from './utils.js';
import { getCssHeader } from './templates.js';
import { brandPlanToCss, BrandPlanValidationError } from '@brandplan/core';

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
    console.error(`❌ Config file not found: ${configPath}`);
    console.log('\nRun "npx brandplan init" to create one.');
    process.exit(1);
  }

  try {
    // Import the config using tsx runtime
    // tsx is already loaded as part of the CLI execution
    const configModule = await import(configPath);
    const plan = configModule.default;

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
  } catch (error) {
    if (error instanceof BrandPlanValidationError) {
      console.error(`\n❌ Validation error in ${configPath}:`);
      console.error(error.message);
      process.exit(1);
    } else {
      console.error(`\n❌ Failed to build:`);
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }
}
