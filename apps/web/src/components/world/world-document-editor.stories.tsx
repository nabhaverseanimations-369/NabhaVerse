import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { WorldDocumentEditor } from "@/components/world/world-document-editor";
import { mockWorlds } from "@/features/world/data/world-mocks";
import { WorldWorkspaceProvider } from "@/features/world/state/world-workspace-state";

const world = mockWorlds[0];

if (!world) {
  throw new Error("Expected at least one mock world");
}

const meta: Meta<typeof WorldDocumentEditor> = {
  title: "World/WorldDocumentEditor",
  component: WorldDocumentEditor,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <WorldWorkspaceProvider
        initialWorld={world}
        initialPlugin="overview"
        initialMarkdown="# Draft world notes"
      >
        <Story />
      </WorldWorkspaceProvider>
    ),
  ],
} satisfies Meta<typeof WorldDocumentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Overview Notes",
    description: "Working notes and creative alignment context for this world.",
    version: world.version,
  },
};
