import { describe, expect, it } from "vitest";

import {
  commandHref,
  createGlobalCommandRegistry,
  createNavigationCommands,
  createStaticCommands,
} from "@/features/studio/commands/command-registry";

describe("command-registry", () => {
  it("creates navigation commands with route metadata", () => {
    const commands = createNavigationCommands([
      {
        id: "dashboard-home",
        label: "Dashboard",
        description: "Studio overview",
        href: "/dashboard",
      },
    ]);

    expect(commands).toHaveLength(1);
    expect(commands[0]?.id).toBe("navigate:dashboard-home");
    expect(commandHref(commands[0]!)).toBe("/dashboard");
  });

  it("builds searchable global command registry", () => {
    const registry = createGlobalCommandRegistry(
      [
        {
          id: "production-studio",
          label: "Production Studio",
          description: "Production planning and delivery workspace",
          href: "/production/studio",
        },
      ],
      [
        {
          id: "open-intelligence",
          title: "Open Studio Intelligence",
          description: "Open the intelligence dashboard",
          category: "navigation",
          keywords: ["intelligence", "dashboard"],
          href: "/intelligence/studio",
        },
      ],
    );

    expect(registry.search("production")).toHaveLength(1);
    expect(registry.findById("navigate:production-studio")?.title).toBe("Production Studio");
    expect(registry.findById("command:open-intelligence")?.title).toBe("Open Studio Intelligence");
  });

  it("creates static commands with href metadata", () => {
    const commands = createStaticCommands([
      {
        id: "open-intelligence",
        title: "Open Studio Intelligence",
        description: "Open the intelligence dashboard",
        category: "navigation",
        keywords: ["intelligence"],
        href: "/intelligence/studio",
      },
    ]);

    expect(commands).toHaveLength(1);
    expect(commandHref(commands[0]!)).toBe("/intelligence/studio");
  });
});
