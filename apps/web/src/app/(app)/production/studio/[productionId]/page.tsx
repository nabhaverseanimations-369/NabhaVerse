import { redirect } from "next/navigation";

interface ProductionWorkspacePageProps {
  params: Promise<{ productionId: string }>;
}

export default async function ProductionWorkspacePage({
  params,
}: ProductionWorkspacePageProps): Promise<never> {
  const { productionId } = await params;
  redirect(`/production/studio/${productionId}/overview`);
}
