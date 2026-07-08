import * as React from "react";
import { MapPinned } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@nabhaverse/ui";

export function MapPlaceholder({ title = "Map Canvas" }: { title?: string }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          title="Interactive map placeholder"
          description="Map rendering and layer editing will be introduced in a later epic. This panel reserves the UX surface for that capability."
          icon={<MapPinned className="h-8 w-8" aria-hidden="true" />}
        />
      </CardContent>
    </Card>
  );
}
