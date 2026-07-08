import type { Meta, StoryObj } from "@storybook/react";

import { AssetCard } from "@/components/asset/asset-card";
import { mockAssets } from "@/features/asset/data/asset-mocks";

const asset = mockAssets[0];

if (!asset) {
  throw new Error("Expected at least one mock asset");
}

const meta = {
  title: "Asset/AssetCard",
  component: AssetCard,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    asset,
    href: "/creative/assets/ast_aurora_keyart/overview",
    onToggleFavorite: () => {},
  },
};
