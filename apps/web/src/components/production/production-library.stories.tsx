import type { Meta, StoryObj } from "@storybook/react";

import { ProductionLibrary } from "@/components/production/production-library";
import { mockProductions } from "@/features/production";

const meta = {
  title: "Production/ProductionLibrary",
  component: ProductionLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductionLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialProductions: mockProductions,
    initialLoading: false,
  },
};
