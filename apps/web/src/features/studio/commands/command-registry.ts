import {
  createStudioCommandRegistry,
  type StudioCommandCategory,
  type StudioCommandDefinition,
  type StudioKeyboardShortcut,
} from "@nabhaverse/studio-sdk";

export interface NavigationCommandSource {
  id: string;
  label: string;
  description: string;
  href: string;
}

export interface StaticCommandSource {
  id: string;
  title: string;
  description: string;
  category: StudioCommandCategory;
  keywords: readonly string[];
  href?: string;
  enabledByDefault?: boolean;
  shortcut?: StudioKeyboardShortcut;
  metadata?: Record<string, string | number | boolean | null>;
}

export type GlobalCommandId = `navigate:${string}` | `command:${string}`;

const defaultShortcut: StudioKeyboardShortcut = {
  key: "k",
  meta: true,
};

function categoryForHref(href: string): StudioCommandCategory {
  if (href.startsWith("/creative/")) {
    return "workspace";
  }
  if (href.startsWith("/production/")) {
    return "workspace";
  }
  if (href.startsWith("/ai/")) {
    return "workspace";
  }
  return "navigation";
}

export function createNavigationCommands(
  items: readonly NavigationCommandSource[],
): readonly StudioCommandDefinition<GlobalCommandId>[] {
  return items.map((item) => ({
    id: `navigate:${item.id}`,
    title: item.label,
    description: item.description,
    category: categoryForHref(item.href),
    keywords: [item.label.toLowerCase(), item.description.toLowerCase()],
    shortcut: defaultShortcut,
    enabledByDefault: true,
    metadata: {
      href: item.href,
    },
  }));
}

export function createStaticCommands(
  commands: readonly StaticCommandSource[],
): readonly StudioCommandDefinition<GlobalCommandId>[] {
  return commands.map((command) => {
    const definition: StudioCommandDefinition<GlobalCommandId> = {
      id: `command:${command.id}`,
      title: command.title,
      description: command.description,
      category: command.category,
      keywords: command.keywords,
      enabledByDefault: command.enabledByDefault ?? true,
      metadata: {
        ...(command.href ? { href: command.href } : {}),
        ...(command.metadata ?? {}),
      },
    };

    if (command.shortcut) {
      definition.shortcut = command.shortcut;
    }

    return definition;
  });
}

export function createGlobalCommandRegistry(
  items: readonly NavigationCommandSource[],
  extraCommands: readonly StaticCommandSource[] = [],
) {
  return createStudioCommandRegistry([
    ...createNavigationCommands(items),
    ...createStaticCommands(extraCommands),
  ]);
}

export function commandHref(command: StudioCommandDefinition): string | null {
  const href = command.metadata?.href;
  return typeof href === "string" ? href : null;
}
