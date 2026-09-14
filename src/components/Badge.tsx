import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type BadgeVariant =
  | 'default'
  | 'accent'
  | 'teal'
  | 'blue'
  | 'lavender'
  | 'gold'
  | 'success'
  | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Escape hatch for callers deriving a color at runtime (e.g. the body-part color map). */
  colorHex?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-hover text-text-secondary',
  accent: 'bg-accent/15 text-accent-light',
  teal: 'bg-muted-teal/15 text-muted-teal',
  blue: 'bg-muted-blue/15 text-muted-blue',
  lavender: 'bg-muted-lavender/15 text-muted-lavender',
  gold: 'bg-muted-gold/15 text-muted-gold',
  success: 'bg-muted-success/15 text-muted-success',
  danger: 'bg-muted-danger/15 text-muted-danger',
};

export function Badge({ className, variant = 'default', colorHex, style, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        !colorHex && variantClasses[variant],
        className,
      )}
      style={colorHex ? { backgroundColor: `${colorHex}26`, color: colorHex, ...style } : style}
      {...props}
    />
  );
}
