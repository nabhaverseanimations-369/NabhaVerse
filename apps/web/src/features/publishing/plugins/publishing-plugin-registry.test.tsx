import { describe, expect, it } from "vitest";

import {
  getPublishingPlugin,
  isPublishingPluginId,
  publishingPluginRegistry,
} from "@/features/publishing/plugins/publishing-plugin-registry";

describe("publishing-plugin-registry", () => {
  it("registers all required publishing plugins", () => {
    expect(publishingPluginRegistry).toHaveLength(12);
    expect(publishingPluginRegistry[0]?.id).toBe("overview");
    expect(publishingPluginRegistry.at(-1)?.id).toBe("settings");
    expect(
      publishingPluginRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves plugin ids", () => {
    expect(isPublishingPluginId("overview")).toBe(true);
    expect(getPublishingPlugin("release-details").title).toBe("Release Details");
    expect(isPublishingPluginId("not-a-plugin")).toBe(false);
  });
});
