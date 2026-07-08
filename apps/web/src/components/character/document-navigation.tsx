import * as React from "react";

import { StudioPluginNavigation } from "@/components/studio/studio-plugin-navigation";
import { characterSheetRegistry } from "@/features/character/constants/character-sections";
import type { CharacterDocumentType } from "@/features/character/types/character.types";

interface DocumentNavigationProps {
  characterId: string;
  activeSection: CharacterDocumentType;
  collapsed?: boolean;
}

export function DocumentNavigation({
  characterId,
  activeSection,
  collapsed = false,
}: DocumentNavigationProps): React.JSX.Element {
  return (
    <StudioPluginNavigation<CharacterDocumentType>
      entityId={characterId}
      activePluginId={activeSection}
      plugins={characterSheetRegistry}
      collapsed={collapsed}
      label="Character sections"
      getHref={(plugin, entityId) => `/creative/characters/${entityId}/${plugin.id}`}
    />
  );
}
