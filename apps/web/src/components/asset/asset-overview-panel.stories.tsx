import type { Meta, StoryObj } from "@storybook/react";

import { AssetOverviewPanel } from "@/components/asset/asset-overview-panel";
import { mockAssets } from "@/features/asset/data/asset-mocks";

const asset = mockAssets[0];

if (!asset) {
  throw new Error("Expected at least one mock asset");
}

const meta = {
  title: "Asset/AssetOverviewPanel",
  component: AssetOverviewPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetOverviewPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    asset,
  },
};
