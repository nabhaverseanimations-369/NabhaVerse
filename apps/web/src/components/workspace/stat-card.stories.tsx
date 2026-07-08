import type { Meta, StoryObj } from "@storybook/react";

import { StatCard } from "@/components/workspace/stat-card";

const meta = {
  title: "Workspace/StatCard",
  component: StatCard,
  tags: ["autodocs"],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PositiveTrend: Story = {
  args: {
    label: "Production Velocity",
    value: "86%",
    delta: "+4.3%",
    trend: "up",
  },
};

export const NeutralTrend: Story = {
  args: {
    label: "AI Budget",
    value: "62%",
    delta: "Within target",
    trend: "neutral",
  },
};

export const DownTrend: Story = {
  args: {
    label: "Incidents",
    value: "1",
    delta: "-2 resolved",
    trend: "down",
  },
};
