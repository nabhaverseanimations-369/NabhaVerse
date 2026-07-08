import * as React from "react";

import { Badge, type BadgeProps } from "@nabhaverse/ui";

import type {
  ProductionHealth,
  ProductionPriority,
  ProductionStatus,
} from "@/features/production/types/production.types";

const statusVariant: Record<ProductionStatus, BadgeProps["variant"]> = {
  active: "success",
  planning: "secondary",
  "on-hold": "warning",
  completed: "outline",
};

const priorityVariant: Record<ProductionPriority, BadgeProps["variant"]> = {
  low: "outline",
  medium: "secondary",
  high: "warning",
  critical: "destructive",
};

const healthVariant: Record<ProductionHealth, BadgeProps["variant"]> = {
  healthy: "success",
  watch: "warning",
  "at-risk": "destructive",
};

export function ProductionStatusBadge({ status }: { status: ProductionStatus }): React.JSX.Element {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}

export function ProductionPriorityBadge({
  priority,
}: {
  priority: ProductionPriority;
}): React.JSX.Element {
  return <Badge variant={priorityVariant[priority]}>{priority}</Badge>;
}

export function ProductionHealthBadge({ health }: { health: ProductionHealth }): React.JSX.Element {
  return <Badge variant={healthVariant[health]}>{health}</Badge>;
}
