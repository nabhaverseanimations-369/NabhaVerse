import type { Meta, StoryObj } from "@storybook/react";

import { CommentPanel } from "@/components/character/comment-panel";

const meta = {
  title: "Character/CommentPanel",
  component: CommentPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof CommentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sectionLabel: "Character Bible",
  },
};
