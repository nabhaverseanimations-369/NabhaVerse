import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";
import { StudioCommentPanel } from "@nabhaverse/studio-sdk";

import type { Asset } from "@/features/asset/types/asset.types";

function SimpleCard({ title, body }: { title: string; body: string }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">{body}</p>
      </CardContent>
    </Card>
  );
}

export function AssetVersionsPanel({ asset }: { asset: Asset }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Versions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {asset.versions.map((version) => (
          <article
            key={version.id}
            className="rounded-md border border-[var(--color-border)] p-3 text-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-[var(--color-text-primary)]">{version.label}</p>
              <span className="text-xs text-[var(--color-text-muted)]">{version.createdAt}</span>
            </div>
            <p className="text-[var(--color-text-secondary)]">{version.summary}</p>
            <p className="text-[var(--color-text-muted)]">{version.author}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function AssetUsagePanel({ asset }: { asset: Asset }): React.JSX.Element {
  return <SimpleCard title="Usage" body={asset.usageSummary} />;
}

export function AssetPermissionsPanel({ asset }: { asset: Asset }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {asset.permissions.map((permission) => (
          <p key={permission} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {permission}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function AssetCommentsPanel({ asset }: { asset: Asset }): React.JSX.Element {
  return <StudioCommentPanel sectionLabel={`${asset.name} comments`} />;
}

export function AssetActivityPanel({ asset }: { asset: Asset }): React.JSX.Element {
  return (
    <SimpleCard title="Activity" body={`Recent activity: ${asset.recentActivity.join(" · ")}`} />
  );
}
