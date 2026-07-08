import { describe, expect, it } from "vitest";
import { isSortedByOrder, pluginIds } from "@nabhaverse/studio-sdk";

import {
  characterSheetRegistry,
  getCharacterSheetPlugin,
  isCharacterSection,
} from "@/features/character/constants/character-sections";

describe("character-sheet-registry", () => {
  it("registers all character sheets in order", () => {
    expect(characterSheetRegistry).toHaveLength(21);
    expect(pluginIds(characterSheetRegistry)[0]).toBe("overview");
    expect(pluginIds(characterSheetRegistry).at(-1)).toBe("activity");
    expect(isSortedByOrder(characterSheetRegistry)).toBe(true);
  });

  it("resolves and validates plugin ids", () => {
    expect(isCharacterSection("overview")).toBe(true);
    expect(getCharacterSheetPlugin("overview").title).toBe("Overview");
    expect(isCharacterSection("not-a-sheet")).toBe(false);
  });
});
