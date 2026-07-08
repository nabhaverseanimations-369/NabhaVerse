import * as React from "react";
import { notFound } from "next/navigation";

import { getPublishingPlugin, isPublishingPluginId, mockPublications } from "@/features/publishing";

interface PublishingPluginPageProps {
  params: Promise<{ workspaceId: string; plugin: string }>;
}

export default async function PublishingPluginPage({
  params,
}: PublishingPluginPageProps): Promise<React.JSX.Element> {
  const { workspaceId, plugin } = await params;
  const workspace = mockPublications.find((entry) => entry.id === workspaceId);

  if (!workspace || !isPublishingPluginId(plugin)) {
    notFound();
  }

  const Plugin = getPublishingPlugin(plugin).component;
  return <Plugin entity={workspace} />;
}
