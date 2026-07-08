"use client";

import * as React from "react";

import { cn } from "@nabhaverse/ui";

export interface ContextAction {
  id: string;
  label: string;
  onSelect: () => void;
}

interface ContextMenuProps {
  actions: ContextAction[];
  children: React.ReactNode;
}

export function ContextMenu({ actions, children }: ContextMenuProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    function handleDismiss(): void {
      setOpen(false);
    }

    document.addEventListener("click", handleDismiss);
    document.addEventListener("scroll", handleDismiss, true);

    return () => {
      document.removeEventListener("click", handleDismiss);
      document.removeEventListener("scroll", handleDismiss, true);
    };
  }, []);

  return (
    <div
      onContextMenu={(event) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
        setOpen(true);
      }}
    >
      {children}
      {open ? (
        <div
          role="menu"
          aria-label="Context menu"
          className={cn(
            "fixed z-[var(--z-dropdown)] min-w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-card)]",
          )}
          style={{ top: position.y, left: position.x }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              className="w-full rounded-sm px-3 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]"
              onClick={() => {
                setOpen(false);
                action.onSelect();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
