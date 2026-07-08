import type { Meta, StoryObj } from "@storybook/react";

import { ReleaseHealthPanel } from "@/components/publishing/release-health-panel";
import { mockPublications } from "@/features/publishing";

const publication = mockPublications[0];

if (!publication) {
  throw new Error("Expected publishing mock");
}

const meta = {
  title: "Publishing/ReleaseHealthPanel",
  component: ReleaseHealthPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof ReleaseHealthPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    publication,
  },
};
