import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { EpisodeLibrary } from "@/components/episode/episode-library";
import { renderWithProviders } from "@/test/test-utils";

describe("EpisodeLibrary", () => {
  it("supports search, filtering, and season grouping", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EpisodeLibrary initialLoading={false} />);

    expect(await screen.findByRole("heading", { name: "Episode Library" })).toBeInTheDocument();
    expect(screen.getByText("Season 1")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "Rift" },
    });

    expect(screen.getByText("Episode 12: Rift Wake")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "#pilot-arc" }));
    expect(screen.getByText("Episode 12: Rift Wake")).toBeInTheDocument();
  });

  it("shows empty state for no-match query", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EpisodeLibrary initialLoading={false} />);

    await user.type(screen.getByRole("textbox", { name: "Search" }), "zzz-unmatched");

    expect(screen.getByText("No episodes found")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<EpisodeLibrary initialLoading={false} />);
    await screen.findByRole("heading", { name: "Episode Library" });
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
