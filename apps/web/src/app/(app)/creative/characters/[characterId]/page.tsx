import { redirect } from "next/navigation";

interface CharacterPageProps {
  params: Promise<{ characterId: string }>;
}

export default async function CharacterPage({ params }: CharacterPageProps): Promise<never> {
  const { characterId } = await params;
  redirect(`/creative/characters/${characterId}/overview`);
}
