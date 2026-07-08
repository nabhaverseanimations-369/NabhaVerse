import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { AssetLibrary } from "@/components/asset/asset-library";
import { renderWithProviders } from "@/test/test-utils";

describe("AssetLibrary", () => {
  it("supports search, filters, and pagination", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AssetLibrary initialLoading={false} />);

    expect(await screen.findByRole("heading", { name: "Asset Library" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "World" },
    });

    expect(screen.getAllByText("Lunara World Board").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "concept-art" }));
    expect(screen.getAllByText("Lunara World Board").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.click(screen.getByRole("button", { name: "Load more assets" }));
    expect(screen.getAllByText("Aurora Voice Session").length).toBeGreaterThan(0);
  });

  it("shows an empty state when filters exclude everything", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AssetLibrary initialLoading={false} />);

    await user.type(screen.getByRole("textbox", { name: "Search" }), "zzz-unmatched");

    expect(screen.getByText("No assets found")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<AssetLibrary initialLoading={false} />);
    await screen.findByRole("heading", { name: "Asset Library" });
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toHaveLength(0);
  });
});
