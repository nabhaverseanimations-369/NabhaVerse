import type { StudioPluginDefinition } from "../contracts/plugin";

export function isSortedByOrder<TEntity, TId extends string>(
  plugins: readonly StudioPluginDefinition<TEntity, TId>[],
): boolean {
  return plugins.every((plugin, index) => index === 0 || plugin.order >= plugins[index - 1]!.order);
}

export function pluginIds<TEntity, TId extends string>(
  plugins: readonly StudioPluginDefinition<TEntity, TId>[],
): TId[] {
  return plugins.map((plugin) => plugin.id);
}
