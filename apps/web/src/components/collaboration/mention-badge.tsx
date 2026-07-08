import * as React from "react";

import { Badge } from "@nabhaverse/ui";

import type { CollaborationMention } from "@/features/collaboration/types/collaboration.types";

const variant = {
  unread: "warning",
  read: "secondary",
  archived: "outline",
} as const;

export function MentionBadge({ mention }: { mention: CollaborationMention }): React.JSX.Element {
  return <Badge variant={variant[mention.status]}>{mention.subject}</Badge>;
}
