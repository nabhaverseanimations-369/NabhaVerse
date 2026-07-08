import * as React from "react";

import { Badge, type BadgeProps } from "@nabhaverse/ui";

import type { PublishingStatus, ReleaseType } from "@/features/publishing/types/publishing.types";

const statusVariant: Record<PublishingStatus, BadgeProps["variant"]> = {
  draft: "secondary",
  scheduled: "warning",
  approved: "outline",
  published: "success",
  failed: "destructive",
};

const releaseTypeVariant: Record<ReleaseType, BadgeProps["variant"]> = {
  episode: "outline",
  trailer: "secondary",
  short: "warning",
  bundle: "outline",
};

export function PublishingStatusBadge({ status }: { status: PublishingStatus }): React.JSX.Element {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}

export function ReleaseTypeBadge({ type }: { type: ReleaseType }): React.JSX.Element {
  return <Badge variant={releaseTypeVariant[type]}>{type}</Badge>;
}
