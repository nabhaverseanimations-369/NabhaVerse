export type StudioCommandCategory =
  "navigation" | "workspace" | "editing" | "review" | "system" | "developer";

export interface StudioCommandContext {
  workspaceId?: string;
  activePluginId?: string;
  query?: string;
}

export interface StudioKeyboardShortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

export interface StudioCommandExecutionResult {
  ok: boolean;
  message?: string;
}

export interface StudioCommandDefinition<TId extends string = string> {
  id: TId;
  title: string;
  description: string;
  category: StudioCommandCategory;
  keywords: readonly string[];
  shortcut?: StudioKeyboardShortcut;
  enabledByDefault: boolean;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface StudioCommandExecutor<TId extends string = string> {
  execute: (commandId: TId, context: StudioCommandContext) => Promise<StudioCommandExecutionResult>;
}

export interface StudioCommandRegistry<TId extends string = string> {
  commands: readonly StudioCommandDefinition<TId>[];
  findById: (id: TId) => StudioCommandDefinition<TId> | undefined;
  search: (query: string) => StudioCommandDefinition<TId>[];
}

export function createStudioCommandRegistry<TId extends string>(
  commands: readonly StudioCommandDefinition<TId>[],
): StudioCommandRegistry<TId> {
  return {
    commands,
    findById(id) {
      return commands.find((command) => command.id === id);
    },
    search(query) {
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        return [...commands];
      }
      return commands.filter((command) =>
        `${command.title} ${command.description} ${command.keywords.join(" ")}`
          .toLowerCase()
          .includes(normalized),
      );
    },
  };
}
