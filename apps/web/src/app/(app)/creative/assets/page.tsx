import * as React from "react";

import { AssetLibrary } from "@/components/asset";
import { SectionHeader } from "@/components/workspace/section-header";

export default function AssetLibraryPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Asset Studio"
        description="Central digital asset management workspace for production references, media, and reusable creative assets."
      />
      <AssetLibrary />
    </section>
  );
}
