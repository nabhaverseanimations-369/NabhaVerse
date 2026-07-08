import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Sidebar } from "@/components/layout/sidebar";
import { renderWithProviders } from "@/test/test-utils";

describe("Sidebar", () => {
  it("renders navigation and toggles collapsed state", async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();

    renderWithProviders(<Sidebar collapsed={false} onCollapsedChange={onCollapsedChange} />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByText("NabhaVerse Studio")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });
});
