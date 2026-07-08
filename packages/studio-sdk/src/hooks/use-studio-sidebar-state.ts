import * as React from "react";

export function useStudioSidebarState(initialCollapsed = false): {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
} {
  const [collapsed, setCollapsed] = React.useState(initialCollapsed);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  return { collapsed, setCollapsed, toggleCollapsed };
}
