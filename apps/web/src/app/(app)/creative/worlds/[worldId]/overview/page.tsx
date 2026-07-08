import * as React from "react";
import { notFound } from "next/navigation";

import { getWorldPlugin } from "@/features/world";
import { mockWorlds } from "@/features/world";

interface WorldOverviewPageProps {
  params: Promise<{ worldId: string }>;
}

export default async function WorldOverviewPage({
  params,
}: WorldOverviewPageProps): Promise<React.JSX.Element> {
  const { worldId } = await params;
  const world = mockWorlds.find((entry) => entry.id === worldId);

  if (!world) {
    notFound();
  }

  const plugin = getWorldPlugin("overview");

  return <plugin.component entity={world} />;
}
