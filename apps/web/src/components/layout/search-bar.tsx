"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@nabhaverse/ui";

import { useWorkspaceState } from "@/lib/workspace-state";

export function SearchBar(): React.JSX.Element {
  const { state } = useWorkspaceState();
  const [value, setValue] = React.useState("");

  return (
    <div className="relative w-full max-w-lg">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
        aria-hidden="true"
      />
      <Input
        aria-label="Search workspace"
        placeholder={`Search in ${state.currentStudio.name}`}
        className="pl-9"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </div>
  );
}
