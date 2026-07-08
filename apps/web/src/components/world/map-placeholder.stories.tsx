import type { Meta, StoryObj } from "@storybook/react";

import { MapPlaceholder } from "@/components/world/map-placeholder";

const meta = {
  title: "World/MapPlaceholder",
  component: MapPlaceholder,
  tags: ["autodocs"],
} satisfies Meta<typeof MapPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "World Map",
  },
};
