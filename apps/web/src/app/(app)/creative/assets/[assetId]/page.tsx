import { redirect } from "next/navigation";

interface AssetPageProps {
  params: Promise<{ assetId: string }>;
}

export default async function AssetPage({ params }: AssetPageProps): Promise<never> {
  const { assetId } = await params;
  redirect(`/creative/assets/${assetId}/overview`);
}
