"use client";

import * as React from "react";

import type {
  CollaborationPluginId,
  CollaborationStudioWorkspaceState,
  CollaborationWorkspace,
} from "@/features/collaboration/types/collaboration.types";

type CollaborationWorkspaceAction =
  | { type: "set-workspace"; workspace: CollaborationWorkspace | null }
  | { type: "set-plugin"; plugin: CollaborationPluginId }
  | { type: "set-selected-discussion"; discussionId: string | null }
  | { type: "set-selected-comment"; commentId: string | null }
  | { type: "update-draft-comment"; draftComment: string }
  | { type: "mark-saved" };

const initialState: CollaborationStudioWorkspaceState = {
  currentWorkspace: null,
  currentPlugin: "overview",
  selectedDiscussionId: null,
  selectedCommentId: null,
  draftComment: "",
  unsavedChanges: false,
};

function reducer(
  state: CollaborationStudioWorkspaceState,
  action: CollaborationWorkspaceAction,
): CollaborationStudioWorkspaceState {
  switch (action.type) {
    case "set-workspace":
      return { ...state, currentWorkspace: action.workspace };
    case "set-plugin":
      return { ...state, currentPlugin: action.plugin };
    case "set-selected-discussion":
      return { ...state, selectedDiscussionId: action.discussionId };
    case "set-selected-comment":
      return { ...state, selectedCommentId: action.commentId };
    case "update-draft-comment":
      return { ...state, draftComment: action.draftComment, unsavedChanges: true };
    case "mark-saved":
      return { ...state, unsavedChanges: false };
    default:
      return state;
  }
}

interface CollaborationWorkspaceContextValue {
  state: CollaborationStudioWorkspaceState;
  dispatch: React.Dispatch<CollaborationWorkspaceAction>;
}

const CollaborationWorkspaceContext =
  React.createContext<CollaborationWorkspaceContextValue | null>(null);

export function CollaborationWorkspaceProvider({
  children,
  initialWorkspace,
  initialPlugin,
}: {
  children: React.ReactNode;
  initialWorkspace: CollaborationWorkspace;
  initialPlugin: CollaborationPluginId;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentWorkspace: initialWorkspace,
    currentPlugin: initialPlugin,
    selectedDiscussionId: initialWorkspace.discussions[0]?.id ?? null,
    selectedCommentId: initialWorkspace.openComments[0]?.id ?? null,
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <CollaborationWorkspaceContext.Provider value={value}>
      {children}
    </CollaborationWorkspaceContext.Provider>
  );
}

export function useCollaborationWorkspaceState(): CollaborationWorkspaceContextValue {
  const context = React.useContext(CollaborationWorkspaceContext);
  if (!context) {
    throw new Error(
      "useCollaborationWorkspaceState must be used within CollaborationWorkspaceProvider",
    );
  }
  return context;
}
