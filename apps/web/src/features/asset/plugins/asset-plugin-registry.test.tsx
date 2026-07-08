import { describe, expect, it } from "vitest";

import {
  assetPluginRegistry,
  getAssetPlugin,
  isAssetPluginId,
} from "@/features/asset/plugins/asset-plugin-registry";

describe("asset-plugin-registry", () => {
  it("registers all asset plugins in order", () => {
    expect(assetPluginRegistry).toHaveLength(10);
    expect(assetPluginRegistry[0]?.id).toBe("overview");
    expect(assetPluginRegistry.at(-1)?.id).toBe("permissions");
    expect(
      assetPluginRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves and validates plugin ids", () => {
    expect(isAssetPluginId("overview")).toBe(true);
    expect(getAssetPlugin("overview").title).toBe("Overview");
    expect(isAssetPluginId("not-a-plugin")).toBe(false);
  });
});
