import * as React from "react";
import { Badge, type BadgeProps } from "@nabhaverse/ui";

import type { WorldStatus } from "@/features/world/types/world.types";

const statusLabel: Record<WorldStatus, string> = {
  draft: "Draft",
  "in-review": "In Review",
  published: "Published",
  archived: "Archived",
};

const statusVariant: Record<WorldStatus, BadgeProps["variant"]> = {
  draft: "secondary",
  "in-review": "warning",
  published: "success",
  archived: "outline",
};

export function WorldStatusBadge({ status }: { status: WorldStatus }): React.JSX.Element {
  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
}
