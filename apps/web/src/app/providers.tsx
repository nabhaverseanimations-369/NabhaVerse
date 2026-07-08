"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@nabhaverse/ui";

export interface ProvidersProps {
  children: React.ReactNode;
}

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  if (!clerkPublishableKey) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
}
