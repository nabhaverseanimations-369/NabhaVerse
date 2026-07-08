import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { DocumentNavigation } from "@/components/world/document-navigation";
import { renderWithProviders } from "@/test/test-utils";

describe("DocumentNavigation", () => {
  it("renders world workspace sections", () => {
    renderWithProviders(
      <DocumentNavigation worldId="wld_lunara" activePlugin="overview" collapsed={false} />,
    );

    expect(screen.getByRole("navigation", { name: "World sections" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Geography" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Activity" })).toBeInTheDocument();
  });
});
