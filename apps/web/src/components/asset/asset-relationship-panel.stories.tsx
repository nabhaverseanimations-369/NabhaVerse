import type { Meta, StoryObj } from "@storybook/react";

import { AssetRelationshipPanel } from "@/components/asset/asset-relationship-panel";
import { mockAssets } from "@/features/asset/data/asset-mocks";

const asset = mockAssets[0];

if (!asset) {
  throw new Error("Expected at least one mock asset");
}

const meta = {
  title: "Asset/AssetRelationshipPanel",
  component: AssetRelationshipPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetRelationshipPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    asset,
  },
};
