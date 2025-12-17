import { describe, it } from 'vitest';
import { RuleTester } from 'eslint';
import rule from './brand-margin-policy.js';

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

describe('brand-margin-policy', () => {
  it('should enforce margin utilities only on semantic elements', () => {
    ruleTester.run('brand-margin-policy', rule, {
      valid: [
        // Semantic elements with margin - allowed
        { code: '<main className="m-brand-4" />' },
        { code: '<header className="m-brand-4" />' },
        { code: '<footer className="m-brand-4" />' },
        { code: '<main className="mx-brand-2" />' },
        { code: '<header className="my-brand-4" />' },
        { code: '<footer className="mt-brand-2" />' },
        { code: '<main className="mr-brand-4" />' },
        { code: '<header className="mb-brand-2" />' },
        { code: '<footer className="ml-brand-4" />' },

        // Semantic elements with margin + other classes - allowed
        { code: '<header className="mr-brand-2 px-brand-4" />' },
        { code: '<footer className="mb-brand-2 grid gap-brand-4" />' },
        { code: '<main className="m-brand-4 flex items-center" />' },

        // Non-semantic elements without margin - allowed
        { code: '<div className="p-brand-4" />' },
        { code: '<div className="flex gap-brand-2" />' },
        { code: '<Card className="p-brand-4 rounded-brand-md" />' },
        { code: '<button className="px-brand-4 py-brand-2" />' },

        // No className - allowed
        { code: '<div />' },
        { code: '<main />' },

        // Section with allowSection: true
        {
          code: '<section className="m-brand-2" />',
          options: [{ allowSection: true }],
        },
        {
          code: '<section className="mx-brand-4 my-brand-2" />',
          options: [{ allowSection: true }],
        },

        // Complex expressions without margin
        { code: '<div className={cn("flex", "p-brand-4")} />' },
        { code: '<div className={`flex ${active && "bg-brand-primary"}`} />' },
        { code: '<Card className={clsx("p-brand-4", ["rounded-brand-md"])} />' },
      ],

      invalid: [
        // Div with margin - not allowed
        {
          code: '<div className="m-brand-4" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className="mx-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className="my-brand-4" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className="mt-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className="mr-brand-4" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className="mb-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className="ml-brand-4" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Component with margin - not allowed
        {
          code: '<Card className="m-brand-4" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<Button className="mt-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Margin with other classes - still not allowed on div
        {
          code: '<div className="m-brand-4 flex gap-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className="px-brand-4 mt-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Section without allowSection option
        {
          code: '<section className="m-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<section className="mx-brand-4" />',
          options: [{ allowSection: false }],
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Complex expressions with margin - cn()
        {
          code: '<div className={cn("flex", "m-brand-4")} />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<div className={cn("p-brand-4", isActive && "mt-brand-2")} />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Template literals with margin
        {
          code: '<div className={`flex ${active ? "m-brand-4" : "m-brand-2"}`} />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<Card className={`p-brand-4 mb-brand-2`} />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Array expressions (clsx style)
        {
          code: '<div className={clsx(["flex", "m-brand-4"])} />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Logical expressions
        {
          code: '<div className={isActive && "m-brand-4"} />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<Button className={hasMargin ? "mt-brand-2" : "mb-brand-2"} />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },

        // Multiple margin classes
        {
          code: '<div className="mx-brand-4 my-brand-2" />',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
      ],
    });
  });

  it('should skip files matching ignorePaths patterns', () => {
    ruleTester.run('brand-margin-policy with ignorePaths', rule, {
      valid: [
        // Violations should be ignored for matching paths
        {
          code: '<div className="m-brand-4" />',
          options: [{ ignorePaths: ['**/components/ui/**'] }],
          filename: '/project/components/ui/button.tsx',
        },
        {
          code: '<Card className="mt-brand-2 mb-brand-4" />',
          options: [{ ignorePaths: ['src/components/ui/**'] }],
          filename: '/project/src/components/ui/card.tsx',
        },
        {
          code: '<div className={cn("flex", "m-brand-4")} />',
          options: [{ ignorePaths: ['**/*.shadcn.tsx'] }],
          filename: '/project/src/button.shadcn.tsx',
        },
      ],

      invalid: [
        // Violations should NOT be ignored for non-matching paths
        {
          code: '<div className="m-brand-4" />',
          options: [{ ignorePaths: ['**/components/ui/**'] }],
          filename: '/project/components/Button.tsx',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        {
          code: '<Card className="mt-brand-2" />',
          options: [{ ignorePaths: ['src/components/ui/**'] }],
          filename: '/project/src/pages/index.tsx',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        // Empty ignorePaths should not skip any files
        {
          code: '<div className="m-brand-4" />',
          options: [{ ignorePaths: [] }],
          filename: '/project/components/ui/button.tsx',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
        // <input> filename should NOT be ignored even with ignorePaths
        {
          code: '<div className="m-brand-4 mt-brand-2" />',
          options: [{ ignorePaths: ['**/*'] }],
          filename: '<input>',
          errors: [{ messageId: 'marginOnNonSemanticElement' }],
        },
      ],
    });
  });
});
