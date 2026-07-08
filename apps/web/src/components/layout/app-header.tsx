"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { SearchBar } from "@/components/layout/search-bar";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { clerkRoutes, hasClerkPublishableKey } from "@/lib/clerkConfig";
import { useWorkspaceState } from "@/lib/workspace-state";

const CommandPalette = dynamic(
  () => import("@/components/layout/command-palette").then((module) => module.CommandPalette),
  { ssr: false },
);
const NotificationCenter = dynamic(
  () =>
    import("@/components/layout/notification-center").then((module) => module.NotificationCenter),
  { ssr: false },
);
const ThemeSwitcher = dynamic(
  () => import("@/components/layout/theme-switcher").then((module) => module.ThemeSwitcher),
  { ssr: false },
);

export function AppHeader(): React.JSX.Element {
  const { state, dispatch } = useWorkspaceState();

  return (
    <header className="space-y-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MobileSidebar
            open={state.navigation.mobileNavOpen}
            onOpenChange={(open) => {
              dispatch({ type: "set-mobile-nav-open", open });
            }}
          />
          <WorkspaceSwitcher />
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <ThemeSwitcher />
          <CommandPalette />
          {hasClerkPublishableKey ? (
            <UserButton afterSignOutUrl={clerkRoutes.afterSignOut} />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Breadcrumb />
        <SearchBar />
      </div>
    </header>
  );
}
