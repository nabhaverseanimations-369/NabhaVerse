"use client";

import * as React from "react";
import {
  BellRing,
  CircleCheckBig,
  HardDrive,
  Plus,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@nabhaverse/ui";

import { ContextMenu } from "@/components/common/context-menu";
import { useToast } from "@/components/feedback/toast-provider";
import { ActivityTimeline } from "@/components/workspace/activity-timeline";
import { PanelSkeleton } from "@/components/workspace/loading-state";
import { SectionHeader } from "@/components/workspace/section-header";
import { StatCard } from "@/components/workspace/stat-card";
import { useWorkspaceState } from "@/lib/workspace-state";

export default function DashboardPage(): React.JSX.Element {
  const { state } = useWorkspaceState();
  const { notify } = useToast();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PanelSkeleton />
        <PanelSkeleton />
        <PanelSkeleton />
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Welcome back, ${state.currentUser.name.split(" ")[0]}`}
        description="Your studio workspace is live and ready for planning, production, and publishing."
        action={
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              notify({
                title: "Command Palette Ready",
                description: "Use Cmd/Ctrl + K to launch any workspace action.",
                severity: "info",
              });
            }}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Explore Commands
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Projects" value="12" delta="+2 this week" trend="up" />
        <StatCard label="Production Velocity" value="86%" delta="+4.3%" trend="up" />
        <StatCard label="AI Usage Budget" value="62%" delta="Within target" trend="neutral" />
        <StatCard label="Pipeline Incidents" value="1" delta="-2 resolved" trend="down" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Continue Working</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.recentItems.projects.map((project) => (
              <ContextMenu
                key={project.id}
                actions={[
                  {
                    id: `${project.id}-pin`,
                    label: "Pin to dashboard",
                    onSelect: () => {
                      notify({ title: "Pinned", description: project.title, severity: "success" });
                    },
                  },
                  {
                    id: `${project.id}-open`,
                    label: "Open workspace",
                    onSelect: () => {
                      notify({ title: "Opening", description: project.title, severity: "info" });
                    },
                  },
                ]}
              >
                <article className="rounded-md border border-[var(--color-border)] p-3">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {project.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{project.subtitle}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Updated {project.updatedAt}
                  </p>
                </article>
              </ContextMenu>
            ))}
          </CardContent>
        </Card>

        <ActivityTimeline
          title="AI Activity"
          items={[
            {
              id: "ai_1",
              title: "Prompt Library synced",
              detail: "14 prompts versioned by the creative team.",
              when: "4m ago",
            },
            {
              id: "ai_2",
              title: "Voice profile calibration",
              detail: "Three profiles tuned for scene rehearsals.",
              when: "21m ago",
            },
            {
              id: "ai_3",
              title: "Batch summary generated",
              detail: "Pipeline digest pushed to notifications center.",
              when: "1h ago",
            },
          ]}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Characters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.recentItems.characters.map((item) => (
              <p key={item.id} className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">{item.title}</span> ·{" "}
                {item.subtitle}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Episodes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.recentItems.episodes.map((item) => (
              <p key={item.id} className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">{item.title}</span> ·{" "}
                {item.subtitle}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.recentItems.assets.map((item) => (
              <p key={item.id} className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">{item.title}</span> ·{" "}
                {item.subtitle}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.notifications.map((notification) => (
              <p key={notification.id} className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">
                  {notification.title}
                </span>{" "}
                · {notification.createdAt}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" className="justify-start">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Workspace Item
            </Button>
            <Button type="button" variant="outline" className="justify-start">
              <BellRing className="h-4 w-4" aria-hidden="true" />
              Review Notifications
            </Button>
            <Button type="button" variant="outline" className="justify-start">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Open Command Palette
            </Button>
            <Button type="button" variant="outline" className="justify-start">
              <HardDrive className="h-4 w-4" aria-hidden="true" />
              View Pipeline Storage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <CircleCheckBig className="h-4 w-4 text-green-500" aria-hidden="true" /> Render
              pipeline: Healthy
            </p>
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <CircleCheckBig className="h-4 w-4 text-green-500" aria-hidden="true" /> Collaboration
              sync: Stable
            </p>
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <TriangleAlert className="h-4 w-4 text-amber-500" aria-hidden="true" /> Backup queue:
              Slight delay (3m)
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <EmptyState
          title="Ready for module integrations"
          description="Character, world, episode, and AI business features can now attach to this workspace shell without changing navigation infrastructure."
        />
      </section>
    </div>
  );
}
