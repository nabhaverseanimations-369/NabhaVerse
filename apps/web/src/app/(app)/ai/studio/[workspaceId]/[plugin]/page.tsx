import * as React from "react";
import { notFound } from "next/navigation";

import { getAIPlugin, isAIPluginId, mockAIWorkspace } from "@/features/ai";

interface AIPluginPageProps {
  params: Promise<{ workspaceId: string; plugin: string }>;
}

export default async function AIPluginPage({
  params,
}: AIPluginPageProps): Promise<React.JSX.Element> {
  const { workspaceId, plugin } = await params;

  if (workspaceId !== mockAIWorkspace.id || !isAIPluginId(plugin)) {
    notFound();
  }

  const AIPlugin = getAIPlugin(plugin).component;

  return <AIPlugin entity={mockAIWorkspace} />;
}
