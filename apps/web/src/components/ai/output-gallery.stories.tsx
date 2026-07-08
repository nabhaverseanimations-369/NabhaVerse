import type { Meta, StoryObj } from "@storybook/react";

import { OutputGallery } from "@/components/ai/output-gallery";
import { mockOutputs } from "@/features/ai";

const meta = {
  title: "AI/OutputGallery",
  component: OutputGallery,
  tags: ["autodocs"],
} satisfies Meta<typeof OutputGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    outputs: mockOutputs,
    onToggleFavorite: () => {},
  },
};
