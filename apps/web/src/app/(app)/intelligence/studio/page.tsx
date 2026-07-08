import * as React from "react";

import {
  IntelligenceCommandPalette,
  IntelligenceDashboard,
  SearchResultsPanel,
} from "@/components/intelligence";

export default function IntelligenceStudioPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <div id="command-palette" className="flex justify-end">
        <IntelligenceCommandPalette />
      </div>
      <IntelligenceDashboard />
      <SearchResultsPanel />
    </section>
  );
}
