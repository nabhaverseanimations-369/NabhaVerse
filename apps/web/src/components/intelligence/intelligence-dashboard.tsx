import * as React from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { GlobalActivityFeed } from "@/components/intelligence/global-activity-feed";
import { InsightCard } from "@/components/intelligence/insight-card";
import { PlatformHealthCard } from "@/components/intelligence/platform-health-card";
import { QuickActionCard } from "@/components/intelligence/quick-action-card";
import { RecommendationCard } from "@/components/intelligence/recommendation-card";
import { SavedSearchCard } from "@/components/intelligence/saved-search-card";
import {
  intelligenceDashboardState,
  type IntelligenceDashboardState,
} from "@/features/intelligence";

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}): React.JSX.Element {
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

export function IntelligenceDashboard({
  state = intelligenceDashboardState,
}: {
  state?: IntelligenceDashboardState;
}): React.JSX.Element {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div id="global-activity">
          <GlobalActivityFeed items={state.globalActivity} />
        </div>
        <Section title="Personal Workspace" id="personal-workspace">
          {state.personalWorkspace.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[var(--color-surface-muted)]"
            >
              <p className="font-medium text-[var(--color-text-primary)]">{item.title}</p>
              <p className="text-[var(--color-text-secondary)]">{item.subtitle}</p>
            </Link>
          ))}
        </Section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Section title="Recently Opened">
          {state.recentlyOpened.map((item) => (
            <Link
              key={item.id}
              href={item.href ?? "#"}
              className="block rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              <p className="font-medium text-[var(--color-text-primary)]">{item.title}</p>
              <p className="text-[var(--color-text-secondary)]">{item.studioLabel}</p>
            </Link>
          ))}
        </Section>
        <Section title="Recommended Items">
          {state.recommendedItems.map((item) => (
            <RecommendationCard key={item.id} recommendation={item} />
          ))}
        </Section>
        <Section title="Saved Searches">
          {state.savedSearches.map((item) => (
            <SavedSearchCard key={item.id} savedSearch={item} />
          ))}
        </Section>
        <Section title="Platform Health">
          {state.platformHealth.map((metric) => (
            <PlatformHealthCard key={metric.id} metric={metric} />
          ))}
        </Section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Section title="Cross-Studio Insights">
          {state.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </Section>
        <Section title="Quick Actions">
          {state.quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </Section>
        <Section title="Search History">
          {state.searchHistory.map((entry) => (
            <p
              key={entry}
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
            >
              {entry}
            </p>
          ))}
        </Section>
      </div>
    </section>
  );
}
