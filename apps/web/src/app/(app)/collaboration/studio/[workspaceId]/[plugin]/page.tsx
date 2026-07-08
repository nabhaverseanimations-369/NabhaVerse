import * as React from "react";
import { notFound } from "next/navigation";

import {
  getCollaborationPlugin,
  isCollaborationPluginId,
  mockCollaborationWorkspaces,
} from "@/features/collaboration";

interface CollaborationPluginPageProps {
  params: Promise<{ workspaceId: string; plugin: string }>;
}

export default async function CollaborationPluginPage({
  params,
}: CollaborationPluginPageProps): Promise<React.JSX.Element> {
  const { workspaceId, plugin } = await params;
  const workspace = mockCollaborationWorkspaces.find((entry) => entry.id === workspaceId);

  if (!workspace || !isCollaborationPluginId(plugin)) {
    notFound();
  }

  const Plugin = getCollaborationPlugin(plugin).component;
  return <Plugin entity={workspace} />;
}
