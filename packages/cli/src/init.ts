import { writeFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { mkdirSync } from 'fs';
import { getConfigPath, getCssOutputPath } from './utils.js';
import { configTemplate, getCssHeader } from './templates.js';
import { brandPlanToCss } from '@brandplan/core';

export async function init(cwd: string = process.cwd()): Promise<void> {
  const configPath = getConfigPath(cwd);
  const cssPath = getCssOutputPath(cwd);

  // Create config file if it doesn't exist
  if (existsSync(configPath)) {
    console.log(`⚠️  ${configPath} already exists, skipping...`);
  } else {
    writeFileSync(configPath, configTemplate);
    console.log(`✓ Created ${configPath}`);
  }

  // Generate initial CSS file
  try {
    // Import the config using tsx runtime
    const configModule = await import(configPath);
    const plan = configModule.default;

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
  } catch (error) {
    console.error('Failed to generate initial CSS:', error);
    console.log(`\nRun 'npx brandplan build' after installing dependencies.`);
  }

  // Print next steps
  console.log('\n📝 Next steps:\n');
  console.log('1. Install dependencies:');
  console.log('   npm install @brandplan/core @brandplan/ui');
  console.log('   # or');
  console.log('   pnpm add @brandplan/core @brandplan/ui\n');
  console.log('2. Import CSS in your Next.js layout (app/layout.tsx):');
  console.log(`   import '@brandplan/ui/styles.css';`);
  console.log(`   import './brandplan.css';\n`);
  console.log('3. Use BrandPlan components:');
  console.log(`   import { Button, Card } from '@brandplan/ui';\n`);
  console.log('4. Rebuild CSS after config changes:');
  console.log('   npx brandplan build\n');
}
