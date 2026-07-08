import { describe, expect, it } from "vitest";

import {
  aiPluginRegistry,
  getAIPlugin,
  isAIPluginId,
} from "@/features/ai/plugins/ai-plugin-registry";

describe("ai-plugin-registry", () => {
  it("registers all required AI plugins", () => {
    expect(aiPluginRegistry).toHaveLength(14);
    expect(aiPluginRegistry[0]?.id).toBe("overview");
    expect(aiPluginRegistry.at(-1)?.id).toBe("comments");
    expect(
      aiPluginRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves plugin ids", () => {
    expect(isAIPluginId("overview")).toBe(true);
    expect(getAIPlugin("output-gallery").title).toBe("Output Gallery");
    expect(isAIPluginId("not-a-plugin")).toBe(false);
  });
});
