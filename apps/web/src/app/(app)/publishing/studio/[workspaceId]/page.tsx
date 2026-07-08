import { redirect } from "next/navigation";

interface PublishingWorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function PublishingWorkspacePage({
  params,
}: PublishingWorkspacePageProps): Promise<never> {
  const { workspaceId } = await params;
  redirect(`/publishing/studio/${workspaceId}/overview`);
}
