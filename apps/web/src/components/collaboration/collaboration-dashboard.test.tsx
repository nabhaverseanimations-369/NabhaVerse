import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { CollaborationDashboard } from "@/components/collaboration/collaboration-dashboard";
import { renderWithProviders } from "@/test/test-utils";

describe("CollaborationDashboard", () => {
  it("renders collaboration dashboard sections", async () => {
    renderWithProviders(<CollaborationDashboard />);

    expect(screen.getByRole("heading", { name: "Assigned To Me" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mentions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pending Reviews" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recent Activity" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Notification Summary" })).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<CollaborationDashboard />);

    await screen.findByRole("heading", { name: "Assigned To Me" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
