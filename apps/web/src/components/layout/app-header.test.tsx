import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { AppHeader } from "@/components/layout/app-header";
import { renderWithProviders } from "@/test/test-utils";

describe("AppHeader", () => {
  it("renders workspace shell controls", () => {
    renderWithProviders(<AppHeader />);

    expect(screen.getByRole("button", { name: "Open navigation menu" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Switch workspace" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search workspace" })).toBeInTheDocument();
    expect(screen.getAllByTestId("dynamic-control").length).toBeGreaterThan(0);
  });
});
