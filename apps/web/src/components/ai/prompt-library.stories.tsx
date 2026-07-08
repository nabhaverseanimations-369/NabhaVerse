import type { Meta, StoryObj } from "@storybook/react";

import { PromptLibrary } from "@/components/ai/prompt-library";
import { mockPrompts } from "@/features/ai";

const meta = {
  title: "AI/PromptLibrary",
  component: PromptLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof PromptLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prompts: mockPrompts,
  },
};
