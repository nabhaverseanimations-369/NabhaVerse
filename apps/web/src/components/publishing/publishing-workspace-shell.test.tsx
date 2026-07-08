import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { PublishingWorkspaceShell } from "@/components/publishing/publishing-workspace-shell";
import { mockPublications, PublishingWorkspaceProvider } from "@/features/publishing";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/publishing/studio/pub_lunara_s1e12/overview",
}));

const workspace = mockPublications[0];

if (!workspace) {
  throw new Error("Expected at least one publishing workspace");
}

describe("PublishingWorkspaceShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders semantic navigation and workspace content", async () => {
    renderWithProviders(
      <PublishingWorkspaceProvider
        initialPublication={workspace}
        initialPlugin="overview"
        initialMarkdown="# Publishing notes"
      >
        <PublishingWorkspaceShell workspaceId={workspace.id}>
          <div>Workspace body</div>
        </PublishingWorkspaceShell>
      </PublishingWorkspaceProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Publishing sections" })).toBeInTheDocument();
    expect(screen.getByText("Workspace body")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  });

  it("supports keyboard toggling of sidebar", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PublishingWorkspaceProvider
        initialPublication={workspace}
        initialPlugin="overview"
        initialMarkdown="# Publishing notes"
      >
        <PublishingWorkspaceShell workspaceId={workspace.id}>
          <div>Workspace body</div>
        </PublishingWorkspaceShell>
      </PublishingWorkspaceProvider>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("button", { name: "Expand publishing navigation" }),
    ).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(
      <PublishingWorkspaceProvider
        initialPublication={workspace}
        initialPlugin="overview"
        initialMarkdown="# Publishing notes"
      >
        <PublishingWorkspaceShell workspaceId={workspace.id}>
          <div>Workspace body</div>
        </PublishingWorkspaceShell>
      </PublishingWorkspaceProvider>,
    );

    await screen.findByRole("navigation", { name: "Publishing sections" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
