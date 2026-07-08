import * as React from "react";
import { notFound } from "next/navigation";

import { WorldWorkspaceShell } from "@/components/world";
import { mockWorlds, mockWorldDocumentForPlugin } from "@/features/world";
import { WorldWorkspaceProvider } from "@/features/world/state/world-workspace-state";

interface WorldWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ worldId: string }>;
}

export default async function WorldWorkspaceLayout({
  children,
  params,
}: WorldWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { worldId } = await params;
  const world = mockWorlds.find((entry) => entry.id === worldId);

  if (!world) {
    notFound();
  }

  const initialDocument = mockWorldDocumentForPlugin(world.id, "overview");

  return (
    <WorldWorkspaceProvider
      initialWorld={world}
      initialPlugin="overview"
      initialMarkdown={initialDocument.markdown}
    >
      <WorldWorkspaceShell worldId={worldId}>{children}</WorldWorkspaceShell>
    </WorldWorkspaceProvider>
  );
}
