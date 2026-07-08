import * as React from "react";
import { notFound } from "next/navigation";

import { getAssetPlugin, isAssetPluginId } from "@/features/asset";
import { mockAssets } from "@/features/asset";

interface AssetPluginPageProps {
  params: Promise<{ assetId: string; plugin: string }>;
}

export default async function AssetPluginPage({
  params,
}: AssetPluginPageProps): Promise<React.JSX.Element> {
  const { assetId, plugin } = await params;
  const asset = mockAssets.find((entry) => entry.id === assetId);

  if (!asset || !isAssetPluginId(plugin)) {
    notFound();
  }

  const AssetPlugin = getAssetPlugin(plugin).component;

  return <AssetPlugin entity={asset} />;
}
