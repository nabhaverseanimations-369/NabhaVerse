import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

export const skeletonVariants = cva("animate-pulse rounded-md bg-[var(--color-surface-muted)]", {
  variants: {
    variant: {
      text: "h-4 w-full",
      avatar: "h-10 w-10 rounded-full",
      button: "h-10 w-24",
      card: "h-32 w-full",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, variant, ...props }: SkeletonProps): React.JSX.Element {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}
