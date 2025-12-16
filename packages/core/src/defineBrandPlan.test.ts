import { describe, it, expect } from 'vitest';
import { defineBrandPlan } from './defineBrandPlan.js';
import { BrandPlanValidationError } from './validation.js';

const validPlan = {
  space: {
    '2': '0.5rem',
    '4': '1rem',
    '6': '1.5rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  color: {
    surface: {
      '0': { dark: '#0b0f17', light: '#ffffff' },
      '1': { dark: '#111827', light: '#f1f5f9' },
    },
    text: {
      primary: { dark: '#ffffff', light: '#0f172a' },
    },
  },
};

describe('defineBrandPlan', () => {
  it('accepts and normalizes a valid plan', () => {
    const result = defineBrandPlan(validPlan);
    expect(result).toEqual(validPlan);
  });

  it('throws on missing space property', () => {
    const plan = { ...validPlan };
    delete (plan as any).space;
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('Missing required property: space');
  });

  it('throws on missing radius property', () => {
    const plan = { ...validPlan };
    delete (plan as any).radius;
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('Missing required property: radius');
  });

  it('throws on missing color property', () => {
    const plan = { ...validPlan };
    delete (plan as any).color;
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('Missing required property: color');
  });

  it('throws on unknown top-level key', () => {
    const plan = { ...validPlan, extraKey: 'value' };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('Unknown top-level key "extraKey"');
  });

  it('throws on invalid space value (not a CSS length)', () => {
    const plan = {
      ...validPlan,
      space: { ...validPlan.space, invalid: 'not-a-length' },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('space.invalid');
  });

  it('throws on empty space value', () => {
    const plan = {
      ...validPlan,
      space: { ...validPlan.space, empty: '' },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
  });

  it('accepts 0 as a valid length', () => {
    const plan = {
      ...validPlan,
      space: { ...validPlan.space, zero: '0' },
    };
    expect(() => defineBrandPlan(plan)).not.toThrow();
  });

  it('accepts various CSS length units', () => {
    const plan = {
      ...validPlan,
      space: {
        px: '16px',
        rem: '1rem',
        em: '1.5em',
        percent: '50%',
        vh: '10vh',
        vw: '20vw',
        vmin: '5vmin',
        vmax: '15vmax',
        ch: '10ch',
        ex: '2ex',
      },
    };
    expect(() => defineBrandPlan(plan)).not.toThrow();
  });

  it('throws on space value with whitespace', () => {
    const plan = {
      ...validPlan,
      space: { ...validPlan.space, invalid: '0.5 rem' },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('contains whitespace');
    expect(() => defineBrandPlan(plan)).toThrow('space.invalid');
  });

  it('throws on radius value with whitespace', () => {
    const plan = {
      ...validPlan,
      radius: { ...validPlan.radius, invalid: '1 rem' },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('contains whitespace');
    expect(() => defineBrandPlan(plan)).toThrow('radius.invalid');
  });

  it('throws on invalid radius value', () => {
    const plan = {
      ...validPlan,
      radius: { ...validPlan.radius, invalid: 'bad' },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('radius.invalid');
  });

  it('throws on missing dark color', () => {
    const plan = {
      ...validPlan,
      color: {
        surface: {
          '0': { light: '#ffffff' } as any,
        },
      },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow("missing 'dark' property");
  });

  it('throws on missing light color', () => {
    const plan = {
      ...validPlan,
      color: {
        surface: {
          '0': { dark: '#000000' } as any,
        },
      },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow("missing 'light' property");
  });

  it('throws on invalid hex color (dark)', () => {
    const plan = {
      ...validPlan,
      color: {
        surface: {
          '0': { dark: 'not-hex', light: '#ffffff' },
        },
      },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('not a valid hex color');
  });

  it('throws on invalid hex color (light)', () => {
    const plan = {
      ...validPlan,
      color: {
        surface: {
          '0': { dark: '#000000', light: 'invalid' },
        },
      },
    };
    expect(() => defineBrandPlan(plan)).toThrow(BrandPlanValidationError);
    expect(() => defineBrandPlan(plan)).toThrow('not a valid hex color');
  });

  it('accepts 3-digit hex colors', () => {
    const plan = {
      ...validPlan,
      color: {
        test: {
          short: { dark: '#fff', light: '#000' },
        },
      },
    };
    expect(() => defineBrandPlan(plan)).not.toThrow();
  });

  it('accepts 6-digit hex colors', () => {
    const plan = {
      ...validPlan,
      color: {
        test: {
          long: { dark: '#ffffff', light: '#000000' },
        },
      },
    };
    expect(() => defineBrandPlan(plan)).not.toThrow();
  });

  it('returns a deep copy of the plan', () => {
    const result = defineBrandPlan(validPlan);
    expect(result).not.toBe(validPlan);
    expect(result.color).not.toBe(validPlan.color);
  });
});
