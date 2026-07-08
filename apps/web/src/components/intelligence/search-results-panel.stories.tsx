import type { Meta, StoryObj } from "@storybook/react";

import { SearchResultsPanel } from "@/components/intelligence/search-results-panel";

const meta = {
  title: "Intelligence/SearchResultsPanel",
  component: SearchResultsPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchResultsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
