"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@nabhaverse/ui";

import { hasClerkPublishableKey } from "@/lib/clerkConfig";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  if (!hasClerkPublishableKey) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ClerkProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
}
