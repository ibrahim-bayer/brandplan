/**
 * This file intentionally violates BrandPlan rules to demonstrate ESLint enforcement.
 * It is NOT imported or used at runtime - only checked by linting.
 *
 * Run `pnpm lint` to see the violations caught by @brandplan/eslint-plugin.
 */

import { Button, Card } from '@brandplan/ui';

export function BadExamples() {
  return (
    <div>
      {/* ❌ VIOLATION: Non-brand spacing utilities */}
      <div className="p-4 m-2">
        Should use p-brand-4 and m-brand-* only on semantic elements
      </div>

      {/* ❌ VIOLATION: Non-brand radius */}
      <div className="rounded-lg">
        Should use rounded-brand-lg
      </div>

      {/* ❌ VIOLATION: Non-brand colors */}
      <div className="bg-white text-black border-gray-300">
        Should use bg-brand-*, text-brand-*, border-brand-*
      </div>

      {/* ❌ VIOLATION: Margin on non-semantic element */}
      <div className="m-brand-4">
        Margin only allowed on main, header, footer
      </div>

      {/* ❌ VIOLATION: Margin on component */}
      <Card className="mt-brand-2">
        No margin on components
      </Card>

      {/* ❌ VIOLATION: Multiple violations */}
      <Button className="p-4 rounded-lg bg-slate-100 m-brand-2">
        Multiple violations: p-4, rounded-lg, bg-slate-100, m-brand-2
      </Button>

      {/* ✅ CORRECT: This would pass */}
      <main className="m-brand-4">
        <Card padding="md" className="flex gap-brand-2">
          Margin on semantic element, gap instead of margin in components
        </Card>
      </main>
    </div>
  );
}
