import { describe, expect, it } from "vitest";

import {
  characterSheetRegistry,
  getCharacterSheetPlugin,
  isCharacterSection,
} from "@/features/character/constants/character-sections";

describe("character-sheet-registry", () => {
  it("registers all character sheets in order", () => {
    expect(characterSheetRegistry).toHaveLength(21);
    expect(characterSheetRegistry[0]?.id).toBe("overview");
    expect(characterSheetRegistry.at(-1)?.id).toBe("activity");
    expect(
      characterSheetRegistry.every(
        (plugin, index, plugins) => index === 0 || plugin.order >= plugins[index - 1]!.order,
      ),
    ).toBe(true);
  });

  it("resolves and validates plugin ids", () => {
    expect(isCharacterSection("overview")).toBe(true);
    expect(getCharacterSheetPlugin("overview").title).toBe("Overview");
    expect(isCharacterSection("not-a-sheet")).toBe(false);
  });
});
