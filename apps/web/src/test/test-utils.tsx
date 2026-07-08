import * as React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@nabhaverse/ui";

import { ToastProvider } from "@/components/feedback/toast-provider";
import { WorkspaceStateProvider } from "@/lib/workspace-state";

function Providers({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <ThemeProvider defaultTheme="system">
      <WorkspaceStateProvider>
        <ToastProvider>{children}</ToastProvider>
      </WorkspaceStateProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): ReturnType<typeof render> {
  return render(ui, { wrapper: Providers, ...options });
}
