import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { PromptLibrary } from "@/components/ai/prompt-library";
import { mockPrompts } from "@/features/ai";
import { renderWithProviders } from "@/test/test-utils";

describe("PromptLibrary", () => {
  it("supports search and filtering", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PromptLibrary prompts={mockPrompts} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "voice" },
    });

    expect(screen.getByText("Character Voice Sync")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "dialogue" }));
    expect(screen.getByText("Character Voice Sync")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Favorite Prompts" }));
    expect(screen.getByText("No prompts found")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = renderWithProviders(<PromptLibrary prompts={mockPrompts} />);
    await screen.findByRole("heading", { name: "Prompt Library" });
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toHaveLength(0);
  });
});
