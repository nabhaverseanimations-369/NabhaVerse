import type { Meta, StoryObj } from "@storybook/react";

import { AssetMetadataPanel } from "@/components/asset/asset-metadata-panel";
import { mockAssets } from "@/features/asset/data/asset-mocks";

const asset = mockAssets[0];

if (!asset) {
  throw new Error("Expected at least one mock asset");
}

const meta = {
  title: "Asset/AssetMetadataPanel",
  component: AssetMetadataPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetMetadataPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    asset,
  },
};
