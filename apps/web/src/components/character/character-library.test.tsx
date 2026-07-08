import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { CharacterLibrary } from "@/components/character/character-library";
import { renderWithProviders } from "@/test/test-utils";

describe("CharacterLibrary", () => {
  it("supports search and view switching", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CharacterLibrary />);

    expect(await screen.findByText("Character Library")).toBeInTheDocument();

    const search = await screen.findByRole("textbox", { name: "Search" });
    fireEvent.change(search, { target: { value: "Aurora" } });

    expect(screen.getByText("Aurora Vale")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /List/i }));
    expect(screen.getByRole("button", { name: "Unfavorite" })).toBeInTheDocument();
  });

  it("shows empty state for no-match query", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CharacterLibrary />);

    const search = await screen.findByRole("textbox", { name: "Search" });
    await user.type(search, "zzz-unmatched");

    expect(screen.getByText("No characters found")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<CharacterLibrary />);
    await screen.findByRole("heading", { name: "Character Library" });
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
