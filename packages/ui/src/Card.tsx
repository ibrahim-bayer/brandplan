import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Surface tone variant
   * @default "default"
   */
  tone?: 'default' | 'muted';

  /**
   * Padding using brand spacing tokens
   * @default "md"
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Border radius using brand radius tokens
   * @default "md"
   */
  radius?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes for layout utilities only.
   * Do NOT use this to override brand-critical styling (colors, radius, spacing).
   */
  className?: string;
}

/**
 * Card component providing a consistent surface wrapper using BrandPlan tokens.
 *
 * Required brand tokens:
 * - color.surface.0 (dark + light)
 * - color.surface.1 (dark + light)
 * - radius.sm, radius.md, radius.lg
 * - space.2, space.4, space.6
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      tone = 'default',
      padding = 'md',
      radius = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Padding classes (uses brand spacing via CSS variables)
    const paddingClass = {
      none: 'p-brand-0',
      sm: 'p-brand-2',
      md: 'p-brand-4',
      lg: 'p-brand-6',
    }[padding];

    // Radius classes (uses brand radius tokens)
    const radiusClass = {
      sm: 'rounded-brand-sm',
      md: 'rounded-brand-md',
      lg: 'rounded-brand-lg',
    }[radius];

    // Tone determines surface color
    const surfaceClass = tone === 'default' ? 'bg-brand-surface-1' : 'bg-brand-surface-0';

    const classes = [
      // Surface background
      surfaceClass,
      // Optional border
      'border',
      'border-brand-surface-0',
      // Padding
      paddingClass,
      // Radius
      radiusClass,
      // User className last
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
