"use client";

import * as React from "react";

import {
  createDraftState,
  markDraftSaved,
  setDraftSaveStatus,
  updateDraftMarkdown,
  type StudioDraftState,
} from "@nabhaverse/studio-sdk";

import type { Production } from "@/features/production/types/production.types";

export interface ProductionStudioWorkspaceState {
  currentProduction: Production | null;
  currentPlugin: string;
  draftState: StudioDraftState;
  selectedTaskId: string | null;
  selectedMilestoneId: string | null;
  unsavedChanges: boolean;
}

type ProductionWorkspaceAction =
  | { type: "set-production"; production: Production | null }
  | { type: "set-plugin"; plugin: string }
  | { type: "set-selected-task"; taskId: string | null }
  | { type: "set-selected-milestone"; milestoneId: string | null }
  | { type: "update-draft"; markdown: string }
  | { type: "set-save-status"; status: StudioDraftState["saveStatus"] }
  | { type: "mark-saved" };

const initialState: ProductionStudioWorkspaceState = {
  currentProduction: null,
  currentPlugin: "overview",
  draftState: createDraftState(),
  selectedTaskId: null,
  selectedMilestoneId: null,
  unsavedChanges: false,
};

function reducer(
  state: ProductionStudioWorkspaceState,
  action: ProductionWorkspaceAction,
): ProductionStudioWorkspaceState {
  switch (action.type) {
    case "set-production":
      return { ...state, currentProduction: action.production };
    case "set-plugin":
      return { ...state, currentPlugin: action.plugin };
    case "set-selected-task":
      return { ...state, selectedTaskId: action.taskId };
    case "set-selected-milestone":
      return { ...state, selectedMilestoneId: action.milestoneId };
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

interface ProductionWorkspaceContextValue {
  state: ProductionStudioWorkspaceState;
  dispatch: React.Dispatch<ProductionWorkspaceAction>;
}

const ProductionWorkspaceContext = React.createContext<ProductionWorkspaceContextValue | null>(
  null,
);

export function ProductionWorkspaceProvider({
  children,
  initialProduction,
  initialPlugin,
  initialMarkdown,
}: {
  children: React.ReactNode;
  initialProduction: Production;
  initialPlugin: string;
  initialMarkdown: string;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentProduction: initialProduction,
    currentPlugin: initialPlugin,
    selectedTaskId: initialProduction.tasks[0]?.id ?? null,
    selectedMilestoneId: initialProduction.milestones[0]?.id ?? null,
    draftState: createDraftState(initialMarkdown, "saved"),
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ProductionWorkspaceContext.Provider value={value}>
      {children}
    </ProductionWorkspaceContext.Provider>
  );
}

export function useProductionWorkspaceState(): ProductionWorkspaceContextValue {
  const context = React.useContext(ProductionWorkspaceContext);
  if (!context) {
    throw new Error("useProductionWorkspaceState must be used within ProductionWorkspaceProvider");
  }
  return context;
}
