import { redirect } from "next/navigation";

interface EpisodePageProps {
  params: Promise<{ episodeId: string }>;
}

export default async function EpisodePage({ params }: EpisodePageProps): Promise<never> {
  const { episodeId } = await params;
  redirect(`/production/episodes/${episodeId}/overview`);
}
