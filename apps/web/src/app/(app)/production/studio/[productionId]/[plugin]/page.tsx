import * as React from "react";
import { notFound } from "next/navigation";

import { getProductionPlugin, isProductionPluginId, mockProductions } from "@/features/production";

interface ProductionPluginPageProps {
  params: Promise<{ productionId: string; plugin: string }>;
}

export default async function ProductionPluginPage({
  params,
}: ProductionPluginPageProps): Promise<React.JSX.Element> {
  const { productionId, plugin } = await params;
  const production = mockProductions.find((entry) => entry.id === productionId);

  if (!production || !isProductionPluginId(plugin)) {
    notFound();
  }

  const ProductionPlugin = getProductionPlugin(plugin).component;
  return <ProductionPlugin entity={production} />;
}
