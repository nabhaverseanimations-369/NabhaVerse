import * as React from "react";
import { GitBranchPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@nabhaverse/ui";

import type { CharacterRelationship } from "@/features/character/types/character.types";

export function RelationshipGraphPlaceholder({
  relationships,
}: {
  relationships: CharacterRelationship[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relationship Graph</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EmptyState
          title="Graph canvas placeholder"
          description="Interactive graph rendering will be connected in a later epic. Relationship data is already modeled and listed below."
          icon={<GitBranchPlus className="h-8 w-8" aria-hidden="true" />}
        />
        <ul className="space-y-2" aria-label="Relationship list">
          {relationships.map((relationship) => (
            <li
              key={relationship.id}
              className="rounded-md border border-[var(--color-border)] p-3"
            >
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {relationship.relatedName}
              </p>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                {relationship.relationshipType}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">{relationship.notes}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
