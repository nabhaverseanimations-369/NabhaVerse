import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

interface RegionNode {
  id: string;
  label: string;
  children?: RegionNode[];
}

const regionTree: RegionNode[] = [
  {
    id: "north",
    label: "Northern Expanse",
    children: [
      { id: "frost", label: "Frost District" },
      { id: "aurora", label: "Aurora Cliffs" },
    ],
  },
  {
    id: "coast",
    label: "Coastal Ring",
    children: [
      { id: "harbor", label: "Lantern Harbor" },
      { id: "reef", label: "Glass Reef" },
    ],
  },
];

function Node({ node }: { node: RegionNode }): React.JSX.Element {
  return (
    <li className="space-y-2">
      <div className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2">
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm text-[var(--color-text-primary)]">{node.label}</span>
      </div>
      {node.children ? (
        <ul className="ml-5 space-y-2">
          {node.children.map((child) => (
            <Node key={child.id} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function RegionTree(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Region Tree</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" aria-label="Region tree">
          {regionTree.map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
