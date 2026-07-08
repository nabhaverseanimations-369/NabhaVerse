import { redirect } from "next/navigation";

interface AIWorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function AIWorkspacePage({ params }: AIWorkspacePageProps): Promise<never> {
  const { workspaceId } = await params;
  redirect(`/ai/studio/${workspaceId}/overview`);
}
