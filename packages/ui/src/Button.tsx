import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * @default "solid"
   */
  variant?: 'solid' | 'outline' | 'ghost';

  /**
   * Color tone from brand tokens
   * @default "primary"
   */
  tone?: 'primary' | 'accent';

  /**
   * Size using brand spacing tokens
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

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
 * Button component using BrandPlan tokens.
 *
 * Required brand tokens:
 * - color.brand.primary (dark + light)
 * - color.brand.accent (dark + light)
 * - color.surface.0 (dark + light)
 * - color.text.primary (dark + light)
 * - radius.sm, radius.md, radius.lg
 * - space.2, space.4, space.6
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      tone = 'primary',
      size = 'md',
      radius = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Size classes (uses brand spacing via CSS variables)
    const sizeClasses = {
      sm: ['px-brand-2', 'py-brand-1', 'text-brand-sm'],
      md: ['px-brand-4', 'py-brand-2', 'text-brand-md'],
      lg: ['px-brand-6', 'py-brand-4', 'text-brand-lg'],
    }[size];

    // Radius classes (uses brand radius tokens)
    const radiusClass = {
      sm: 'rounded-brand-sm',
      md: 'rounded-brand-md',
      lg: 'rounded-brand-lg',
    }[radius];

    // Variant + tone combinations
    const variantClasses = getVariantClasses(variant, tone);

    const classes = [
      // Base styles
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-colors',
      'focus-visible:outline',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-brand-brand-primary',
      // Size
      ...sizeClasses,
      // Radius
      radiusClass,
      // Variant styles
      ...variantClasses,
      // Disabled
      disabled && 'opacity-50 cursor-not-allowed',
      // User className last
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <button ref={ref} className={classes} disabled={disabled} {...props} />;
  }
);

Button.displayName = 'Button';

function getVariantClasses(variant: string, tone: string): string[] {
  const brandColor = tone === 'primary' ? 'brand-primary' : 'brand-accent';

  switch (variant) {
    case 'solid':
      return [
        `bg-brand-${brandColor}`,
        'text-brand-surface-0',
        `hover:bg-brand-${brandColor}`,
        'hover:opacity-90',
        `active:bg-brand-${brandColor}`,
        'active:opacity-80',
      ];

    case 'outline':
      return [
        'bg-transparent',
        `text-brand-${brandColor}`,
        'border',
        `border-brand-${brandColor}`,
        `hover:bg-brand-${brandColor}`,
        'hover:text-brand-surface-0',
        'hover:opacity-90',
      ];

    case 'ghost':
      return [
        'bg-transparent',
        `text-brand-${brandColor}`,
        `hover:bg-brand-${brandColor}`,
        'hover:text-brand-surface-0',
        'hover:opacity-20',
      ];

    default:
      return [];
  }
}
