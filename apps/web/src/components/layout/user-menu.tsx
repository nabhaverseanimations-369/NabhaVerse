"use client";

import * as React from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, cn } from "@nabhaverse/ui";

export interface UserMenuProps {
  /** Display name shown in the trigger and menu header. */
  name?: string;
  /** Email shown under the display name. */
  email?: string;
}

/**
 * Placeholder account menu. Wired to real session/auth data once the
 * authentication bounded context ships; for now it renders a static,
 * fully accessible dropdown so the app shell layout is complete.
 */
export function UserMenu({ name = "Studio Member", email = "member@nabhaverse.studio" }: UserMenuProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
      >
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          className={cn(
            "absolute right-0 z-[var(--z-dropdown)] mt-2 w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-md",
          )}
        >
          <div className="border-b border-[var(--color-border)] px-3 py-2">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{name}</p>
            <p className="truncate text-xs text-[var(--color-text-muted)]">{email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-[var(--color-destructive)] hover:bg-[var(--color-surface-muted)]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
