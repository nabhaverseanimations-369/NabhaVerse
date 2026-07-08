import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TagPicker, type TagPickerProps } from "@/components/character/tag-picker";

const meta = {
  title: "Character/TagPicker",
  component: TagPicker,
  tags: ["autodocs"],
} satisfies Meta<typeof TagPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function StatefulTagPicker(args: TagPickerProps): React.JSX.Element {
  const [selected, setSelected] = React.useState(args.selected);
  return <TagPicker {...args} selected={selected} onChange={setSelected} />;
}

export const Default: Story = {
  render: (args) => <StatefulTagPicker {...args} />,
  args: {
    selected: ["lead"],
    options: ["lead", "heroic", "android", "mentor"],
    onChange: () => {},
  },
};
