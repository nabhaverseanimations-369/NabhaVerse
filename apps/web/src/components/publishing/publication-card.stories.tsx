import type { Meta, StoryObj } from "@storybook/react";

import { PublicationCard } from "@/components/publishing/publication-card";
import { mockPublications } from "@/features/publishing";

const publication = mockPublications[0];

if (!publication) {
  throw new Error("Expected publishing mock");
}

const meta = {
  title: "Publishing/PublicationCard",
  component: PublicationCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PublicationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    publication,
    href: `/publishing/studio/${publication.id}/overview`,
    onToggleFavorite: () => undefined,
  },
};
