import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ThemeProvider } from "@nabhaverse/ui";

import { SidebarNav } from "@/components/navigation/sidebar-nav";

const meta = {
  title: "Navigation/SidebarNav",
  component: SidebarNav,
  tags: ["autodocs"],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    collapsed: false,
  },
  render: (args) => (
    <ThemeProvider defaultTheme="system">
      <div className="w-72 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        <SidebarNav {...args} />
      </div>
    </ThemeProvider>
  ),
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  render: (args) => (
    <ThemeProvider defaultTheme="system">
      <div className="w-24 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        <SidebarNav {...args} />
      </div>
    </ThemeProvider>
  ),
};
