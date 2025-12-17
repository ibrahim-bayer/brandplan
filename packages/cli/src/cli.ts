#!/usr/bin/env node
import { Command } from 'commander';
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
    await init(process.cwd());
  });

program
  .command('build')
  .description('Generate CSS from brandplan.config.ts')
  .option('--out <path>', 'Output path for generated CSS')
  .action(async (options) => {
    await build(process.cwd(), options);
  });

program.parse();
