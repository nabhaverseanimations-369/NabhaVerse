import type { Meta, StoryObj } from "@storybook/react";

import { PipelineStage } from "@/components/production/pipeline-stage";
import { mockProductions } from "@/features/production";

const item = mockProductions[0]?.shotPipeline[0];

if (!item) {
  throw new Error("Expected at least one shot pipeline item");
}

const meta = {
  title: "Production/PipelineStage",
  component: PipelineStage,
  tags: ["autodocs"],
} satisfies Meta<typeof PipelineStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item,
  },
};
