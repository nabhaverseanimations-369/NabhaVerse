import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "@nabhaverse/ui";

import { SectionHeader } from "@/components/workspace/section-header";

const meta = {
  title: "Workspace/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAction: Story = {
  args: {
    title: "Studio Overview",
    description: "Current production state across creative, AI, and publishing modules.",
    action: (
      <Button type="button" variant="primary">
        Create New Item
      </Button>
    ),
  },
};
