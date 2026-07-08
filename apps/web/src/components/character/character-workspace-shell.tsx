"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button, Card } from "@nabhaverse/ui";
import { resolveStudioRouteSegment } from "@nabhaverse/studio-sdk";

import { DocumentNavigation } from "@/components/character/document-navigation";
import { isCharacterSection } from "@/features/character/constants/character-sections";
import { useCharacterWorkspaceState } from "@/features/character/state/character-workspace-state";
import type { CharacterDocumentType } from "@/features/character/types/character.types";

function resolveActiveSection(pathname: string): CharacterDocumentType {
  return resolveStudioRouteSegment(pathname, 3, isCharacterSection, "overview");
}

export function CharacterWorkspaceShell({
  characterId,
  children,
}: {
  characterId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { state, dispatch } = useCharacterWorkspaceState();
  const activeSection = resolveActiveSection(pathname);

  React.useEffect(() => {
    dispatch({ type: "set-sheet", sheet: activeSection });
  }, [activeSection, dispatch]);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <Card className="h-fit p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Character Workspace
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              state.sidebarCollapsed
                ? "Expand character navigation"
                : "Collapse character navigation"
            }
            onClick={() => {
              dispatch({ type: "set-sidebar-collapsed", collapsed: !state.sidebarCollapsed });
            }}
          >
            {state.sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <DocumentNavigation
          characterId={characterId}
          activeSection={activeSection}
          collapsed={state.sidebarCollapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
