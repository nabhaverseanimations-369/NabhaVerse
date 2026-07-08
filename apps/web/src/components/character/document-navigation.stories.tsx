import type { Meta, StoryObj } from "@storybook/react";

import { DocumentNavigation } from "@/components/character/document-navigation";

const meta = {
  title: "Character/DocumentNavigation",
  component: DocumentNavigation,
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    characterId: "chr_aurora",
    activeSection: "overview",
    collapsed: false,
  },
};

export const Collapsed: Story = {
  args: {
    characterId: "chr_aurora",
    activeSection: "model-sheet",
    collapsed: true,
  },
};
