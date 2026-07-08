import type { Meta, StoryObj } from "@storybook/react";

import { SavedSearchCard } from "@/components/intelligence/saved-search-card";
import { mockSavedSearches } from "@/features/intelligence";

const savedSearch = mockSavedSearches[0];

if (!savedSearch) {
  throw new Error("Expected saved search mock");
}

const meta = {
  title: "Intelligence/SavedSearchCard",
  component: SavedSearchCard,
  tags: ["autodocs"],
} satisfies Meta<typeof SavedSearchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    savedSearch,
  },
};
