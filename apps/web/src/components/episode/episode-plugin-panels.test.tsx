import { describe, expect, it } from "vitest";

import {
  getEpisodePlugin,
  isEpisodePluginId,
  episodePluginRegistry,
} from "@/features/episode/plugins/episode-plugin-registry";

describe("episode-plugin-registry", () => {
  it("registers all episode plugins in order", () => {
    expect(episodePluginRegistry).toHaveLength(14);
    expect(episodePluginRegistry[0]?.id).toBe("overview");
    expect(episodePluginRegistry.at(-1)?.id).toBe("activity");
    expect(
      episodePluginRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves and validates plugin ids", () => {
    expect(isEpisodePluginId("overview")).toBe(true);
    expect(getEpisodePlugin("overview").title).toBe("Overview");
    expect(isEpisodePluginId("not-a-plugin")).toBe(false);
  });
});
