import * as React from "react";

import { Badge, type BadgeProps } from "@nabhaverse/ui";

import type { AssetStatus } from "@/features/asset/types/asset.types";

const labels: Record<AssetStatus, string> = {
  draft: "Draft",
  "in-review": "In Review",
  approved: "Approved",
  archived: "Archived",
};

const variants: Record<AssetStatus, BadgeProps["variant"]> = {
  draft: "secondary",
  "in-review": "warning",
  approved: "success",
  archived: "outline",
};

export function AssetStatusBadge({ status }: { status: AssetStatus }): React.JSX.Element {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
