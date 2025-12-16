import type { BrandPlan } from './types.js';

const CSS_LENGTH_REGEX = /^(0|[0-9]+(\.[0-9]+)?(px|rem|em|%|vh|vw|vmin|vmax|ch|ex))$/;
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export class BrandPlanValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrandPlanValidationError';
  }
}

function validateCssLength(value: string, path: string): void {
  if (typeof value !== 'string' || value === '') {
    throw new BrandPlanValidationError(
      `${path}: expected a non-empty string, got ${typeof value}`
    );
  }
  // Explicitly reject any whitespace in length values
  if (/\s/.test(value)) {
    throw new BrandPlanValidationError(
      `${path}: "${value}" contains whitespace (must be a valid CSS length like 0.5rem, not "0.5 rem")`
    );
  }
  if (!CSS_LENGTH_REGEX.test(value)) {
    throw new BrandPlanValidationError(
      `${path}: "${value}" is not a valid CSS length (expected 0 or a value like 1rem, 8px, 50%, etc.)`
    );
  }
}

function validateHexColor(value: string, path: string): void {
  if (typeof value !== 'string' || value === '') {
    throw new BrandPlanValidationError(
      `${path}: expected a non-empty string, got ${typeof value}`
    );
  }
  if (!HEX_COLOR_REGEX.test(value)) {
    throw new BrandPlanValidationError(
      `${path}: "${value}" is not a valid hex color (expected #RGB or #RRGGBB)`
    );
  }
}

function validateSpaceTokens(space: unknown): asserts space is Record<string, string> {
  if (!space || typeof space !== 'object' || Array.isArray(space)) {
    throw new BrandPlanValidationError(
      'space: expected an object with token names as keys'
    );
  }

  for (const [key, value] of Object.entries(space)) {
    validateCssLength(value, `space.${key}`);
  }
}

function validateRadiusTokens(radius: unknown): asserts radius is Record<string, string> {
  if (!radius || typeof radius !== 'object' || Array.isArray(radius)) {
    throw new BrandPlanValidationError(
      'radius: expected an object with token names as keys'
    );
  }

  for (const [key, value] of Object.entries(radius)) {
    validateCssLength(value, `radius.${key}`);
  }
}

function validateColorTokens(
  color: unknown
): asserts color is Record<string, Record<string, { dark: string; light: string }>> {
  if (!color || typeof color !== 'object' || Array.isArray(color)) {
    throw new BrandPlanValidationError(
      'color: expected an object with color groups as keys'
    );
  }

  for (const [group, tokens] of Object.entries(color)) {
    if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
      throw new BrandPlanValidationError(
        `color.${group}: expected an object with token names as keys`
      );
    }

    for (const [tokenName, value] of Object.entries(tokens)) {
      const path = `color.${group}.${tokenName}`;

      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new BrandPlanValidationError(
          `${path}: expected an object with 'dark' and 'light' properties`
        );
      }

      const colorValue = value as Record<string, unknown>;

      if (!('dark' in colorValue)) {
        throw new BrandPlanValidationError(
          `${path}: missing 'dark' property`
        );
      }
      if (!('light' in colorValue)) {
        throw new BrandPlanValidationError(
          `${path}: missing 'light' property`
        );
      }

      validateHexColor(colorValue.dark as string, `${path}.dark`);
      validateHexColor(colorValue.light as string, `${path}.light`);
    }
  }
}

export function validateBrandPlan(plan: unknown): asserts plan is BrandPlan {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    throw new BrandPlanValidationError(
      'Expected an object with space, radius, and color properties'
    );
  }

  const planObj = plan as Record<string, unknown>;
  const allowedKeys = new Set(['space', 'radius', 'color']);
  const actualKeys = Object.keys(planObj);

  for (const key of actualKeys) {
    if (!allowedKeys.has(key)) {
      throw new BrandPlanValidationError(
        `Unknown top-level key "${key}". Only space, radius, and color are allowed.`
      );
    }
  }

  if (!('space' in planObj)) {
    throw new BrandPlanValidationError('Missing required property: space');
  }
  if (!('radius' in planObj)) {
    throw new BrandPlanValidationError('Missing required property: radius');
  }
  if (!('color' in planObj)) {
    throw new BrandPlanValidationError('Missing required property: color');
  }

  validateSpaceTokens(planObj.space);
  validateRadiusTokens(planObj.radius);
  validateColorTokens(planObj.color);
}
