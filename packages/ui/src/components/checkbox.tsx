"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "../lib/cn";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Visible label rendered next to the checkbox. */
  label?: string;
}

export const Checkbox = React.forwardRef<React.ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, id, label, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id ?? `checkbox-${generatedId}`;

    const control = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--color-primary-foreground)]">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (!label) {
      return control;
    }

    return (
      <div className="flex items-center gap-2">
        {control}
        <label htmlFor={checkboxId} className="text-sm text-[var(--color-text-primary)]">
          {label}
        </label>
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
