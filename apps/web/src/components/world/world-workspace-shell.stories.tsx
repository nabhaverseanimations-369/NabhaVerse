import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { WorldWorkspaceShell } from "@/components/world/world-workspace-shell";
import { mockWorlds } from "@/features/world/data/world-mocks";
import { WorldWorkspaceProvider } from "@/features/world/state/world-workspace-state";

const world = mockWorlds[0];

if (!world) {
  throw new Error("Expected at least one mock world");
}

const meta: Meta<typeof WorldWorkspaceShell> = {
  title: "World/WorldWorkspaceShell",
  component: WorldWorkspaceShell,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <WorldWorkspaceProvider
        initialWorld={world}
        initialPlugin="overview"
        initialMarkdown="# World workspace"
      >
        <Story />
      </WorldWorkspaceProvider>
    ),
  ],
} satisfies Meta<typeof WorldWorkspaceShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    worldId: world.id,
    children: (
      <div className="rounded-md border border-dashed border-[var(--color-border)] p-4">
        Workspace content
      </div>
    ),
  },
};
