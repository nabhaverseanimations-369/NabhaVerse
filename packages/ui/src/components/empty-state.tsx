import * as React from "react";

import { cn } from "../lib/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon or illustration rendered above the title. */
  icon?: React.ReactNode;
  /** Primary heading text. */
  title: string;
  /** Supporting description text. */
  description?: string;
  /** Optional call-to-action rendered below the description. */
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] px-6 py-16 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
