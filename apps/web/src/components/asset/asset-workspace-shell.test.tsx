import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { AssetWorkspaceProvider } from "@/features/asset/state/asset-workspace-state";
import { AssetWorkspaceShell } from "@/components/asset/asset-workspace-shell";
import { mockAssets } from "@/features/asset/data/asset-mocks";
import { renderWithProviders } from "@/test/test-utils";

describe("AssetWorkspaceShell", () => {
  it("renders navigation and workspace content", () => {
    const asset = mockAssets[0];

    if (!asset) {
      throw new Error("Expected at least one mock asset");
    }

    renderWithProviders(
      <AssetWorkspaceProvider
        initialAsset={asset}
        initialPlugin="overview"
        initialMarkdown="# Asset overview"
      >
        <AssetWorkspaceShell assetId={asset.id}>
          <div>Asset workspace content</div>
        </AssetWorkspaceShell>
      </AssetWorkspaceProvider>,
    );

    expect(screen.getByText("Asset Workspace")).toBeInTheDocument();
    expect(screen.getByText("Asset workspace content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });
});
