import type { Meta, StoryObj } from "@storybook/react";

import { RelationshipGraphPlaceholder } from "@/components/character/relationship-graph-placeholder";
import { mockCharacterRelationships } from "@/features/character/data/character-mocks";

const meta = {
  title: "Character/RelationshipGraphPlaceholder",
  component: RelationshipGraphPlaceholder,
  tags: ["autodocs"],
} satisfies Meta<typeof RelationshipGraphPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    relationships: mockCharacterRelationships,
  },
};
