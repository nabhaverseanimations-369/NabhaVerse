import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { ProductionHealthPanel } from "@/components/production/production-health-panel";
import { mockProductions } from "@/features/production/data/production-mocks";

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

export function ProductionDashboard(): React.JSX.Element {
  const active = mockProductions.filter((production) => production.status === "active");
  const pendingReviews = mockProductions.reduce(
    (total, production) => total + production.pendingReviews,
    0,
  );
  const blockers = mockProductions.reduce((total, production) => total + production.blockers, 0);
  const milestones = mockProductions.reduce(
    (total, production) => total + production.upcomingMilestones,
    0,
  );

  const primary = active[0] ?? mockProductions[0] ?? null;

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardStat
          title="Active Productions"
          value={active.length}
          subtitle="Currently shipping"
        />
        <DashboardStat title="Sprint Progress" value="63%" subtitle="Across active pipelines" />
        <DashboardStat title="Team Workload" value="78%" subtitle="Average capacity utilization" />
        <DashboardStat
          title="Pending Reviews"
          value={pendingReviews}
          subtitle="Awaiting approval"
        />
        <DashboardStat title="Blockers" value={blockers} subtitle="Needs intervention" />
        <DashboardStat title="Upcoming Milestones" value={milestones} subtitle="Next 14 days" />
        <DashboardStat title="Production Health" value="Watch" subtitle="Two pipelines at risk" />
        <DashboardStat title="Recent Activity" value="29" subtitle="Events in last 24h" />
        <DashboardStat title="Quick Actions" value="5" subtitle="Common production workflows" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {mockProductions
              .flatMap((production) => production.recentActivity.slice(0, 2))
              .slice(0, 8)
              .map((entry) => (
                <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
                  {entry}
                </p>
              ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {primary ? <ProductionHealthPanel production={primary} /> : null}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button type="button" variant="outline">
                Open review queue
              </Button>
              <Button type="button" variant="outline">
                Inspect blockers
              </Button>
              <Button type="button" variant="outline">
                Update timeline
              </Button>
              <Button type="button" variant="outline">
                Export report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
