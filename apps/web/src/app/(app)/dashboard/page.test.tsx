import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import DashboardPage from "@/app/(app)/dashboard/page";
import { renderWithProviders } from "@/test/test-utils";

describe("Dashboard Page", () => {
  it("renders dashboard sections after loading skeleton", async () => {
    vi.useFakeTimers();
    renderWithProviders(<DashboardPage />);

    expect(screen.queryByText(/Welcome back,/i)).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
    expect(screen.getByText("Continue Working")).toBeInTheDocument();
    expect(screen.getByText("System Status")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("has no obvious a11y violations once loaded", async () => {
    vi.useFakeTimers();
    const { container } = renderWithProviders(<DashboardPage />);
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();

    vi.useRealTimers();

    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
