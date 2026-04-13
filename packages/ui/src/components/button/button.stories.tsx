import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, fireEvent, expect } from "storybook/test";

import { Button } from "./";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs", "atom"],
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

const onClick = fn();

export const Primary: Story = {
  args: {
    children: "Hi",
    onClick,
  },

  play: async ({ canvas }) => {
    const btn = canvas.getByText("Hi");
    await fireEvent.click(btn);
    await expect(onClick).toHaveBeenCalledOnce();
  },
};

export default meta;
