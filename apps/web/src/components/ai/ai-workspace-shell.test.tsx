import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { AIWorkspaceShell } from "@/components/ai/ai-workspace-shell";
import { mockAIWorkspace, mockPrompts } from "@/features/ai";
import { AIWorkspaceProvider } from "@/features/ai";
import { renderWithProviders } from "@/test/test-utils";

describe("AIWorkspaceShell", () => {
  it("renders navigation and workspace content", () => {
    const prompt = mockPrompts[0];

    if (!prompt) {
      throw new Error("Expected at least one AI prompt");
    }

    renderWithProviders(
      <AIWorkspaceProvider
        initialWorkspace={mockAIWorkspace}
        initialPlugin="overview"
        initialPrompt={prompt}
      >
        <AIWorkspaceShell workspaceId={mockAIWorkspace.id}>
          <div>AI workspace content</div>
        </AIWorkspaceShell>
      </AIWorkspaceProvider>,
    );

    expect(screen.getByText("AI Studio")).toBeInTheDocument();
    expect(screen.getByText("AI workspace content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });
});
