"use client";

import * as React from "react";

import type { World, WorldPluginId } from "@/features/world/types/world.types";

export interface WorldDraftState {
  markdown: string;
  saveStatus: "idle" | "saving" | "saved";
}

export interface WorldWorkspaceState {
  currentWorld: World | null;
  selectedPlugin: WorldPluginId;
  draftState: WorldDraftState;
  unsavedChanges: boolean;
  currentVersion: string;
  workspaceSettings: {
    sidebarCollapsed: boolean;
    compactMode: boolean;
  };
}

type WorldWorkspaceAction =
  | { type: "set-world"; world: World | null }
  | { type: "set-plugin"; plugin: WorldPluginId }
  | { type: "update-draft"; markdown: string }
  | { type: "set-save-status"; status: WorldDraftState["saveStatus"] }
  | { type: "mark-saved" }
  | { type: "set-version"; version: string }
  | { type: "set-sidebar-collapsed"; collapsed: boolean }
  | { type: "set-compact-mode"; compactMode: boolean };

const initialState: WorldWorkspaceState = {
  currentWorld: null,
  selectedPlugin: "overview",
  draftState: { markdown: "", saveStatus: "idle" },
  unsavedChanges: false,
  currentVersion: "v1.0",
  workspaceSettings: {
    sidebarCollapsed: false,
    compactMode: false,
  },
};

function reducer(state: WorldWorkspaceState, action: WorldWorkspaceAction): WorldWorkspaceState {
  switch (action.type) {
    case "set-world":
      return {
        ...state,
        currentWorld: action.world,
        currentVersion: action.world?.version ?? state.currentVersion,
      };
    case "set-plugin":
      return { ...state, selectedPlugin: action.plugin };
    case "update-draft":
      return {
        ...state,
        draftState: { ...state.draftState, markdown: action.markdown, saveStatus: "idle" },
        unsavedChanges: true,
      };
    case "set-save-status":
      return { ...state, draftState: { ...state.draftState, saveStatus: action.status } };
    case "mark-saved":
      return {
        ...state,
        draftState: { ...state.draftState, saveStatus: "saved" },
        unsavedChanges: false,
      };
    case "set-version":
      return { ...state, currentVersion: action.version };
    case "set-sidebar-collapsed":
      return {
        ...state,
        workspaceSettings: { ...state.workspaceSettings, sidebarCollapsed: action.collapsed },
      };
    case "set-compact-mode":
      return {
        ...state,
        workspaceSettings: { ...state.workspaceSettings, compactMode: action.compactMode },
      };
    default:
      return state;
  }
}

interface WorldWorkspaceContextValue {
  state: WorldWorkspaceState;
  dispatch: React.Dispatch<WorldWorkspaceAction>;
}

const WorldWorkspaceContext = React.createContext<WorldWorkspaceContextValue | null>(null);

export function WorldWorkspaceProvider({
  children,
  initialWorld,
  initialPlugin,
  initialMarkdown,
}: {
  children: React.ReactNode;
  initialWorld: World;
  initialPlugin: WorldPluginId;
  initialMarkdown: string;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentWorld: initialWorld,
    selectedPlugin: initialPlugin,
    currentVersion: initialWorld.version,
    draftState: {
      markdown: initialMarkdown,
      saveStatus: "saved",
    },
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);
  return <WorldWorkspaceContext.Provider value={value}>{children}</WorldWorkspaceContext.Provider>;
}

export function useWorldWorkspaceState(): WorldWorkspaceContextValue {
  const context = React.useContext(WorldWorkspaceContext);
  if (!context) {
    throw new Error("useWorldWorkspaceState must be used within WorldWorkspaceProvider");
  }
  return context;
}
