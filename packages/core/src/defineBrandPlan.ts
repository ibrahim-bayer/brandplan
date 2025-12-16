import type { BrandPlan } from './types.js';
import { validateBrandPlan } from './validation.js';

export function defineBrandPlan(plan: unknown): BrandPlan {
  validateBrandPlan(plan);

  return {
    space: { ...plan.space },
    radius: { ...plan.radius },
    color: structuredClone(plan.color),
  };
}
