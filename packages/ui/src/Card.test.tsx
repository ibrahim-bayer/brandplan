import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card.js';

describe('Card', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
  });

  it('applies brand surface background for default tone', () => {
    render(<Card tone="default">Default</Card>);
    const card = screen.getByText('Default');
    expect(card.className).toContain('bg-brand-surface-1');
  });

  it('applies brand surface background for muted tone', () => {
    render(<Card tone="muted">Muted</Card>);
    const card = screen.getByText('Muted');
    expect(card.className).toContain('bg-brand-surface-0');
  });

  it('applies correct padding class', () => {
    const { rerender } = render(<Card padding="none">None</Card>);
    let card = screen.getByText('None');
    expect(card.className).toContain('bp-card--p-none');

    rerender(<Card padding="sm">Small</Card>);
    card = screen.getByText('Small');
    expect(card.className).toContain('bp-card--p-sm');

    rerender(<Card padding="md">Medium</Card>);
    card = screen.getByText('Medium');
    expect(card.className).toContain('bp-card--p-md');

    rerender(<Card padding="lg">Large</Card>);
    card = screen.getByText('Large');
    expect(card.className).toContain('bp-card--p-lg');
  });

  it('applies brand radius classes', () => {
    const { rerender } = render(<Card radius="sm">Small Radius</Card>);
    let card = screen.getByText('Small Radius');
    expect(card.className).toContain('rounded-brand-sm');

    rerender(<Card radius="md">Medium Radius</Card>);
    card = screen.getByText('Medium Radius');
    expect(card.className).toContain('rounded-brand-md');

    rerender(<Card radius="lg">Large Radius</Card>);
    card = screen.getByText('Large Radius');
    expect(card.className).toContain('rounded-brand-lg');
  });

  it('applies border with brand color', () => {
    render(<Card>With Border</Card>);
    const card = screen.getByText('With Border');
    expect(card.className).toContain('border');
    expect(card.className).toContain('border-brand-surface-0');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Card ref={ref as any}>Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts additional className for layout utilities', () => {
    render(<Card className="max-w-md mx-auto">Centered Card</Card>);
    const card = screen.getByText('Centered Card');
    expect(card.className).toContain('max-w-md');
    expect(card.className).toContain('mx-auto');
  });

  it('does not use arbitrary Tailwind spacing in padding classes', () => {
    render(<Card padding="md">Default Padding</Card>);
    const card = screen.getByText('Default Padding');
    // Padding should use bp-card--p-* classes, not p-4, p-6, etc.
    expect(card.className).toContain('bp-card--p-md');
    expect(card.className).not.toMatch(/\bp-\d/);
  });

  it('uses only brand utilities for critical styling', () => {
    render(<Card>Brand Only</Card>);
    const card = screen.getByText('Brand Only');
    // Ensure bg uses brand tokens
    expect(card.className).toMatch(/bg-brand-/);
    // Ensure rounded uses brand tokens
    expect(card.className).toMatch(/rounded-brand-/);
    // Ensure no arbitrary values
    expect(card.className).not.toMatch(/\[.*\]/);
  });
});
