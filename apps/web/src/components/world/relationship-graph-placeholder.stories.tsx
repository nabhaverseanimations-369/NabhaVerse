import type { Meta, StoryObj } from "@storybook/react";

import { RelationshipGraphPlaceholder } from "@/components/world/relationship-graph-placeholder";
import { mockWorldRelationships } from "@/features/world/data/world-mocks";

const meta = {
  title: "World/RelationshipGraph",
  component: RelationshipGraphPlaceholder,
  tags: ["autodocs"],
} satisfies Meta<typeof RelationshipGraphPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    relationships: mockWorldRelationships,
  },
};
