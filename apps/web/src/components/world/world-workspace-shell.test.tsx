import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { WorldWorkspaceShell } from "@/components/world/world-workspace-shell";
import { mockWorlds } from "@/features/world/data/world-mocks";
import { WorldWorkspaceProvider } from "@/features/world/state/world-workspace-state";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/creative/worlds/wld_lunara/overview",
}));

const world = mockWorlds[0];

if (!world) {
  throw new Error("Expected at least one mock world");
}

describe("WorldWorkspaceShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders semantic navigation and workspace content", async () => {
    renderWithProviders(
      <WorldWorkspaceProvider
        initialWorld={world}
        initialPlugin="overview"
        initialMarkdown="# World notes"
      >
        <WorldWorkspaceShell worldId={world.id}>
          <div>Workspace body</div>
        </WorldWorkspaceShell>
      </WorldWorkspaceProvider>,
    );

    expect(screen.getByRole("navigation", { name: "World sections" })).toBeInTheDocument();
    expect(screen.getByText("Workspace body")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  });

  it("supports keyboard toggling of the sidebar", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <WorldWorkspaceProvider
        initialWorld={world}
        initialPlugin="overview"
        initialMarkdown="# World notes"
      >
        <WorldWorkspaceShell worldId={world.id}>
          <div>Workspace body</div>
        </WorldWorkspaceShell>
      </WorldWorkspaceProvider>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("button", { name: "Expand world navigation" })).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(
      <WorldWorkspaceProvider
        initialWorld={world}
        initialPlugin="overview"
        initialMarkdown="# World notes"
      >
        <WorldWorkspaceShell worldId={world.id}>
          <div>Workspace body</div>
        </WorldWorkspaceShell>
      </WorldWorkspaceProvider>,
    );

    await screen.findByRole("navigation", { name: "World sections" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
