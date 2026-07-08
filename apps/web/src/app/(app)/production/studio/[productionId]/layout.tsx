import * as React from "react";
import { notFound } from "next/navigation";

import { ProductionWorkspaceShell } from "@/components/production";
import { mockProductions, ProductionWorkspaceProvider } from "@/features/production";

interface ProductionWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ productionId: string }>;
}

export default async function ProductionWorkspaceLayout({
  children,
  params,
}: ProductionWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { productionId } = await params;
  const production = mockProductions.find((entry) => entry.id === productionId);

  if (!production) {
    notFound();
  }

  return (
    <ProductionWorkspaceProvider
      initialProduction={production}
      initialPlugin="overview"
      initialMarkdown="# Production notes"
    >
      <ProductionWorkspaceShell productionId={productionId}>{children}</ProductionWorkspaceShell>
    </ProductionWorkspaceProvider>
  );
}
