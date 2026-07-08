"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nabhaverse/ui";

import { workspaceNavGroups } from "./nav-items";

export interface SidebarNavProps {
  /** Whether the sidebar is collapsed to icon-only width. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

/** Renders the primary module navigation list used inside the app sidebar. */
export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-1 px-2">
      {workspaceNavGroups.map((group) => (
        <div key={group.id} className="space-y-1 py-1">
          {collapsed ? null : (
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : item.description}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
                  isActive && "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]",
                  collapsed && "justify-center px-2",
                )}
                onClick={() => {
                  onNavigate?.();
                }}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {collapsed ? (
                  <span className="sr-only">{item.label}</span>
                ) : (
                  <span>{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
