import * as React from "react";
import Link from "next/link";
import { cn } from "@nabhaverse/ui";

import {
  characterSheetRegistry,
  type CharacterSheetPlugin,
} from "@/features/character/constants/character-sections";
import type { CharacterDocumentType } from "@/features/character/types/character.types";

interface DocumentNavigationProps {
  characterId: string;
  activeSection: CharacterDocumentType;
  collapsed?: boolean;
}

function Item({
  plugin,
  href,
  active,
  collapsed,
}: {
  plugin: CharacterSheetPlugin;
  href: string;
  active: boolean;
  collapsed: boolean;
}): React.JSX.Element {
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

export function DocumentNavigation({
  characterId,
  activeSection,
  collapsed = false,
}: DocumentNavigationProps): React.JSX.Element {
  return (
    <nav aria-label="Character sections" className="flex flex-col gap-1">
      {characterSheetRegistry.map((plugin) => (
        <Item
          key={plugin.id}
          plugin={plugin}
          href={`/creative/characters/${characterId}/${plugin.id}`}
          active={plugin.id === activeSection}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}
