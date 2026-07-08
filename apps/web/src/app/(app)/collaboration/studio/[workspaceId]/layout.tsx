import * as React from "react";
import { notFound } from "next/navigation";

import { CollaborationWorkspaceShell } from "@/components/collaboration";
import {
  CollaborationWorkspaceProvider,
  mockCollaborationWorkspaces,
} from "@/features/collaboration";

interface CollaborationWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

export default async function CollaborationWorkspaceLayout({
  children,
  params,
}: CollaborationWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { workspaceId } = await params;
  const workspace = mockCollaborationWorkspaces.find((entry) => entry.id === workspaceId);

  if (!workspace) {
    notFound();
  }

  return (
    <CollaborationWorkspaceProvider initialWorkspace={workspace} initialPlugin="overview">
      <CollaborationWorkspaceShell workspaceId={workspaceId}>
        {children}
      </CollaborationWorkspaceShell>
    </CollaborationWorkspaceProvider>
  );
}
