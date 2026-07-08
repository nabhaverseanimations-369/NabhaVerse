import type { Meta, StoryObj } from "@storybook/react";

import { JobQueue } from "@/components/ai/job-queue";
import { mockJobs } from "@/features/ai";

const meta = {
  title: "AI/JobQueue",
  component: JobQueue,
  tags: ["autodocs"],
} satisfies Meta<typeof JobQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    jobs: mockJobs,
  },
};
