import type { Meta, StoryObj } from "@storybook/react";

import { AssetCollectionPanel } from "@/components/asset/asset-collection-panel";
import { mockAssets } from "@/features/asset/data/asset-mocks";

const asset = mockAssets[0];

if (!asset) {
  throw new Error("Expected at least one mock asset");
}

const meta = {
  title: "Asset/AssetCollectionPanel",
  component: AssetCollectionPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetCollectionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    asset,
  },
};
