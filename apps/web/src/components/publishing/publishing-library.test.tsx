import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { PublishingLibrary } from "@/components/publishing/publishing-library";
import { mockPublications } from "@/features/publishing";
import { renderWithProviders } from "@/test/test-utils";

describe("PublishingLibrary", () => {
  it("filters publications by search text", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PublishingLibrary initialPublications={mockPublications} initialLoading={false} />,
    );

    const search = screen.getByRole("textbox", { name: "Search" });
    await user.clear(search);
    await user.type(search, "Lunara");

    expect(screen.getAllByRole("link", { name: /Lunara/ }).length).toBeGreaterThan(0);
  });

  it("supports release status and favorites filters", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PublishingLibrary initialPublications={mockPublications} initialLoading={false} />,
    );

    await user.click(screen.getByRole("button", { name: "Favorites only" }));
    expect(screen.getAllByRole("button", { name: /Unfavorite|Favorite/ }).length).toBeGreaterThan(
      0,
    );

    const scheduledFilter = screen.getByRole("button", { name: "Scheduled only" });
    await user.click(scheduledFilter);

    expect(screen.getByRole("group", { name: "Status filters" })).toBeInTheDocument();
  });

  it("can switch to list view", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PublishingLibrary initialPublications={mockPublications} initialLoading={false} />,
    );

    await user.click(screen.getByRole("button", { name: /List/i }));
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders empty state when no items match filters", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PublishingLibrary initialPublications={mockPublications} initialLoading={false} />,
    );

    const search = screen.getByRole("textbox", { name: "Search" });
    await user.clear(search);
    await user.type(search, "ThisWillNeverMatch");

    expect(screen.getByText("No publications found")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(
      <PublishingLibrary initialPublications={mockPublications} initialLoading={false} />,
    );

    await screen.findByRole("heading", { name: "Publishing Library" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
