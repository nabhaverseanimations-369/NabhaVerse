"use client";

import * as React from "react";

import {
  createDraftState,
  markDraftSaved,
  setDraftSaveStatus,
  updateDraftMarkdown,
  type StudioDraftState,
} from "@nabhaverse/studio-sdk";

import type { AIPrompt, AIStudioWorkspace } from "@/features/ai/types/ai.types";

export interface AIWorkspaceState {
  workspace: AIStudioWorkspace | null;
  currentPlugin: string;
  selectedPromptId: string | null;
  selectedModelId: string | null;
  draftState: StudioDraftState;
  unsavedChanges: boolean;
}

type AIWorkspaceAction =
  | { type: "set-workspace"; workspace: AIStudioWorkspace | null }
  | { type: "set-plugin"; plugin: string }
  | { type: "set-selected-prompt"; promptId: string | null }
  | { type: "set-selected-model"; modelId: string | null }
  | { type: "update-draft"; markdown: string }
  | { type: "set-save-status"; status: StudioDraftState["saveStatus"] }
  | { type: "mark-saved" };

const initialState: AIWorkspaceState = {
  workspace: null,
  currentPlugin: "overview",
  selectedPromptId: null,
  selectedModelId: null,
  draftState: createDraftState(),
  unsavedChanges: false,
};

function reducer(state: AIWorkspaceState, action: AIWorkspaceAction): AIWorkspaceState {
  switch (action.type) {
    case "set-workspace":
      return {
        ...state,
        workspace: action.workspace,
      };
    case "set-plugin":
      return {
        ...state,
        currentPlugin: action.plugin,
      };
    case "set-selected-prompt":
      return {
        ...state,
        selectedPromptId: action.promptId,
      };
    case "set-selected-model":
      return {
        ...state,
        selectedModelId: action.modelId,
      };
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

interface AIWorkspaceContextValue {
  state: AIWorkspaceState;
  dispatch: React.Dispatch<AIWorkspaceAction>;
}

const AIWorkspaceContext = React.createContext<AIWorkspaceContextValue | null>(null);

export function AIWorkspaceProvider({
  children,
  initialWorkspace,
  initialPlugin,
  initialPrompt,
}: {
  children: React.ReactNode;
  initialWorkspace: AIStudioWorkspace;
  initialPlugin: string;
  initialPrompt: AIPrompt;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    workspace: initialWorkspace,
    currentPlugin: initialPlugin,
    selectedPromptId: initialPrompt.id,
    selectedModelId: initialWorkspace.models[0]?.id ?? null,
    draftState: createDraftState(initialPrompt.content, "saved"),
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <AIWorkspaceContext.Provider value={value}>{children}</AIWorkspaceContext.Provider>;
}

export function useAIWorkspaceState(): AIWorkspaceContextValue {
  const context = React.useContext(AIWorkspaceContext);
  if (!context) {
    throw new Error("useAIWorkspaceState must be used within AIWorkspaceProvider");
  }
  return context;
}
