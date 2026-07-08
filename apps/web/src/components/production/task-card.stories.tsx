import type { Meta, StoryObj } from "@storybook/react";

import { TaskCard } from "@/components/production/task-card";
import { mockProductions } from "@/features/production";

const task = mockProductions[0]?.tasks[0];

if (!task) {
  throw new Error("Expected at least one production task");
}

const meta = {
  title: "Production/TaskCard",
  component: TaskCard,
  tags: ["autodocs"],
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    task,
  },
};
