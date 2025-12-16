import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('applies brand color classes for solid variant', () => {
    render(<Button variant="solid" tone="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-brand-brand-primary');
    expect(button.className).toContain('text-brand-surface-0');
  });

  it('applies brand color classes for accent tone', () => {
    render(<Button tone="accent">Accent</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-brand-brand-accent');
  });

  it('applies outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border-brand-brand-primary');
    expect(button.className).toContain('text-brand-brand-primary');
  });

  it('applies ghost variant classes', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('text-brand-brand-primary');
  });

  it('applies size classes using brand spacing', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('px-brand-2');
    expect(button.className).toContain('py-brand-1');
    expect(button.className).toContain('text-brand-sm');

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('px-brand-4');
    expect(button.className).toContain('py-brand-2');
    expect(button.className).toContain('text-brand-md');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('px-brand-6');
    expect(button.className).toContain('py-brand-4');
    expect(button.className).toContain('text-brand-lg');
  });

  it('applies brand radius classes', () => {
    const { rerender } = render(<Button radius="sm">Small Radius</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('rounded-brand-sm');

    rerender(<Button radius="md">Medium Radius</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('rounded-brand-md');

    rerender(<Button radius="lg">Large Radius</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('rounded-brand-lg');
  });

  it('applies disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('opacity-50');
    expect(button.className).toContain('cursor-not-allowed');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref as any}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('accepts additional className for layout utilities', () => {
    render(<Button className="w-full">Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('w-full');
  });

  it('does not use arbitrary Tailwind values in default styling', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    // Ensure no p-4, rounded-lg, bg-slate-*, etc. are present
    expect(button.className).not.toMatch(/\bp-\d/);
    expect(button.className).not.toMatch(/\brounded-(?!brand-)/);
    expect(button.className).not.toMatch(/\bbg-slate-/);
  });
});
