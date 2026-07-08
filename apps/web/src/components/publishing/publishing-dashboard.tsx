import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { mockPublications } from "@/features/publishing/data/publishing-mocks";

function DashboardStat({
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

export function PublishingDashboard(): React.JSX.Element {
  const upcoming = mockPublications.filter((entry) => entry.status === "scheduled").length;
  const scheduled = mockPublications.filter((entry) => Boolean(entry.scheduledAt)).length;
  const drafts = mockPublications.filter((entry) => entry.status === "draft").length;
  const published = mockPublications.filter((entry) => entry.status === "published").length;
  const failed = mockPublications.filter((entry) => entry.status === "failed").length;

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStat title="Upcoming Releases" value={upcoming} subtitle="Next release windows" />
        <DashboardStat
          title="Scheduled Publications"
          value={scheduled}
          subtitle="With schedule metadata"
        />
        <DashboardStat title="Draft Releases" value={drafts} subtitle="Needs completion" />
        <DashboardStat
          title="Published Releases"
          value={published}
          subtitle="Completed workflows"
        />
        <DashboardStat
          title="Failed Publications"
          value={failed}
          subtitle="Placeholder failure feed"
        />
        <DashboardStat
          title="Distribution Health"
          value="Watch"
          subtitle="Placeholder health index"
        />
        <DashboardStat title="Recent Activity" value={14} subtitle="Publishing events in 24h" />
        <DashboardStat title="Quick Actions" value={4} subtitle="Workflow shortcuts" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {mockPublications
              .flatMap((entry) => entry.recentActivity.slice(0, 2))
              .slice(0, 8)
              .map((activity) => (
                <p
                  key={activity}
                  className="rounded-md border border-[var(--color-border)] px-3 py-2"
                >
                  {activity}
                </p>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              Create draft release
            </Button>
            <Button type="button" variant="outline">
              Review approvals
            </Button>
            <Button type="button" variant="outline">
              Inspect schedule
            </Button>
            <Button type="button" variant="outline">
              Open export package
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
