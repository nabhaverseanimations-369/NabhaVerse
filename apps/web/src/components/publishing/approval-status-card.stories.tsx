import type { Meta, StoryObj } from "@storybook/react";

import { ApprovalStatusCard } from "@/components/publishing/approval-status-card";
import { mockPublications } from "@/features/publishing";

const release = mockPublications[0]?.releases[0];

if (!release) {
  throw new Error("Expected publishing release mock");
}

const meta = {
  title: "Publishing/ApprovalStatusCard",
  component: ApprovalStatusCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ApprovalStatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    release,
  },
};
