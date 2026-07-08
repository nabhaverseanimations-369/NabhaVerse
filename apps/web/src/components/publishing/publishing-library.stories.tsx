import type { Meta, StoryObj } from "@storybook/react";

import { PublishingLibrary } from "@/components/publishing/publishing-library";
import { mockPublications } from "@/features/publishing";

const meta = {
  title: "Publishing/PublishingLibrary",
  component: PublishingLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof PublishingLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialPublications: mockPublications,
    initialLoading: false,
  },
};
