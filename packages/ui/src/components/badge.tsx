import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]",
        primary: "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
        secondary: "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]",
        success: "border-transparent bg-[var(--color-success-500)] text-[var(--color-neutral-0)]",
        warning: "border-transparent bg-[var(--color-warning-500)] text-[var(--color-neutral-950)]",
        destructive: "border-transparent bg-[var(--color-destructive)] text-[var(--color-text-inverse)]",
        outline: "border-[var(--color-border)] text-[var(--color-text-primary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
