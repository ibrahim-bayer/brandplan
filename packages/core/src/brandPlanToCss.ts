import type { BrandPlan } from './types.js';

interface CssVariable {
  name: string;
  darkValue: string;
  lightValue?: string;
}

export function brandPlanToCss(plan: BrandPlan): string {
  const variables: CssVariable[] = [];

  const spaceKeys = Object.keys(plan.space).sort();
  for (const key of spaceKeys) {
    variables.push({
      name: `--brand-space-${key}`,
      darkValue: plan.space[key],
    });
  }

  const radiusKeys = Object.keys(plan.radius).sort();
  for (const key of radiusKeys) {
    variables.push({
      name: `--brand-radius-${key}`,
      darkValue: plan.radius[key],
    });
  }

  const colorGroups = Object.keys(plan.color).sort();
  for (const group of colorGroups) {
    const tokenKeys = Object.keys(plan.color[group]).sort();
    for (const tokenKey of tokenKeys) {
      const { dark, light } = plan.color[group][tokenKey];
      variables.push({
        name: `--brand-color-${group}-${tokenKey}`,
        darkValue: dark,
        lightValue: light,
      });
    }
  }

  const rootDeclarations = variables
    .map((v) => `  ${v.name}: ${v.darkValue};`)
    .join('\n');

  const lightDeclarations = variables
    .filter((v) => v.lightValue !== undefined)
    .map((v) => `  ${v.name}: ${v.lightValue};`)
    .join('\n');

  let css = '@import "tailwindcss";\n\n';
  css += ':root {\n';
  css += '  color-scheme: dark;\n';
  css += rootDeclarations + '\n';
  css += '}\n\n';
  css += '[data-theme="light"] {\n';
  css += '  color-scheme: light;\n';
  css += lightDeclarations + '\n';
  css += '}\n';

  return css;
}
