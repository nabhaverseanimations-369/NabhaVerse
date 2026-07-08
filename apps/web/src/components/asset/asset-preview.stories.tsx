import type { Meta, StoryObj } from "@storybook/react";

import { AssetPreview } from "@/components/asset/asset-preview";
import { mockAssets } from "@/features/asset/data/asset-mocks";

const asset = mockAssets[0];

if (!asset) {
  throw new Error("Expected at least one mock asset");
}

const meta = {
  title: "Asset/AssetPreview",
  component: AssetPreview,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    asset,
  },
};
