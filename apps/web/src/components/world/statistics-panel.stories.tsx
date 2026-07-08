import type { Meta, StoryObj } from "@storybook/react";

import { StatisticsPanel } from "@/components/world/statistics-panel";

const meta = {
  title: "World/StatisticsPanel",
  component: StatisticsPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof StatisticsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    statistics: {
      regions: 12,
      locations: 84,
      cultures: 9,
      species: 6,
    },
  },
};
