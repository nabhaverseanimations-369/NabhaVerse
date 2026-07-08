import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { CollaborationWorkspaceShell } from "@/components/collaboration/collaboration-workspace-shell";
import {
  CollaborationWorkspaceProvider,
  mockCollaborationWorkspaces,
} from "@/features/collaboration";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/collaboration/studio/collab_launch_readiness/overview",
}));

const workspace = mockCollaborationWorkspaces[0];

if (!workspace) {
  throw new Error("Expected collaboration workspace mock");
}

describe("CollaborationWorkspaceShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders semantic navigation and workspace content", () => {
    renderWithProviders(
      <CollaborationWorkspaceProvider initialWorkspace={workspace} initialPlugin="overview">
        <CollaborationWorkspaceShell workspaceId={workspace.id}>
          <div>Workspace body</div>
        </CollaborationWorkspaceShell>
      </CollaborationWorkspaceProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Collaboration sections" })).toBeInTheDocument();
    expect(screen.getByText("Workspace body")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  });

  it("supports keyboard toggling of sidebar", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CollaborationWorkspaceProvider initialWorkspace={workspace} initialPlugin="overview">
        <CollaborationWorkspaceShell workspaceId={workspace.id}>
          <div>Workspace body</div>
        </CollaborationWorkspaceShell>
      </CollaborationWorkspaceProvider>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("button", { name: "Expand collaboration navigation" }),
    ).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(
      <CollaborationWorkspaceProvider initialWorkspace={workspace} initialPlugin="overview">
        <CollaborationWorkspaceShell workspaceId={workspace.id}>
          <div>Workspace body</div>
        </CollaborationWorkspaceShell>
      </CollaborationWorkspaceProvider>,
    );

    await screen.findByRole("navigation", { name: "Collaboration sections" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
