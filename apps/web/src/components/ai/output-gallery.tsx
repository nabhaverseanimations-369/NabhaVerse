import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { AIOutput } from "@/features/ai/types/ai.types";

export function OutputGallery({
  outputs,
  onToggleFavorite,
}: {
  outputs: readonly AIOutput[];
  onToggleFavorite: (outputId: string) => void;
}): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {outputs.map((output) => (
        <Card key={output.id}>
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle>{output.title}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={output.favorite ? "Unfavorite output" : "Favorite output"}
                onClick={() => onToggleFavorite(output.id)}
              >
                <Star
                  className="h-4 w-4"
                  aria-hidden="true"
                  fill={output.favorite ? "currentColor" : "none"}
                />
              </Button>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">{output.summary}</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{output.type}</Badge>
              <Badge variant="secondary">{output.createdAt}</Badge>
            </div>
            <p>
              <span className="font-medium text-[var(--color-text-primary)]">Linked Asset:</span>{" "}
              <Link
                href={`/creative/assets/${output.linkedAsset.id}/overview`}
                className="hover:underline"
              >
                {output.linkedAsset.name}
              </Link>
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {output.linkedAsset.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
