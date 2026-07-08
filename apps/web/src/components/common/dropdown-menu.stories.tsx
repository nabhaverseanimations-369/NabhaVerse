import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "@nabhaverse/ui";

import { DropdownMenu } from "@/components/common/dropdown-menu";

const meta = {
  title: "Common/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Example menu",
    trigger: (
      <Button type="button" variant="outline">
        Open menu
      </Button>
    ),
    items: [
      { id: "1", label: "Rename", description: "Update the item title", onSelect: () => undefined },
      { id: "2", label: "Duplicate", description: "Create a copy", onSelect: () => undefined },
      {
        id: "3",
        label: "Archive",
        description: "Hide from default lists",
        onSelect: () => undefined,
      },
    ],
  },
};
