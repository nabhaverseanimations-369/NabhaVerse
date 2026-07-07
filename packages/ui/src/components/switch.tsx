"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "../lib/cn";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Visible label rendered next to the switch. */
  label?: string;
}

export const Switch = React.forwardRef<React.ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, id, label, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id ?? `switch-${generatedId}`;

    const control = (
      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-[var(--color-surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-[var(--color-primary)]",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-[var(--color-surface)] shadow-sm transition-transform data-[state=checked]:translate-x-5" />
      </SwitchPrimitive.Root>
    );

    if (!label) {
      return control;
    }

    return (
      <div className="flex items-center gap-2">
        {control}
        <label htmlFor={switchId} className="text-sm text-[var(--color-text-primary)]">
          {label}
        </label>
      </div>
    );
  },
);
Switch.displayName = "Switch";
