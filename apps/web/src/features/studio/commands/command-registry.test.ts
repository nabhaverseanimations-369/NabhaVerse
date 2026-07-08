import { describe, expect, it } from "vitest";

import {
  commandHref,
  createGlobalCommandRegistry,
  createNavigationCommands,
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
    const registry = createGlobalCommandRegistry([
      {
        id: "production-studio",
        label: "Production Studio",
        description: "Production planning and delivery workspace",
        href: "/production/studio",
      },
    ]);

    expect(registry.search("production")).toHaveLength(1);
    expect(registry.findById("navigate:production-studio")?.title).toBe("Production Studio");
  });
});
