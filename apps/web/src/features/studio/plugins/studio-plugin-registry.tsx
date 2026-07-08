import * as React from "react";
import type { LucideIcon } from "lucide-react";

export type StudioPluginCategory =
  | "overview"
  | "bible"
  | "design"
  | "ai"
  | "reference"
  | "collaboration"
  | "geography"
  | "history"
  | "culture"
  | "systems";

export interface StudioPluginProps<TEntity> {
  entity: TEntity;
}

export interface StudioPluginDefinition<TEntity, TId extends string = string> {
  id: TId;
  title: string;
  icon: LucideIcon;
  category: StudioPluginCategory;
  order: number;
  route: string;
  component: React.ComponentType<StudioPluginProps<TEntity>>;
  permissions: readonly string[];
  validation: readonly string[];
  featureFlags: readonly string[];
  description: string;
}

export function createStudioDocumentPlugin<TEntity, TId extends string>(
  metadata: Omit<
    StudioPluginDefinition<TEntity, TId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
  component: React.ComponentType<StudioPluginProps<TEntity>>,
  permissions: readonly string[],
  validation: readonly string[],
  featureFlags: readonly string[],
): StudioPluginDefinition<TEntity, TId> {
  return {
    ...metadata,
    component,
    permissions,
    validation,
    featureFlags,
  };
}

export function buildStudioPluginLookup<TEntity, TId extends string>(
  plugins: readonly StudioPluginDefinition<TEntity, TId>[],
): Map<TId, StudioPluginDefinition<TEntity, TId>> {
  return new Map(plugins.map((plugin) => [plugin.id, plugin]));
}

export function isStudioPluginId<TId extends string>(
  value: string,
  plugins: readonly { id: TId }[],
): value is TId {
  return plugins.some((plugin) => plugin.id === value);
}
