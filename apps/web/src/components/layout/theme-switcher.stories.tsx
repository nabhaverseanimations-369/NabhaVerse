import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ThemeProvider } from "@nabhaverse/ui";

import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { WorkspaceStateProvider } from "@/lib/workspace-state";

const meta = {
  title: "Layout/ThemeSwitcher",
  component: ThemeSwitcher,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ThemeProvider defaultTheme="system">
      <WorkspaceStateProvider>
        <ToastProvider>
          <ThemeSwitcher />
        </ToastProvider>
      </WorkspaceStateProvider>
    </ThemeProvider>
  ),
};
