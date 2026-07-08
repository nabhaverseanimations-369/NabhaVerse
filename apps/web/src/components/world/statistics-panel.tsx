import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

interface StatisticsPanelProps {
  statistics: {
    regions: number;
    locations: number;
    cultures: number;
    species: number;
  };
}

export function StatisticsPanel({ statistics }: StatisticsPanelProps): React.JSX.Element {
  const items = [
    { label: "Regions", value: statistics.regions },
    { label: "Locations", value: statistics.locations },
    { label: "Cultures", value: statistics.cultures },
    { label: "Species", value: statistics.species },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-md border border-[var(--color-border)] p-3">
              <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                {item.label}
              </dt>
              <dd className="text-xl font-semibold text-[var(--color-text-primary)]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
