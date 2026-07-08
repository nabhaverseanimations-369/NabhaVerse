import * as React from "react";
import { notFound } from "next/navigation";

import { PublishingWorkspaceShell } from "@/components/publishing";
import { mockPublications, PublishingWorkspaceProvider } from "@/features/publishing";

interface PublishingWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

export default async function PublishingWorkspaceLayout({
  children,
  params,
}: PublishingWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { workspaceId } = await params;
  const workspace = mockPublications.find((entry) => entry.id === workspaceId);

  if (!workspace) {
    notFound();
  }

  return (
    <PublishingWorkspaceProvider
      initialPublication={workspace}
      initialPlugin="overview"
      initialMarkdown="# Publishing notes"
    >
      <PublishingWorkspaceShell workspaceId={workspaceId}>{children}</PublishingWorkspaceShell>
    </PublishingWorkspaceProvider>
  );
}
