import * as React from "react";

import { CharacterLibrary } from "@/components/character";
import { SectionHeader } from "@/components/workspace/section-header";

export default function CharacterLibraryPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Character Studio"
        description="Creative library for designing and managing animated characters across your universe."
      />
      <CharacterLibrary />
    </section>
  );
}
