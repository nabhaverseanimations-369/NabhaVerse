"use client";

import * as React from "react";
import { Badge, Button, cn } from "@nabhaverse/ui";

export interface TagPickerProps {
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

export function TagPicker({
  selected,
  options,
  onChange,
  className,
}: TagPickerProps): React.JSX.Element {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label="Tag filters">
      {options.map((tag) => {
        const active = selected.includes(tag);
        return (
          <Button
            key={tag}
            type="button"
            variant={active ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              if (active) {
                onChange(selected.filter((entry) => entry !== tag));
                return;
              }
              onChange([...selected, tag]);
            }}
          >
            <Badge variant={active ? "secondary" : "outline"} className="mr-2">
              #{tag}
            </Badge>
            {active ? "Selected" : "Add"}
          </Button>
        );
      })}
    </div>
  );
}
