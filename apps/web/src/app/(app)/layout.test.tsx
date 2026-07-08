import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import AppLayout from "@/app/(app)/layout";
import { renderWithProviders } from "@/test/test-utils";

describe("Workspace Layout", () => {
  it("renders app chrome and page content", () => {
    renderWithProviders(
      <AppLayout>
        <div>Workspace content</div>
      </AppLayout>,
    );

    expect(screen.getByText("NabhaVerse Studio")).toBeInTheDocument();
    expect(screen.getByText("Workspace content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
