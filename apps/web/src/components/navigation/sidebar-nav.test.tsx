import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { renderWithProviders } from "@/test/test-utils";
import { setMockPathname } from "@/test/mock-utils";

describe("SidebarNav", () => {
  it("renders grouped navigation sections", () => {
    renderWithProviders(<SidebarNav collapsed={false} />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Creative")).toBeInTheDocument();
    expect(screen.getByText("Production")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("Publishing")).toBeInTheDocument();
    expect(screen.getByText("Administration")).toBeInTheDocument();
  });

  it("invokes onNavigate callback when a nav item is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    renderWithProviders(<SidebarNav collapsed={false} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("link", { name: "Characters" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard navigation and active page semantics", async () => {
    const user = userEvent.setup();
    setMockPathname("/creative/characters");
    renderWithProviders(<SidebarNav collapsed={false} />);

    await user.tab();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveFocus();
    expect(screen.getByRole("link", { name: "Characters" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<SidebarNav collapsed={false} />);
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
