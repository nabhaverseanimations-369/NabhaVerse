"use client";

import * as React from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { Badge } from "@nabhaverse/ui";
import { useTheme } from "@nabhaverse/ui";

import { DropdownMenu } from "@/components/common/dropdown-menu";
import { useWorkspaceState } from "@/lib/workspace-state";

export function ThemeSwitcher(): React.JSX.Element {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { dispatch } = useWorkspaceState();

  const applyTheme = React.useCallback(
    (nextTheme: "light" | "dark" | "system") => {
      setTheme(nextTheme);
      dispatch({ type: "set-theme", theme: nextTheme });
    },
    [dispatch, setTheme],
  );

  const items = React.useMemo(
    () => [
      {
        id: "light",
        label: "Light",
        description: "Always use the light theme",
        onSelect: () => applyTheme("light"),
      },
      {
        id: "dark",
        label: "Dark",
        description: "Always use the dark theme",
        onSelect: () => applyTheme("dark"),
      },
      {
        id: "system",
        label: "System",
        description: "Follow system preference",
        onSelect: () => applyTheme("system"),
      },
    ],
    [applyTheme],
  );

  const icon =
    theme === "system" ? (
      <Laptop className="h-4 w-4" aria-hidden="true" />
    ) : resolvedTheme === "light" ? (
      <Sun className="h-4 w-4" aria-hidden="true" />
    ) : (
      <Moon className="h-4 w-4" aria-hidden="true" />
    );

  return (
    <DropdownMenu
      label="Theme switcher"
      items={items}
      trigger={
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-2.5 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
          aria-label="Change theme"
        >
          {icon}
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {theme}
          </Badge>
        </button>
      }
    />
  );
}
