import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Card, CardContent } from "@nabhaverse/ui";

import { ContextMenu } from "@/components/common/context-menu";

const meta = {
  title: "Common/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: [
      { id: "pin", label: "Pin to dashboard", onSelect: () => undefined },
      { id: "open", label: "Open workspace", onSelect: () => undefined },
      { id: "archive", label: "Archive item", onSelect: () => undefined },
    ],
    children: (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm">Right-click this card to open the context menu.</p>
        </CardContent>
      </Card>
    ),
  },
};
