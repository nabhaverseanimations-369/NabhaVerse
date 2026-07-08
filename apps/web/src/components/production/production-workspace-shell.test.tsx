import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { ProductionWorkspaceShell } from "@/components/production/production-workspace-shell";
import { mockProductions } from "@/features/production";
import { ProductionWorkspaceProvider } from "@/features/production";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/production/studio/prd_lunara_s1/overview",
}));

const production = mockProductions[0];

if (!production) {
  throw new Error("Expected at least one production mock");
}

describe("ProductionWorkspaceShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders semantic navigation and workspace content", async () => {
    renderWithProviders(
      <ProductionWorkspaceProvider
        initialProduction={production}
        initialPlugin="overview"
        initialMarkdown="# Production notes"
      >
        <ProductionWorkspaceShell productionId={production.id}>
          <div>Workspace body</div>
        </ProductionWorkspaceShell>
      </ProductionWorkspaceProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Production sections" })).toBeInTheDocument();
    expect(screen.getByText("Workspace body")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  });

  it("supports keyboard toggling of sidebar", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ProductionWorkspaceProvider
        initialProduction={production}
        initialPlugin="overview"
        initialMarkdown="# Production notes"
      >
        <ProductionWorkspaceShell productionId={production.id}>
          <div>Workspace body</div>
        </ProductionWorkspaceShell>
      </ProductionWorkspaceProvider>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("button", { name: "Expand production navigation" }),
    ).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(
      <ProductionWorkspaceProvider
        initialProduction={production}
        initialPlugin="overview"
        initialMarkdown="# Production notes"
      >
        <ProductionWorkspaceShell productionId={production.id}>
          <div>Workspace body</div>
        </ProductionWorkspaceShell>
      </ProductionWorkspaceProvider>,
    );

    await screen.findByRole("navigation", { name: "Production sections" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
