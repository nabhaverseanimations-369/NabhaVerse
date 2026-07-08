import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { WorldLibrary } from "@/components/world/world-library";
import { renderWithProviders } from "@/test/test-utils";

describe("WorldLibrary", () => {
  it("renders and filters worlds", async () => {
    renderWithProviders(<WorldLibrary initialLoading={false} />);

    expect(await screen.findByRole("heading", { name: "World Library" })).toBeInTheDocument();
    expect(screen.getByText("Lunara Basin")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "Auric" },
    });

    expect(screen.getByText("Auric Frontier")).toBeInTheDocument();
    expect(screen.queryByText("Lunara Basin")).not.toBeInTheDocument();
  });

  it("supports tag and status filters plus empty state", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorldLibrary initialLoading={false} />);

    await user.click(screen.getByRole("button", { name: "#coastal" }));
    await user.click(screen.getByRole("button", { name: /Published/i }));

    expect(screen.getByText("Lunara Basin")).toBeInTheDocument();
    expect(screen.queryByText("Auric Frontier")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "#coastal" }));
    await user.click(screen.getByRole("button", { name: /Published/i }));
    await user.type(screen.getByRole("textbox", { name: "Search" }), "zzz-unmatched");

    expect(screen.getByText("No worlds found")).toBeInTheDocument();
  });

  it("shows the loading state deterministically", async () => {
    renderWithProviders(<WorldLibrary initialLoading={true} loadingDelayMs={120000} />);

    expect(await screen.findByText("Loading worlds...")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<WorldLibrary initialLoading={false} />);
    await screen.findByRole("heading", { name: "World Library" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
