"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@nabhaverse/ui";

import { ToastProvider } from "@/components/feedback/toast-provider";
import { hasClerkPublishableKey } from "@/lib/clerkConfig";
import { WorkspaceStateProvider } from "@/lib/workspace-state";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  if (!hasClerkPublishableKey) {
    return (
      <ThemeProvider defaultTheme="system">
        <WorkspaceStateProvider>
          <ToastProvider>{children}</ToastProvider>
        </WorkspaceStateProvider>
      </ThemeProvider>
    );
  }

  return (
    <ClerkProvider>
      <ThemeProvider defaultTheme="system">
        <WorkspaceStateProvider>
          <ToastProvider>{children}</ToastProvider>
        </WorkspaceStateProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
