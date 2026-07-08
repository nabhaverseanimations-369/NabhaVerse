import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { DocumentNavigation } from "@/components/character/document-navigation";
import { renderWithProviders } from "@/test/test-utils";

describe("DocumentNavigation", () => {
  it("renders all character workspace sections", () => {
    renderWithProviders(
      <DocumentNavigation characterId="chr_aurora" activeSection="overview" collapsed={false} />,
    );

    expect(screen.getByRole("navigation", { name: "Character sections" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Character Bible" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Version History" })).toBeInTheDocument();
  });
});
