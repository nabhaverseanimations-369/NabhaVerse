import { describe, expect, it } from "vitest";

import {
  getProductionPlugin,
  isProductionPluginId,
  productionPluginRegistry,
} from "@/features/production/plugins/production-plugin-registry";

describe("production-plugin-registry", () => {
  it("registers all required production plugins", () => {
    expect(productionPluginRegistry).toHaveLength(14);
    expect(productionPluginRegistry[0]?.id).toBe("overview");
    expect(productionPluginRegistry.at(-1)?.id).toBe("comments");
    expect(
      productionPluginRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves plugin ids", () => {
    expect(isProductionPluginId("overview")).toBe(true);
    expect(getProductionPlugin("task-queue").title).toBe("Task Queue");
    expect(isProductionPluginId("not-a-plugin")).toBe(false);
  });
});
