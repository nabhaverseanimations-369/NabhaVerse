"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  createStudioGlobalSearchService,
  type StudioCommandDefinition,
} from "@nabhaverse/studio-sdk";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
} from "@nabhaverse/ui";

import {
  commandHref,
  createGlobalCommandRegistry,
  createNavigationSearchProvider,
  type GlobalCommandId,
} from "@/features/studio";
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
  const [matchedCommands, setMatchedCommands] = React.useState<
    readonly StudioCommandDefinition<GlobalCommandId>[]
  >([]);
  const router = useRouter();

  const navigationCommands = React.useMemo(
    () =>
      workspaceNavItems.map((item) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        href: item.href,
      })),
    [],
  );

  const commandRegistry = React.useMemo(
    () => createGlobalCommandRegistry(navigationCommands),
    [navigationCommands],
  );

  const searchService = React.useMemo(() => {
    const service = createStudioGlobalSearchService();
    service.registerProvider(
      createNavigationSearchProvider(
        "workspace-navigation",
        commandRegistry.commands
          .map((command) => {
            const href = commandHref(command);
            if (!href) {
              return null;
            }

            return {
              id: command.id,
              title: command.title,
              description: command.description,
              href,
              keywords: command.keywords,
            };
          })
          .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
      ),
    );
    return service;
  }, [commandRegistry.commands]);

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

  React.useEffect(() => {
    let cancelled = false;

    void searchService.search({ query, limit: 60 }).then((response) => {
      if (cancelled) {
        return;
      }

      const commands = response.results
        .map((result) => commandRegistry.findById(result.id as GlobalCommandId))
        .filter(
          (command): command is StudioCommandDefinition<GlobalCommandId> => command !== undefined,
        );

      setMatchedCommands(commands);
    });

    return () => {
      cancelled = true;
    };
  }, [commandRegistry, query, searchService]);

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
            {matchedCommands.map((command) => {
              const href = commandHref(command);
              const navItemId = command.id.replace("navigate:", "");
              const item = workspaceNavItems.find((entry) => entry.id === navItemId);

              if (!href || !item) {
                return null;
              }

              const Icon = item.icon;
              return (
                <li key={command.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      router.push(href);
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{command.title}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {command.description}
                    </span>
                  </button>
                </li>
              );
            })}
            {matchedCommands.length === 0 ? (
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
