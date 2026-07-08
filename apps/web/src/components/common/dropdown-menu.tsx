"use client";

import * as React from "react";
import { cn } from "@nabhaverse/ui";

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  onSelect: () => void;
}

interface DropdownMenuProps {
  label: string;
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function DropdownMenu({
  label,
  trigger,
  items,
  align = "right",
}: DropdownMenuProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    function handleClick(event: MouseEvent): void {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const firstMenuItem = rootRef.current?.querySelector<HTMLButtonElement>("[role='menuitem']");
    firstMenuItem?.focus();
  }, [open]);

  const triggerElement = React.isValidElement(trigger) ? (
    React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
      ref: triggerRef,
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-label": (trigger as React.ReactElement<{ "aria-label"?: string }>).props["aria-label"]
        ? (trigger as React.ReactElement<{ "aria-label"?: string }>).props["aria-label"]
        : label,
      onClick: () => {
        setOpen((prev) => !prev);
      },
    })
  ) : (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={label}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
      onClick={() => {
        setOpen((prev) => !prev);
      }}
    >
      {trigger}
    </button>
  );

  return (
    <div ref={rootRef} className="relative">
      {triggerElement}

      {open ? (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-[var(--z-dropdown)] min-w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-card)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="flex w-full flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-left hover:bg-[var(--color-surface-muted)]"
              onKeyDown={(event) => {
                if (event.key === "Tab") {
                  return;
                }

                const menuItems = Array.from(
                  rootRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']") ?? [],
                );
                const currentIndex = menuItems.indexOf(event.currentTarget);
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  const next = menuItems[(currentIndex + 1) % menuItems.length];
                  next?.focus();
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  const previous =
                    menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length];
                  previous?.focus();
                }
              }}
              onClick={() => {
                setOpen(false);
                item.onSelect();
                triggerRef.current?.focus();
              }}
            >
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {item.label}
              </span>
              {item.description ? (
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {item.description}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
