import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";
import { StudioCommentPanel } from "@nabhaverse/studio-sdk";

import { CalendarView } from "@/components/production/calendar-view";
import { DependencyGraph } from "@/components/production/dependency-graph";
import { MilestoneCard } from "@/components/production/milestone-card";
import { PipelineStage } from "@/components/production/pipeline-stage";
import { ProductionHealthPanel } from "@/components/production/production-health-panel";
import {
  ProductionHealthBadge,
  ProductionPriorityBadge,
  ProductionStatusBadge,
} from "@/components/production/production-status-badge";
import { ReviewCard } from "@/components/production/review-card";
import { TaskCard } from "@/components/production/task-card";
import { TimelineView } from "@/components/production/timeline-view";
import type { Production } from "@/features/production/types/production.types";

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

export function ProductionOverviewPanel({
  production,
}: {
  production: Production;
}): React.JSX.Element {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{production.name}</CardTitle>
            <ProductionStatusBadge status={production.status} />
            <ProductionPriorityBadge priority={production.priority} />
            <ProductionHealthBadge health={production.health} />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{production.description}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoBlock label="Owner" value={production.owner} />
          <InfoBlock label="Studio" value={production.studio} />
          <InfoBlock label="Completion" value={`${production.completion}%`} />
          <InfoBlock label="Milestones" value={`${production.milestones.length}`} />
          <InfoBlock label="Pending Reviews" value={`${production.pendingReviews}`} />
          <InfoBlock label="Blockers" value={`${production.blockers}`} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {production.recentActivity.map((entry) => (
              <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
                {entry}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              Open board
            </button>
            <button
              type="button"
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              Review blockers
            </button>
            <button
              type="button"
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              Update timeline
            </button>
            <button
              type="button"
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              Export report
            </button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

export function ProductionBoardPanel({
  production,
}: {
  production: Production;
}): React.JSX.Element {
  const columns = ["todo", "in-progress", "in-review", "blocked", "done"] as const;
  return (
    <section className="grid gap-4 xl:grid-cols-5">
      {columns.map((status) => (
        <Card key={status}>
          <CardHeader>
            <CardTitle className="text-base">{status}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {production.tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function TaskQueuePanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <section className="space-y-3">
      {production.tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </section>
  );
}

export function ShotPipelinePanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {production.shotPipeline.map((shot) => (
        <PipelineStage key={shot.id} item={shot} />
      ))}
    </section>
  );
}

export function ReviewQueuePanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {production.reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </section>
  );
}

export function ApprovalsPanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <SimpleCard
      title="Approvals"
      body={`Approved reviews: ${production.reviews.filter((entry) => entry.status === "approved").length}`}
    />
  );
}

export function DependenciesPanel({ production }: { production: Production }): React.JSX.Element {
  return <DependencyGraph tasks={production.tasks} />;
}

export function TimelinePanel({ production }: { production: Production }): React.JSX.Element {
  return <TimelineView milestones={production.milestones} />;
}

export function CalendarPanel({ production }: { production: Production }): React.JSX.Element {
  return <CalendarView milestones={production.milestones} />;
}

export function DeliverablesPanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deliverables</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {production.deliverables.map((entry) => (
          <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function RisksPanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {production.risks.map((entry) => (
          <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function ReportsPanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {production.reports.map((entry) => (
          <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function ActivityPanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {production.recentActivity.map((entry) => (
          <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function CommentsPanel({ production }: { production: Production }): React.JSX.Element {
  return <StudioCommentPanel sectionLabel={`${production.name} comments`} />;
}

export function HealthPanel({ production }: { production: Production }): React.JSX.Element {
  return <ProductionHealthPanel production={production} />;
}

export function MilestonesPanel({ production }: { production: Production }): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {production.milestones.map((milestone) => (
        <MilestoneCard key={milestone.id} milestone={milestone} />
      ))}
    </section>
  );
}
