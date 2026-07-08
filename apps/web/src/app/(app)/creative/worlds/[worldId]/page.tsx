import { redirect } from "next/navigation";

interface WorldPageProps {
  params: Promise<{ worldId: string }>;
}

export default async function WorldPage({ params }: WorldPageProps): Promise<never> {
  const { worldId } = await params;
  redirect(`/creative/worlds/${worldId}/overview`);
}
