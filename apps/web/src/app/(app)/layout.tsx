"use client";

import * as React from "react";
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/nextjs";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CommandPalette } from "@/components/layout/command-palette";
import { Sidebar, useSidebarCollapsed } from "@/components/layout/sidebar";
import { clerkRoutes, hasClerkPublishableKey } from "@/lib/clerkConfig";

export default function AppLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  if (!hasClerkPublishableKey) {
    return (
      <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-16 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6">
            <Breadcrumb />
            <div className="flex items-center gap-2">
              <CommandPalette />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
          <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
          <div className="flex min-h-screen flex-1 flex-col">
            <header className="flex h-16 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6">
              <Breadcrumb />
              <div className="flex items-center gap-2">
                <CommandPalette />
                <UserButton afterSignOutUrl={clerkRoutes.afterSignOut} />
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
