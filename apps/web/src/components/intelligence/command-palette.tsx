"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
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
import { mockIntelligenceCommands } from "@/features/intelligence";
import { workspaceNavItems } from "@/components/navigation/nav-items";

function commandCategoryLabel(command: StudioCommandDefinition<GlobalCommandId>): string {
  if (command.id.startsWith("navigate:")) {
    return "Navigation";
  }
  return command.category.charAt(0).toUpperCase() + command.category.slice(1);
}

export function IntelligenceCommandPalette(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [matchedCommands, setMatchedCommands] = React.useState<
    readonly StudioCommandDefinition<GlobalCommandId>[]
  >([]);
  const [favoriteIds, setFavoriteIds] = React.useState<readonly string[]>(
    mockIntelligenceCommands
      .filter((command) => command.favorite)
      .map((command) => `command:${command.id}`),
  );
  const [recentIds, setRecentIds] = React.useState<readonly string[]>(
    mockIntelligenceCommands
      .filter((command) => command.recent)
      .map((command) => `command:${command.id}`),
  );
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
    () => createGlobalCommandRegistry(navigationCommands, mockIntelligenceCommands),
    [navigationCommands],
  );

  const searchService = React.useMemo(() => {
    const service = createStudioGlobalSearchService();
    service.registerProvider(
      createNavigationSearchProvider(
        "workspace-commands",
        commandRegistry.commands.map((command) => {
          const href = commandHref(command);
          return {
            id: command.id,
            title: command.title,
            description: command.description,
            href: href ?? "/intelligence/studio",
            keywords: command.keywords,
            category: command.id.startsWith("navigate:") ? "navigation" : "command",
          };
        }),
      ),
    );
    return service;
  }, [commandRegistry.commands]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
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

  function executeCommand(command: StudioCommandDefinition<GlobalCommandId>): void {
    const href = commandHref(command);
    setOpen(false);
    setQuery("");
    setRecentIds((current) => Array.from(new Set([command.id, ...current])).slice(0, 5));
    if (href) {
      router.push(href);
    }
  }

  function toggleFavorite(commandId: string): void {
    setFavoriteIds((current) =>
      current.includes(commandId)
        ? current.filter((entry) => entry !== commandId)
        : [commandId, ...current],
    );
  }

  const favoriteCommands = commandRegistry.commands.filter((command) =>
    favoriteIds.includes(command.id),
  );
  const recentCommands = recentIds
    .map((id) => commandRegistry.findById(id as GlobalCommandId))
    .filter(
      (command): command is StudioCommandDefinition<GlobalCommandId> => command !== undefined,
    );

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 text-[var(--color-text-muted)]"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search commands…</span>
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
        <DialogContent className="max-w-2xl">
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>
            Search global, studio, and navigation commands. Favorites and recent commands are
            retained as mock client-side state.
          </DialogDescription>
          <Input
            autoFocus
            placeholder="Search commands"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search commands"
          />

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <ul
              className="flex max-h-80 flex-col gap-2 overflow-y-auto"
              role="listbox"
              aria-label="Commands"
            >
              {matchedCommands.map((command) => {
                const isFavorite = favoriteIds.includes(command.id);
                return (
                  <li
                    key={command.id}
                    className="rounded-md border border-[var(--color-border)] px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        role="option"
                        aria-selected="false"
                        className="flex-1 text-left"
                        onClick={() => executeCommand(command)}
                      >
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {command.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {command.description}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {commandCategoryLabel(command)}
                        </p>
                      </button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                        onClick={() => toggleFavorite(command.id)}
                      >
                        <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </li>
                );
              })}
              {matchedCommands.length === 0 ? (
                <li className="px-3 py-2 text-sm text-[var(--color-text-muted)]">
                  No commands found.
                </li>
              ) : null}
            </ul>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Favorites
                </p>
                <div className="space-y-2">
                  {favoriteCommands.slice(0, 4).map((command) => (
                    <button
                      key={command.id}
                      type="button"
                      className="block w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-left text-sm text-[var(--color-text-primary)]"
                      onClick={() => executeCommand(command)}
                    >
                      {command.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Recent Commands
                </p>
                <div className="space-y-2">
                  {recentCommands.slice(0, 4).map((command) => (
                    <button
                      key={command.id}
                      type="button"
                      className="block w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-left text-sm text-[var(--color-text-primary)]"
                      onClick={() => executeCommand(command)}
                    >
                      {command.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
