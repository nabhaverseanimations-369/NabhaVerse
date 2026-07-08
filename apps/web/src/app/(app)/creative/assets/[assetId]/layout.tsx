import * as React from "react";
import { notFound } from "next/navigation";

import { AssetWorkspaceShell } from "@/components/asset";
import { mockAssets } from "@/features/asset";
import { AssetWorkspaceProvider } from "@/features/asset";

interface AssetWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ assetId: string }>;
}

export default async function AssetWorkspaceLayout({
  children,
  params,
}: AssetWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { assetId } = await params;
  const asset = mockAssets.find((entry) => entry.id === assetId);

  if (!asset) {
    notFound();
  }

  return (
    <AssetWorkspaceProvider
      initialAsset={asset}
      initialPlugin="overview"
      initialMarkdown={`# ${asset.name}\n\nAsset workspace is ready.`}
    >
      <AssetWorkspaceShell assetId={assetId}>{children}</AssetWorkspaceShell>
    </AssetWorkspaceProvider>
  );
}
