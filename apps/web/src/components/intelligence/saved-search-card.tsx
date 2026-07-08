import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { IntelligenceSavedSearch } from "@/features/intelligence";

export function SavedSearchCard({
  savedSearch,
  onApply,
}: {
  savedSearch: IntelligenceSavedSearch;
  onApply?: (savedSearch: IntelligenceSavedSearch) => void;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{savedSearch.name}</CardTitle>
          {savedSearch.pinned ? <Badge variant="warning">Pinned</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <p>Query: {savedSearch.query}</p>
        <p>Category: {savedSearch.category}</p>
        <p className="text-xs text-[var(--color-text-muted)]">Last used {savedSearch.lastUsedAt}</p>
        {onApply ? (
          <button
            type="button"
            className="text-sm font-medium text-[var(--color-primary)]"
            onClick={() => onApply(savedSearch)}
          >
            Apply saved search
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}
