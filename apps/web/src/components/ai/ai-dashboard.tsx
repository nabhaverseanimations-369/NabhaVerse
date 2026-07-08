import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { jobsByStatus } from "@/features/ai/lib/ai-search";
import type { AIStudioWorkspace } from "@/features/ai/types/ai.types";

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{value}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export function AIDashboard({ workspace }: { workspace: AIStudioWorkspace }): React.JSX.Element {
  const groupedJobs = jobsByStatus(workspace.jobs);
  const favoritePrompts = workspace.prompts.filter((prompt) => prompt.favorite);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Recent Jobs"
          value={workspace.jobs.length}
          subtitle="Latest orchestration runs"
        />
        <StatCard
          title="Running Jobs"
          value={groupedJobs.running.length}
          subtitle="Active in queue"
        />
        <StatCard title="Failed Jobs" value={groupedJobs.failed.length} subtitle="Needs review" />
        <StatCard
          title="Prompt Library"
          value={workspace.prompts.length}
          subtitle="Reusable prompt templates"
        />
        <StatCard
          title="Model Library"
          value={workspace.models.length}
          subtitle="Provider-agnostic model catalog"
        />
        <StatCard
          title="Recent Outputs"
          value={workspace.outputs.length}
          subtitle="Latest generated artifacts"
        />
        <StatCard
          title="Favorite Prompts"
          value={favoritePrompts.length}
          subtitle="Pinned for frequent use"
        />
        <StatCard
          title="Cost Overview"
          value={workspace.costOverview.estimatedCost}
          subtitle={`${workspace.costOverview.periodLabel} · ${workspace.costOverview.trend}`}
        />
        <StatCard
          title="Provider Status"
          value={
            workspace.providerStatus.filter((provider) => provider.status === "healthy").length
          }
          subtitle="Healthy providers (placeholder)"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {workspace.jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="rounded-md border border-[var(--color-border)] px-3 py-2"
              >
                <p className="font-medium text-[var(--color-text-primary)]">{job.name}</p>
                <p>
                  {job.status} · {job.progress}% · {job.outputs} outputs
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {workspace.providerStatus.map((provider) => (
              <div
                key={provider.provider}
                className="rounded-md border border-[var(--color-border)] px-3 py-2"
              >
                <p className="font-medium text-[var(--color-text-primary)]">{provider.provider}</p>
                <p>
                  {provider.status} · Queue {provider.queueDepth} · {provider.latency}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
