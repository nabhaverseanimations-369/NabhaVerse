import * as React from "react";

import { WorldLibrary } from "@/components/world";
import { SectionHeader } from "@/components/workspace/section-header";

export default function WorldLibraryPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="World Studio"
        description="A registry-driven workspace for building worlds, regions, systems, and lore without flattening the craft into CRUD."
      />
      <WorldLibrary />
    </section>
  );
}
