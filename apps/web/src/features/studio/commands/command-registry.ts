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

export type GlobalCommandId = `navigate:${string}`;

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

export function createGlobalCommandRegistry(items: readonly NavigationCommandSource[]) {
  return createStudioCommandRegistry(createNavigationCommands(items));
}

export function commandHref(command: StudioCommandDefinition): string | null {
  const href = command.metadata?.href;
  return typeof href === "string" ? href : null;
}
