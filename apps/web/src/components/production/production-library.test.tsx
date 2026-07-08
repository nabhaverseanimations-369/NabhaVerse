import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { ProductionLibrary } from "@/components/production/production-library";
import { renderWithProviders } from "@/test/test-utils";

describe("ProductionLibrary", () => {
  it("supports search, filters, and list toggle", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductionLibrary initialLoading={false} />);

    expect(await screen.findByRole("heading", { name: "Production Library" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "Lunara Season 1" },
    });

    expect(screen.getByText("Lunara Season 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByRole("link", { name: "Lunara Season 1" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "#release" }));
    expect(screen.getByText("Lunara Season 1")).toBeInTheDocument();
  });

  it("shows empty state for no-match query", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductionLibrary initialLoading={false} />);

    await user.type(screen.getByRole("textbox", { name: "Search" }), "zzz-unmatched");

    expect(screen.getByText("No productions found")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<ProductionLibrary initialLoading={false} />);
    await screen.findByRole("heading", { name: "Production Library" });
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
