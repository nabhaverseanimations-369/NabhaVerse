import type { Meta, StoryObj } from "@storybook/react";

import { ModelCard } from "@/components/ai/model-card";
import { mockModels } from "@/features/ai";

const model = mockModels[0];

if (!model) {
  throw new Error("Expected at least one AI model");
}

const meta = {
  title: "AI/ModelCard",
  component: ModelCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ModelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    model,
  },
};
