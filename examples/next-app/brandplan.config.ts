#!/usr/bin/env tsx
import { defineBrandPlan, brandPlanToCss } from '@brandplan/core';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define brand tokens
const plan = defineBrandPlan({
  space: {
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '6': '1.5rem',
    '8': '2rem',
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

// Generate CSS
const css = brandPlanToCss(plan);

// Write to app/brandplan.css
const outputPath = join(__dirname, 'app', 'brandplan.css');
writeFileSync(outputPath, css);

console.log('✓ Generated app/brandplan.css');
