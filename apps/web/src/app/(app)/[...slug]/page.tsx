import * as React from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@nabhaverse/ui";

import { findWorkspaceGroup, findWorkspaceNavItem } from "@/components/navigation/nav-items";
import { SectionHeader } from "@/components/workspace/section-header";

interface PlaceholderPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PlaceholderPage({
  params,
}: PlaceholderPageProps): Promise<React.JSX.Element> {
  const resolved = await params;
  const pathname = `/${resolved.slug.join("/")}`;
  const item = findWorkspaceNavItem(pathname);
  const group = findWorkspaceGroup(pathname);

  if (!item || !group) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        title={item.label}
        description={`${group.label} workspace shell is ready for future module integration.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Module Placeholder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <p>This page intentionally provides infrastructure-only scaffolding for Epic 3.</p>
          <p>
            No CRUD workflows are implemented yet. Future epics will attach domain functionality
            here.
          </p>
        </CardContent>
      </Card>

      <EmptyState
        title={`${item.label} is configured`}
        description="Navigation, layout, responsiveness, command palette indexing, and route scaffolding are already wired."
      />
    </section>
  );
}
