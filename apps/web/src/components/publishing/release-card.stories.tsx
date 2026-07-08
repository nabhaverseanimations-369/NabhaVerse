import type { Meta, StoryObj } from "@storybook/react";

import { ReleaseCard } from "@/components/publishing/release-card";
import { mockPublications } from "@/features/publishing";

const release = mockPublications[0]?.releases[0];

if (!release) {
  throw new Error("Expected publishing release mock");
}

const meta = {
  title: "Publishing/ReleaseCard",
  component: ReleaseCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ReleaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    release,
  },
};
