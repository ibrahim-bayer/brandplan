import { writeFileSync, existsSync } from 'fs';
import { dirname, relative, basename, join } from 'path';
import { mkdirSync } from 'fs';
import { createJiti } from 'jiti';
import { getConfigPath, getCssOutputPath } from './utils.js';
import { configTemplate, getCssHeader } from './templates.js';
import { brandPlanToCss } from '@brandplan/core';

export async function init(cwd: string = process.cwd()): Promise<void> {
  const configPath = getConfigPath(cwd);
  const cssPath = getCssOutputPath(cwd);

  let configCreated = false;

  // Create config file if it doesn't exist
  if (existsSync(configPath)) {
    console.log(`⚠️  ${configPath} already exists, skipping...`);
  } else {
    writeFileSync(configPath, configTemplate);
    console.log(`✓ Created ${configPath}`);
    configCreated = true;
  }

  // Only generate CSS if we created a new config file
  // If config already exists, user should run `brandplan build` manually
  if (!configCreated) {
    console.log(`\nRun 'npx brandplan build' to generate CSS from your existing config.`);
    return;
  }

  // Generate initial CSS file using jiti
  const jiti = createJiti(cwd, {
    interopDefault: true,
    moduleCache: false,
  });

  const plan = jiti(configPath);

  if (!plan) {
    throw new Error('Config must export a default BrandPlan object');
  }

  // Generate CSS
  const css = brandPlanToCss(plan);
  const output = getCssHeader() + css;

  // Ensure directory exists
  const cssDir = dirname(cssPath);
  if (!existsSync(cssDir)) {
    mkdirSync(cssDir, { recursive: true });
  }

  // Write CSS file
  writeFileSync(cssPath, output);
  console.log(`✓ Generated ${cssPath}`);

  // Print next steps with actual CSS path
  // Calculate import path relative to where layout.tsx would be
  const cssDirName = basename(cssDir);

  let cssImportPath: string;
  if (cssDirName === 'app' || cssDirName === 'src') {
    // CSS is in app/ or src/, so import is relative to same directory
    cssImportPath = `./${basename(cssPath)}`;
  } else {
    // CSS is in root, calculate path from app/ directory
    const appDir = join(cwd, 'app');
    const srcDir = join(cwd, 'src');
    const layoutDir = existsSync(appDir) ? appDir : (existsSync(srcDir) ? srcDir : appDir);
    cssImportPath = relative(layoutDir, cssPath);
    if (!cssImportPath.startsWith('.')) {
      cssImportPath = `./${cssImportPath}`;
    }
  }

  console.log('\n📝 Next steps:\n');
  console.log('1. Install dependencies:');
  console.log('   npm install @brandplan/core @brandplan/ui');
  console.log('   # or');
  console.log('   pnpm add @brandplan/core @brandplan/ui\n');
  console.log('2. Import CSS in your Next.js layout (app/layout.tsx):');
  console.log(`   import '@brandplan/ui/styles.css';`);
  console.log(`   import '${cssImportPath}';\n`);
  console.log('3. Use BrandPlan components:');
  console.log(`   import { Button, Card } from '@brandplan/ui';\n`);
  console.log('4. Rebuild CSS after config changes:');
  console.log('   npx brandplan build\n');
}
