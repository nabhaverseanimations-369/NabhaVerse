import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { renderWithProviders } from "@/test/test-utils";

describe("ThemeSwitcher", () => {
  it("allows keyboard users to open theme menu and choose dark mode", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ThemeSwitcher />);

    const trigger = screen.getByRole("button", { name: "Change theme" });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("menu", { name: "Theme switcher" })).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: /Dark/i }));
    expect(screen.queryByRole("menu", { name: "Theme switcher" })).not.toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
