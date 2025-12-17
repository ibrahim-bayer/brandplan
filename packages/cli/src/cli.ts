#!/usr/bin/env node
import { Command } from 'commander';
import { BrandPlanValidationError } from '@brandplan/core';
import { init } from './init.js';
import { build } from './build.js';

const program = new Command();

program
  .name('brandplan')
  .description('BrandPlan CLI - Scaffold and build brand token CSS')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize BrandPlan in the current project')
  .action(async () => {
    try {
      await init(process.cwd());
    } catch (error) {
      if (error instanceof BrandPlanValidationError) {
        console.error(`\n❌ Validation error in brandplan.config.ts:`);
        console.error(error.message);
      } else {
        console.error(`\n❌ Failed to initialize:`);
        console.error(error instanceof Error ? error.message : String(error));
      }
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Generate CSS from brandplan.config.ts')
  .option('--out <path>', 'Output path for generated CSS')
  .action(async (options) => {
    try {
      await build(process.cwd(), options);
    } catch (error) {
      if (error instanceof BrandPlanValidationError) {
        console.error(`\n❌ Validation error in brandplan.config.ts:`);
        console.error(error.message);
      } else {
        console.error(`\n❌ Failed to build:`);
        console.error(error instanceof Error ? error.message : String(error));
      }
      process.exit(1);
    }
  });

program.parse();
