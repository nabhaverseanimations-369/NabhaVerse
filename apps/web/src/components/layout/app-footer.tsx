import * as React from "react";

export function AppFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-[var(--color-border)] px-4 py-3 text-xs text-[var(--color-text-muted)] md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p>NabhaVerse Studio OS Shell · Epic 3</p>
        <p>All systems nominal · Status updates every 60s</p>
      </div>
    </footer>
  );
}
