"use client";

import * as React from "react";

import {
  createDraftState,
  markDraftSaved,
  setDraftSaveStatus,
  updateDraftMarkdown,
  type StudioDraftState,
} from "@nabhaverse/studio-sdk";

import type { Publication } from "@/features/publishing/types/publishing.types";

export interface PublishingStudioWorkspaceState {
  currentPublication: Publication | null;
  currentPlugin: string;
  selectedReleaseId: string | null;
  selectedTargetId: string | null;
  draftState: StudioDraftState;
  unsavedChanges: boolean;
}

type PublishingWorkspaceAction =
  | { type: "set-publication"; publication: Publication | null }
  | { type: "set-plugin"; plugin: string }
  | { type: "set-selected-release"; releaseId: string | null }
  | { type: "set-selected-target"; targetId: string | null }
  | { type: "update-draft"; markdown: string }
  | { type: "set-save-status"; status: StudioDraftState["saveStatus"] }
  | { type: "mark-saved" };

const initialState: PublishingStudioWorkspaceState = {
  currentPublication: null,
  currentPlugin: "overview",
  selectedReleaseId: null,
  selectedTargetId: null,
  draftState: createDraftState(),
  unsavedChanges: false,
};

function reducer(
  state: PublishingStudioWorkspaceState,
  action: PublishingWorkspaceAction,
): PublishingStudioWorkspaceState {
  switch (action.type) {
    case "set-publication":
      return { ...state, currentPublication: action.publication };
    case "set-plugin":
      return { ...state, currentPlugin: action.plugin };
    case "set-selected-release":
      return { ...state, selectedReleaseId: action.releaseId };
    case "set-selected-target":
      return { ...state, selectedTargetId: action.targetId };
    case "update-draft":
      return {
        ...state,
        draftState: updateDraftMarkdown(state.draftState, action.markdown),
        unsavedChanges: true,
      };
    case "set-save-status":
      return {
        ...state,
        draftState: setDraftSaveStatus(state.draftState, action.status),
      };
    case "mark-saved":
      return {
        ...state,
        draftState: markDraftSaved(state.draftState),
        unsavedChanges: false,
      };
    default:
      return state;
  }
}

interface PublishingWorkspaceContextValue {
  state: PublishingStudioWorkspaceState;
  dispatch: React.Dispatch<PublishingWorkspaceAction>;
}

const PublishingWorkspaceContext = React.createContext<PublishingWorkspaceContextValue | null>(
  null,
);

export function PublishingWorkspaceProvider({
  children,
  initialPublication,
  initialPlugin,
  initialMarkdown,
}: {
  children: React.ReactNode;
  initialPublication: Publication;
  initialPlugin: string;
  initialMarkdown: string;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentPublication: initialPublication,
    currentPlugin: initialPlugin,
    selectedReleaseId: initialPublication.releases[0]?.id ?? null,
    selectedTargetId: initialPublication.releases[0]?.targets[0]?.id ?? null,
    draftState: createDraftState(initialMarkdown, "saved"),
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <PublishingWorkspaceContext.Provider value={value}>
      {children}
    </PublishingWorkspaceContext.Provider>
  );
}

export function usePublishingWorkspaceState(): PublishingWorkspaceContextValue {
  const context = React.useContext(PublishingWorkspaceContext);
  if (!context) {
    throw new Error("usePublishingWorkspaceState must be used within PublishingWorkspaceProvider");
  }
  return context;
}
