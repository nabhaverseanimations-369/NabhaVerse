import * as React from "react";

import { Badge, type BadgeProps } from "@nabhaverse/ui";

import type { EpisodeStatus } from "@/features/episode/types/episode.types";

const labels: Record<EpisodeStatus, string> = {
  draft: "Draft",
  "in-review": "In Review",
  approved: "Approved",
  archived: "Archived",
};

const variants: Record<EpisodeStatus, BadgeProps["variant"]> = {
  draft: "secondary",
  "in-review": "warning",
  approved: "success",
  archived: "outline",
};

export function EpisodeStatusBadge({ status }: { status: EpisodeStatus }): React.JSX.Element {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
