import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@nabhaverse/ui";
import { StudioCommentPanel } from "@nabhaverse/studio-sdk";

import { JobQueue } from "@/components/ai/job-queue";
import { ModelCard } from "@/components/ai/model-card";
import { OutputGallery } from "@/components/ai/output-gallery";
import { PromptLibrary } from "@/components/ai/prompt-library";
import type { AIStudioWorkspace } from "@/features/ai/types/ai.types";

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
        <EmptyState title={title} description={description} />
      </CardContent>
    </Card>
  );
}

export function PromptLibraryPanel({
  workspace,
}: {
  workspace: AIStudioWorkspace;
}): React.JSX.Element {
  return <PromptLibrary prompts={workspace.prompts} />;
}

export function PromptVersionsPanel({
  workspace,
}: {
  workspace: AIStudioWorkspace;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt Versions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {workspace.prompts.flatMap((prompt) =>
          prompt.versions.map((version) => (
            <div key={version.id} className="rounded-md border border-[var(--color-border)] p-3">
              <p className="font-medium text-[var(--color-text-primary)]">
                {prompt.name} · {version.label}
              </p>
              <p>{version.summary}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {version.createdAt} · {version.author}
              </p>
            </div>
          )),
        )}
      </CardContent>
    </Card>
  );
}

export function ModelCatalogPanel({
  workspace,
}: {
  workspace: AIStudioWorkspace;
}): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workspace.models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </section>
  );
}

export function ProviderConfigurationPanel({
  workspace,
}: {
  workspace: AIStudioWorkspace;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {workspace.providerStatus.map((provider) => (
          <div
            key={provider.provider}
            className="rounded-md border border-[var(--color-border)] p-3"
          >
            <p className="font-medium text-[var(--color-text-primary)]">{provider.provider}</p>
            <p>
              Status: {provider.status} · Queue depth: {provider.queueDepth} · Latency:{" "}
              {provider.latency}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Configuration placeholders only. No provider secrets or live calls.
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function JobQueuePanel({ workspace }: { workspace: AIStudioWorkspace }): React.JSX.Element {
  return <JobQueue jobs={workspace.jobs} />;
}

export function JobHistoryPanel({
  workspace,
}: {
  workspace: AIStudioWorkspace;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {workspace.jobs.map((job) => (
          <div key={job.id} className="rounded-md border border-[var(--color-border)] p-3">
            <p className="font-medium text-[var(--color-text-primary)]">{job.name}</p>
            <p>
              {job.status} · Created {job.createdAt}
              {job.finishedAt ? ` · Finished ${job.finishedAt}` : ""}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function OutputGalleryPanel({
  workspace,
}: {
  workspace: AIStudioWorkspace;
}): React.JSX.Element {
  return <OutputGallery outputs={workspace.outputs} onToggleFavorite={() => {}} />;
}

export function AssetLinksPanel({
  workspace,
}: {
  workspace: AIStudioWorkspace;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {workspace.outputs.map((output) => (
          <div key={output.id} className="rounded-md border border-[var(--color-border)] p-3">
            <p className="font-medium text-[var(--color-text-primary)]">{output.title}</p>
            <p>
              Linked asset: {output.linkedAsset.name} ({output.linkedAsset.kind ?? "asset"})
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Asset id: {output.linkedAsset.id}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function EvaluationPanel(): React.JSX.Element {
  return (
    <PlaceholderCard
      title="Evaluation"
      description="Evaluation scorecards and rubric tooling are placeholders for architecture review."
    />
  );
}

export function SettingsPanel(): React.JSX.Element {
  return (
    <PlaceholderCard
      title="Settings"
      description="Workspace settings are placeholders for future orchestration controls."
    />
  );
}

export function ActivityPanel({ workspace }: { workspace: AIStudioWorkspace }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {workspace.activity.map((entry) => (
          <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function CommentsPanel({ workspace }: { workspace: AIStudioWorkspace }): React.JSX.Element {
  return <StudioCommentPanel sectionLabel={`${workspace.name} comments`} />;
}
