"use client";

import * as React from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { Suspense } from "react";

import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/layout/sidebar";
import { hasClerkPublishableKey } from "@/lib/clerkConfig";
import { useWorkspaceState } from "@/lib/workspace-state";

export default function AppLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { state, dispatch } = useWorkspaceState();

  if (!hasClerkPublishableKey) {
    return (
      <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <Sidebar
          collapsed={state.navigation.sidebarCollapsed}
          onCollapsedChange={(collapsed) => {
            dispatch({ type: "set-sidebar-collapsed", collapsed });
          }}
        />
        <div className="flex min-h-screen flex-1 flex-col">
          <AppHeader />
          <Suspense fallback={<main className="flex-1 p-4 md:p-6">Loading workspace...</main>}>
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </Suspense>
          <AppFooter />
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
          <Sidebar
            collapsed={state.navigation.sidebarCollapsed}
            onCollapsedChange={(collapsed) => {
              dispatch({ type: "set-sidebar-collapsed", collapsed });
            }}
          />
          <div className="flex min-h-screen flex-1 flex-col">
            <AppHeader />
            <Suspense fallback={<main className="flex-1 p-4 md:p-6">Loading workspace...</main>}>
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </Suspense>
            <AppFooter />
          </div>
        </div>
      </SignedIn>
    </>
  );
}
