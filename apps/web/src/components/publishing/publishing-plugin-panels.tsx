import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";
import { StudioCommentPanel } from "@nabhaverse/studio-sdk";

import { ApprovalStatusCard } from "@/components/publishing/approval-status-card";
import { DistributionTargetCard } from "@/components/publishing/distribution-target-card";
import { ReleaseCard } from "@/components/publishing/release-card";
import { ReleaseHealthPanel } from "@/components/publishing/release-health-panel";
import { ScheduleTimeline } from "@/components/publishing/schedule-timeline";
import {
  PublishingStatusBadge,
  ReleaseTypeBadge,
} from "@/components/publishing/publishing-status-badge";
import type { Publication } from "@/features/publishing/types/publishing.types";

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
      </CardContent>
    </Card>
  );
}

export function PublishingOverviewPanel({
  publication,
}: {
  publication: Publication;
}): React.JSX.Element {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{publication.name}</CardTitle>
            <PublishingStatusBadge status={publication.status} />
            <ReleaseTypeBadge type={publication.releaseType} />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{publication.description}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Owner" value={publication.owner} />
          <Info label="Studio" value={publication.studio} />
          <Info label="Scheduled" value={publication.scheduledAt ?? "Not scheduled"} />
          <Info label="Releases" value={`${publication.releases.length}`} />
          <Info label="Assets" value={`${publication.references.assets.length}`} />
          <Info
            label="Production Tasks"
            value={`${publication.references.productionTasks.length}`}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <ScheduleTimeline releases={publication.releases} />
        <ReleaseHealthPanel publication={publication} />
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

export function ReleaseDetailsPanel({
  publication,
}: {
  publication: Publication;
}): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {publication.releases.map((release) => (
        <ReleaseCard key={release.id} release={release} />
      ))}
    </section>
  );
}

export function DistributionTargetsPanel({
  publication,
}: {
  publication: Publication;
}): React.JSX.Element {
  const targets = publication.releases.flatMap((release) => release.targets);
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {targets.map((target) => (
        <DistributionTargetCard key={`${target.id}-${target.channel}`} target={target} />
      ))}
    </section>
  );
}

export function SchedulePanel({ publication }: { publication: Publication }): React.JSX.Element {
  return <ScheduleTimeline releases={publication.releases} />;
}

export function ApprovalWorkflowPanel({
  publication,
}: {
  publication: Publication;
}): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {publication.releases.map((release) => (
        <ApprovalStatusCard key={release.id} release={release} />
      ))}
    </section>
  );
}

export function ExportPackagePanel({
  publication,
}: {
  publication: Publication;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Package</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {publication.exportPackage.map((entry) => (
          <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function ReleaseNotesPanel({
  publication,
}: {
  publication: Publication;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Release Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">{publication.releaseNotes}</p>
      </CardContent>
    </Card>
  );
}

export function AssetsPanel({ publication }: { publication: Publication }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {publication.references.assets.map((asset) => (
          <p key={asset.id} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {asset.name}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function AnalyticsPanel(): React.JSX.Element {
  return (
    <PlaceholderCard
      title="Analytics"
      description="Analytics provider integration is out of scope for this epic."
    />
  );
}

export function ActivityPanel({ publication }: { publication: Publication }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {publication.recentActivity.map((entry) => (
          <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function CommentsPanel({ publication }: { publication: Publication }): React.JSX.Element {
  return <StudioCommentPanel sectionLabel={`${publication.name} comments`} />;
}

export function SettingsPanel(): React.JSX.Element {
  return (
    <PlaceholderCard
      title="Settings"
      description="Publishing workspace settings contract is ready; runtime settings are future work."
    />
  );
}
