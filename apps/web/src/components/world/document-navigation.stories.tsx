import type { Meta, StoryObj } from "@storybook/react";

import { DocumentNavigation } from "@/components/world/document-navigation";

const meta = {
  title: "World/WorldNavigation",
  component: DocumentNavigation,
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    worldId: "wld_lunara",
    activePlugin: "overview",
    collapsed: false,
  },
};

export const Collapsed: Story = {
  args: {
    worldId: "wld_lunara",
    activePlugin: "maps",
    collapsed: true,
  },
};
