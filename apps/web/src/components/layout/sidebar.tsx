"use client";

import * as React from "react";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { Button, cn } from "@nabhaverse/ui";

import { SidebarNav } from "../navigation/sidebar-nav";

const STORAGE_KEY = "nabhaverse_sidebar_collapsed";

export interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

/** Collapsible primary navigation sidebar. Width and collapsed state persist to `localStorage`. */
export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps): React.JSX.Element {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-[width] duration-200 md:flex",
        collapsed ? "w-[72px]" : "w-[240px]",
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b border-[var(--color-border)] px-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="h-6 w-6 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          {collapsed ? null : (
            <span className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
              NabhaVerse Studio
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav collapsed={collapsed} />
      </div>

      <div className="border-t border-[var(--color-border)] p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-full"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => {
            onCollapsedChange(!collapsed);
          }}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>
    </aside>
  );
}

export function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  const [collapsed, setCollapsed] = React.useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === "true" : false;
    } catch {
      // Ignore storage read failures (e.g. private browsing mode).
      return false;
    }
  });

  const update = React.useCallback((next: boolean) => {
    setCollapsed(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore storage write failures.
    }
  }, []);

  return [collapsed, update];
}
