import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { IntelligenceDashboard } from "@/components/intelligence/intelligence-dashboard";
import { renderWithProviders } from "@/test/test-utils";

describe("IntelligenceDashboard", () => {
  it("renders dashboard sections", () => {
    renderWithProviders(<IntelligenceDashboard />);

    expect(screen.getByRole("heading", { name: "Global Activity" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recently Opened" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recommended Items" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Saved Searches" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cross-Studio Insights" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Platform Health" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quick Actions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Personal Workspace" })).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<IntelligenceDashboard />);

    await screen.findByRole("heading", { name: "Global Activity" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
