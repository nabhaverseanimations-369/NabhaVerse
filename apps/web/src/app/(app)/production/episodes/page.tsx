import * as React from "react";

import { EpisodeLibrary } from "@/components/episode";
import { SectionHeader } from "@/components/workspace/section-header";

export default function EpisodeLibraryPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Episode Studio"
        description="Integrated creative workspace for episode planning, script drafting, scene ordering, and storyboarding."
      />
      <EpisodeLibrary />
    </section>
  );
}
