/**
 * Default config template for brandplan init
 */
export const configTemplate = `import { defineBrandPlan } from '@brandplan/core';

// Define your brand tokens
// These tokens are used by @brandplan/ui components (Button, Card)
export default defineBrandPlan({
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
    // Brand colors
    brand: {
      primary: { dark: '#3b82f6', light: '#2563eb' },
      accent: { dark: '#8b5cf6', light: '#7c3aed' },
    },
    // Surface colors
    surface: {
      '0': { dark: '#0b0f17', light: '#ffffff' },
      '1': { dark: '#111827', light: '#f9fafb' },
    },
    // Text colors
    text: {
      primary: { dark: '#f9fafb', light: '#111827' },
      secondary: { dark: '#9ca3af', light: '#6b7280' },
    },
  },
});
`;

/**
 * CSS file header comment
 */
export function getCssHeader(): string {
  return `/**
 * BrandPlan Generated CSS
 *
 * This file is auto-generated from brandplan.config.ts
 * DO NOT EDIT MANUALLY - changes will be overwritten
 *
 * To regenerate: npx brandplan build
 */

`;
}
