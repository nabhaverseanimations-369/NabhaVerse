import type { Meta, StoryObj } from "@storybook/react";

import { PromptCard } from "@/components/ai/prompt-card";
import { mockPrompts } from "@/features/ai";

const prompt = mockPrompts[0];

if (!prompt) {
  throw new Error("Expected at least one AI prompt");
}

const meta = {
  title: "AI/PromptCard",
  component: PromptCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PromptCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prompt,
    onToggleFavorite: () => {},
  },
};
