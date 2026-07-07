import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

export const spinnerVariants = cva("inline-block animate-spin rounded-full border-solid border-current border-t-transparent", {
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-[3px]",
      xl: "h-12 w-12 border-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label describing what is loading. */
  label?: string;
}

export function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps): React.JSX.Element {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size }), "text-[var(--color-primary)]", className)}
      {...props}
    />
  );
}
