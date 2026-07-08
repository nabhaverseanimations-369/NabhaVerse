import { redirect } from "next/navigation";

interface CollaborationWorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function CollaborationWorkspacePage({
  params,
}: CollaborationWorkspacePageProps): Promise<never> {
  const { workspaceId } = await params;
  redirect(`/collaboration/studio/${workspaceId}/overview`);
}
