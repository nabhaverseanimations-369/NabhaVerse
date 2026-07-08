import type { Meta, StoryObj } from "@storybook/react";

import { AssetGallery } from "@/components/character/asset-gallery";
import { mockCharacterAssets } from "@/features/character/data/character-mocks";

const meta = {
  title: "Character/AssetGallery",
  component: AssetGallery,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    assets: mockCharacterAssets,
  },
};
