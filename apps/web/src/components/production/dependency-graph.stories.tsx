import type { Meta, StoryObj } from "@storybook/react";

import { DependencyGraph } from "@/components/production/dependency-graph";
import { mockProductions } from "@/features/production";

const tasks = mockProductions[0]?.tasks;

if (!tasks) {
  throw new Error("Expected production tasks");
}

const meta = {
  title: "Production/DependencyGraph",
  component: DependencyGraph,
  tags: ["autodocs"],
} satisfies Meta<typeof DependencyGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tasks,
  },
};
