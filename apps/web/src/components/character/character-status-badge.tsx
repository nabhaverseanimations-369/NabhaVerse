import * as React from "react";
import { Badge, type BadgeProps } from "@nabhaverse/ui";

import type { CharacterStatus } from "@/features/character/types/character.types";

const statusLabel: Record<CharacterStatus, string> = {
  draft: "Draft",
  "in-review": "In Review",
  approved: "Approved",
  archived: "Archived",
};

const statusVariant: Record<CharacterStatus, BadgeProps["variant"]> = {
  draft: "secondary",
  "in-review": "warning",
  approved: "success",
  archived: "outline",
};

export function CharacterStatusBadge({ status }: { status: CharacterStatus }): React.JSX.Element {
  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
}
