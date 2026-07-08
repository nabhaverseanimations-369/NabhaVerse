import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { PromptEditor } from "@/components/ai/prompt-editor";
import { mockAIWorkspace, mockPrompts } from "@/features/ai";
import { AIWorkspaceProvider } from "@/features/ai";

const prompt = mockPrompts[0];

if (!prompt) {
  throw new Error("Expected at least one AI prompt");
}

const meta: Meta<typeof PromptEditor> = {
  title: "AI/PromptEditor",
  component: PromptEditor,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <AIWorkspaceProvider
        initialWorkspace={mockAIWorkspace}
        initialPlugin="prompt-editor"
        initialPrompt={prompt}
      >
        <Story />
      </AIWorkspaceProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prompt,
  },
};
