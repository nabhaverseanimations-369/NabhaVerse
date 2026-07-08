"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
} from "@nabhaverse/ui";

import { workspaceNavItems } from "../navigation/nav-items";

/**
 * Global command palette triggered by the keyboard shortcut `Cmd/Ctrl+K` or
 * the search button in the header. Provides quick navigation to every
 * top-level module; richer command actions can be layered on in a future
 * sprint without changing this shell.
 */
export function CommandPalette(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = workspaceNavItems.filter((item) =>
    `${item.label} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden gap-2 text-[var(--color-text-muted)] sm:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search…</span>
        <kbd className="ml-4 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-xs">
          ⌘K
        </kbd>
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setQuery("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Jump to</DialogTitle>
          <DialogDescription>Search for a module and press Enter to navigate.</DialogDescription>
          <Input
            autoFocus
            placeholder="Type a module name…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search modules"
          />
          <ul
            className="flex max-h-72 flex-col gap-1 overflow-y-auto"
            role="listbox"
            aria-label="Modules"
          >
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      router.push(item.href);
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {item.description}
                    </span>
                  </button>
                </li>
              );
            })}
            {filteredItems.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--color-text-muted)]">
                No modules found.
              </li>
            ) : null}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
