"use client";

import * as React from "react";
import { ChevronsUpDown, Layers3 } from "lucide-react";
import { Badge, Button } from "@nabhaverse/ui";

import { DropdownMenu } from "@/components/common/dropdown-menu";
import { useToast } from "@/components/feedback/toast-provider";
import { useWorkspaceState } from "@/lib/workspace-state";

const studios = [
  { id: "std_001", name: "NabhaVerse Prime", slug: "nabhaverse-prime", plan: "Pro" as const },
  { id: "std_002", name: "Aurora Collective", slug: "aurora-collective", plan: "Starter" as const },
  { id: "std_003", name: "Celestial Forge", slug: "celestial-forge", plan: "Enterprise" as const },
];

export function WorkspaceSwitcher(): React.JSX.Element {
  const { state, dispatch } = useWorkspaceState();
  const { notify } = useToast();

  const items = React.useMemo(
    () =>
      studios.map((studio) => ({
        id: studio.id,
        label: studio.name,
        description: `${studio.plan} plan`,
        onSelect: () => {
          dispatch({ type: "set-current-studio", studio });
          notify({
            title: "Workspace switched",
            description: `Now working in ${studio.name}.`,
            severity: "info",
          });
        },
      })),
    [dispatch, notify],
  );

  return (
    <DropdownMenu
      label="Switch workspace"
      items={items}
      align="left"
      trigger={
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <Layers3 className="h-4 w-4" aria-hidden="true" />
          <span className="hidden lg:inline">{state.currentStudio.name}</span>
          <Badge variant="secondary" className="hidden lg:inline-flex">
            {state.currentStudio.plan}
          </Badge>
          <ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      }
    />
  );
}
