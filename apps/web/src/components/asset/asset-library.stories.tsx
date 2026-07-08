import type { Meta, StoryObj } from "@storybook/react";

import { AssetLibrary } from "@/components/asset/asset-library";

const meta = {
  title: "Asset/AssetLibrary",
  component: AssetLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialLoading: false,
  },
};
