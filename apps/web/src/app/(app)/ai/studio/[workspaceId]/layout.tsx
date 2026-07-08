import * as React from "react";
import { notFound } from "next/navigation";

import { AIWorkspaceShell } from "@/components/ai";
import { mockAIWorkspace, mockPrompts } from "@/features/ai";
import { AIWorkspaceProvider } from "@/features/ai";

interface AIWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

export default async function AIWorkspaceLayout({
  children,
  params,
}: AIWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { workspaceId } = await params;

  if (workspaceId !== mockAIWorkspace.id) {
    notFound();
  }

  const firstPrompt = mockPrompts[0];

  if (!firstPrompt) {
    notFound();
  }

  return (
    <AIWorkspaceProvider
      initialWorkspace={mockAIWorkspace}
      initialPlugin="overview"
      initialPrompt={firstPrompt}
    >
      <AIWorkspaceShell workspaceId={workspaceId}>{children}</AIWorkspaceShell>
    </AIWorkspaceProvider>
  );
}
