import { describe, it } from 'vitest';
import { RuleTester } from 'eslint';
import rule from './brand-classnames-only.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

describe('brand-classnames-only', () => {
  it('should pass valid cases and fail invalid cases', () => {
    ruleTester.run('brand-classnames-only', rule, {
      valid: [
        // Layout utilities (allowed)
        { code: '<div className="flex" />' },
        { code: '<div className="grid" />' },
        { code: '<div className="flex items-center justify-between" />' },
        { code: '<div className="w-full max-w-md mx-auto" />' },
        { code: '<div className="h-screen" />' },
        { code: '<div className="relative z-10" />' },
        { code: '<div className="hidden md:block" />' },
        { code: '<div className="overflow-hidden" />' },
        { code: '<div className="cursor-pointer" />' },
        { code: '<div className="transition duration-200" />' },

        // Brand-prefixed utilities (allowed)
        { code: '<div className="p-brand-4" />' },
        { code: '<div className="px-brand-2 py-brand-1" />' },
        { code: '<div className="m-brand-4" />' },
        { code: '<div className="gap-brand-2" />' },
        { code: '<div className="rounded-brand-md" />' },
        { code: '<div className="bg-brand-surface-0" />' },
        { code: '<div className="text-brand-text-primary" />' },
        { code: '<div className="border-brand-surface-1" />' },
        { code: '<div className="ring-brand-brand-primary" />' },
        { code: '<div className="shadow-brand-sm" />' },

        // Mixed (layout + brand)
        { code: '<div className="flex gap-brand-2 p-brand-4 rounded-brand-md bg-brand-surface-0" />' },
        { code: '<div className="w-full max-w-2xl mx-auto p-brand-6" />' },

        // Template literals with brand utilities
        { code: '<div className={`flex ${isActive ? "bg-brand-brand-primary" : "bg-brand-surface-0"}`} />' },

        // Text size utilities (allowed as they're structural)
        { code: '<div className="text-xs" />' },
        { code: '<div className="text-sm" />' },
        { code: '<div className="text-base" />' },
        { code: '<div className="text-lg" />' },
        { code: '<div className="text-xl" />' },
        { code: '<div className="text-2xl" />' },
        { code: '<div className="text-3xl" />' },
        { code: '<div className="text-4xl" />' },
        { code: '<div className="text-brand-md" />' },
      ],

      invalid: [
        // Non-brand padding
        {
          code: '<div className="p-4" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="px-2" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="py-6" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },

        // Non-brand margin
        {
          code: '<div className="m-4" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="mt-2" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },

        // Non-brand gap/space
        {
          code: '<div className="gap-4" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="space-x-2" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },

        // Non-brand radius
        {
          code: '<div className="rounded-lg" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="rounded-md" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },

        // Non-brand colors
        {
          code: '<div className="bg-slate-100" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="text-white" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="text-zinc-200" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="border-gray-300" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },

        // Non-brand shadow
        {
          code: '<div className="shadow-md" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },

        // Multiple violations
        {
          code: '<div className="p-4 rounded-lg bg-white" />',
          errors: [
            { messageId: 'forbiddenClass' },
            { messageId: 'forbiddenClass' },
            { messageId: 'forbiddenClass' },
          ],
        },

        // Mixed valid and invalid
        {
          code: '<div className="flex p-4 items-center" />',
          errors: [{ messageId: 'forbiddenClass' }],
        },

        // Template literal with forbidden class
        {
          code: '<div className={`flex p-4 gap-2`} />',
          errors: [
            { messageId: 'forbiddenClass' },
            { messageId: 'forbiddenClass' },
          ],
        },
      ],
    });
  });

  it('should skip files matching ignorePaths patterns', () => {
    ruleTester.run('brand-classnames-only with ignorePaths', rule, {
      valid: [
        // Violations should be ignored for matching paths
        {
          code: '<div className="p-4 rounded-lg bg-white" />',
          options: [{ ignorePaths: ['**/components/ui/**'] }],
          filename: '/project/components/ui/button.tsx',
        },
        {
          code: '<div className="m-2 bg-slate-100" />',
          options: [{ ignorePaths: ['src/components/ui/**'] }],
          filename: '/project/src/components/ui/card.tsx',
        },
        {
          code: '<div className="p-4" />',
          options: [{ ignorePaths: ['**/*.ignore.tsx'] }],
          filename: '/project/src/test.ignore.tsx',
        },
      ],

      invalid: [
        // Violations should NOT be ignored for non-matching paths
        {
          code: '<div className="p-4" />',
          options: [{ ignorePaths: ['**/components/ui/**'] }],
          filename: '/project/components/Button.tsx',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        {
          code: '<div className="rounded-lg" />',
          options: [{ ignorePaths: ['src/components/ui/**'] }],
          filename: '/project/src/pages/index.tsx',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        // Empty ignorePaths should not skip any files
        {
          code: '<div className="p-4" />',
          options: [{ ignorePaths: [] }],
          filename: '/project/components/ui/button.tsx',
          errors: [{ messageId: 'forbiddenClass' }],
        },
        // <input> filename should NOT be ignored even with ignorePaths
        {
          code: '<div className="p-4 bg-white" />',
          options: [{ ignorePaths: ['**/*'] }],
          filename: '<input>',
          errors: [
            { messageId: 'forbiddenClass' },
            { messageId: 'forbiddenClass' },
          ],
        },
      ],
    });
  });
});
