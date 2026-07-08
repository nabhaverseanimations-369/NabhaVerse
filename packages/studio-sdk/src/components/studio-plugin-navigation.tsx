import * as React from "react";
import Link from "next/link";
import { cn } from "@nabhaverse/ui";

interface StudioPluginNavigationEntry<TId extends string> {
  id: TId;
  title: string;
}

export interface StudioPluginNavigationProps<TId extends string> {
  entityId: string;
  activePluginId: TId;
  plugins: readonly StudioPluginNavigationEntry<TId>[];
  collapsed?: boolean;
  label: string;
  getHref: (plugin: StudioPluginNavigationEntry<TId>, entityId: string) => string;
}

function Item<TId extends string>({
  plugin,
  entityId,
  active,
  collapsed,
  getHref,
}: {
  plugin: StudioPluginNavigationEntry<TId>;
  entityId: string;
  active: boolean;
  collapsed: boolean;
  getHref: (plugin: StudioPluginNavigationEntry<TId>, entityId: string) => string;
}): React.JSX.Element {
  const href = getHref(plugin, entityId);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
        active
          ? "bg-[var(--color-surface-muted)] font-medium text-[var(--color-text-primary)]"
          : "text-[var(--color-text-secondary)]",
      )}
      title={collapsed ? plugin.title : undefined}
    >
      {collapsed ? (
        <span aria-hidden="true" className="font-mono text-xs uppercase tracking-wide">
          {plugin.title.slice(0, 2)}
        </span>
      ) : (
        plugin.title
      )}
      {collapsed ? <span className="sr-only">{plugin.title}</span> : null}
    </Link>
  );
}

export function StudioPluginNavigation<TId extends string>({
  entityId,
  activePluginId,
  plugins,
  collapsed = false,
  label,
  getHref,
}: StudioPluginNavigationProps<TId>): React.JSX.Element {
  return (
    <nav aria-label={label} className="flex flex-col gap-1">
      {plugins.map((plugin) => (
        <Item
          key={plugin.id}
          plugin={plugin}
          entityId={entityId}
          active={plugin.id === activePluginId}
          collapsed={collapsed}
          getHref={getHref}
        />
      ))}
    </nav>
  );
}
