import * as React from "react";
import { notFound } from "next/navigation";

import { getWorldPlugin, isWorldPluginId, mockWorlds } from "@/features/world";

interface WorldPluginPageProps {
  params: Promise<{ worldId: string; plugin: string }>;
}

export default async function WorldPluginPage({
  params,
}: WorldPluginPageProps): Promise<React.JSX.Element> {
  const { worldId, plugin } = await params;
  const world = mockWorlds.find((entry) => entry.id === worldId);

  if (!world || !isWorldPluginId(plugin) || plugin === "overview") {
    notFound();
  }

  const resolvedPlugin = getWorldPlugin(plugin);

  return <resolvedPlugin.component entity={world} />;
}
