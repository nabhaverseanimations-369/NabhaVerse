import * as React from "react";
import { Bolt, Clock3, PenSquare } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { WorldAvatar } from "@/components/world/world-avatar";
import { WorldStatusBadge } from "@/components/world/world-status-badge";
import type { World } from "@/features/world/types/world.types";

export function WorldOverviewPanel({ world }: { world: World }): React.JSX.Element {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2 overflow-hidden">
        <div
          role="img"
          aria-label={`${world.name} cover image`}
          className="h-40 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${world.coverImageUrl ?? "https://picsum.photos/seed/world-overview/1280/720"})`,
          }}
        />
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <WorldAvatar name={world.name} coverImageUrl={world.coverImageUrl} size="lg" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {world.name}
              </h2>
              <WorldStatusBadge status={world.status} />
              <p className="text-sm text-[var(--color-text-secondary)]">{world.description}</p>
            </div>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--color-text-muted)]">Studio</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">{world.studio}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-muted)]">Version</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">{world.version}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-muted)]">Last Updated</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">{world.updatedAt}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-muted)]">Timeline Summary</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">
                {world.timelineSummary}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            {world.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1 text-xs text-[var(--color-text-secondary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button type="button" variant="outline" className="w-full justify-start">
            <PenSquare className="h-4 w-4" aria-hidden="true" /> Edit World Notes
          </Button>
          <Button type="button" variant="outline" className="w-full justify-start">
            <Bolt className="h-4 w-4" aria-hidden="true" /> Start Review Round
          </Button>
          <p className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Last opened{" "}
            {world.recentlyOpenedAt ?? "recently"}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
