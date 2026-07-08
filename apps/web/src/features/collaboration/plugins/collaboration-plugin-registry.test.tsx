import { describe, expect, it } from "vitest";

import {
  collaborationPluginRegistry,
  getCollaborationPlugin,
  isCollaborationPluginId,
} from "@/features/collaboration/plugins/collaboration-plugin-registry";

describe("collaboration-plugin-registry", () => {
  it("registers all required collaboration plugins", () => {
    expect(collaborationPluginRegistry).toHaveLength(11);
    expect(collaborationPluginRegistry[0]?.id).toBe("overview");
    expect(collaborationPluginRegistry.at(-1)?.id).toBe("settings");
    expect(
      collaborationPluginRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves collaboration plugin ids", () => {
    expect(isCollaborationPluginId("overview")).toBe(true);
    expect(getCollaborationPlugin("reviews").title).toBe("Reviews");
    expect(isCollaborationPluginId("not-a-plugin")).toBe(false);
  });
});
