import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { getWorldPlugin, isWorldPluginId, worldPluginRegistry } from "@/features/world";
import { mockWorlds } from "@/features/world/data/world-mocks";
import { WorldWorkspaceProvider } from "@/features/world/state/world-workspace-state";
import { renderWithProviders } from "@/test/test-utils";

describe("world-plugin-registry", () => {
  it("registers all world plugins in order", () => {
    expect(worldPluginRegistry).toHaveLength(27);
    expect(worldPluginRegistry[0]?.id).toBe("overview");
    expect(worldPluginRegistry.at(-1)?.id).toBe("activity");
    expect(
      worldPluginRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves and validates plugin ids", () => {
    expect(isWorldPluginId("overview")).toBe(true);
    expect(getWorldPlugin("overview").title).toBe("Overview");
    expect(isWorldPluginId("not-a-plugin")).toBe(false);
  });

  it("loads the overview plugin component", async () => {
    const world = mockWorlds[0];

    if (!world) {
      throw new Error("Expected at least one mock world");
    }

    const plugin = getWorldPlugin("overview");

    renderWithProviders(
      <WorldWorkspaceProvider
        initialWorld={world}
        initialPlugin="overview"
        initialMarkdown="# World overview"
      >
        <plugin.component entity={world} />
      </WorldWorkspaceProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText(world.name)).toBeInTheDocument();
  });
});
