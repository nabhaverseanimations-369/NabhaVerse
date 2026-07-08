import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { AIModel } from "@/features/ai/types/ai.types";

const statusVariant: Record<AIModel["status"], "success" | "warning" | "destructive"> = {
  available: "success",
  degraded: "warning",
  offline: "destructive",
};

export function ModelCard({ model }: { model: AIModel }): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{model.name}</CardTitle>
          <Badge variant={statusVariant[model.status]}>{model.status}</Badge>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{model.description}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Provider:</span>{" "}
          {model.provider}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Family:</span>{" "}
          {model.family}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Modality:</span>{" "}
          {model.modality}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Context:</span>{" "}
          {model.maxContext}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Latency:</span>{" "}
          {model.latencyClass}
        </p>
      </CardContent>
    </Card>
  );
}
