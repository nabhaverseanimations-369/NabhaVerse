"use client";

import * as React from "react";

import {
  createDraftState,
  markDraftSaved,
  setDraftSaveStatus,
  updateDraftMarkdown,
  type StudioDraftState,
} from "@nabhaverse/studio-sdk";

import type { Asset, AssetType } from "@/features/asset/types/asset.types";

export type AssetDraftState = StudioDraftState;

export interface AssetWorkspaceState {
  currentAsset: Asset | null;
  currentPlugin: string;
  draftState: AssetDraftState;
  selectedCollection: string | null;
  selectedType: AssetType | null;
  unsavedChanges: boolean;
  currentVersion: string;
}

type AssetWorkspaceAction =
  | { type: "set-asset"; asset: Asset | null }
  | { type: "set-plugin"; plugin: string }
  | { type: "update-draft"; markdown: string }
  | { type: "set-save-status"; status: AssetDraftState["saveStatus"] }
  | { type: "mark-saved" }
  | { type: "set-version"; version: string }
  | { type: "set-selected-collection"; collectionId: string | null }
  | { type: "set-selected-type"; assetType: AssetType | null };

const initialState: AssetWorkspaceState = {
  currentAsset: null,
  currentPlugin: "overview",
  draftState: createDraftState(),
  selectedCollection: null,
  selectedType: null,
  unsavedChanges: false,
  currentVersion: "v1.0",
};

function reducer(state: AssetWorkspaceState, action: AssetWorkspaceAction): AssetWorkspaceState {
  switch (action.type) {
    case "set-asset":
      return {
        ...state,
        currentAsset: action.asset,
        currentVersion: action.asset?.version ?? state.currentVersion,
      };
    case "set-plugin":
      return { ...state, currentPlugin: action.plugin };
    case "update-draft":
      return {
        ...state,
        draftState: updateDraftMarkdown(state.draftState, action.markdown),
        unsavedChanges: true,
      };
    case "set-save-status":
      return { ...state, draftState: setDraftSaveStatus(state.draftState, action.status) };
    case "mark-saved":
      return { ...state, draftState: markDraftSaved(state.draftState), unsavedChanges: false };
    case "set-version":
      return { ...state, currentVersion: action.version };
    case "set-selected-collection":
      return { ...state, selectedCollection: action.collectionId };
    case "set-selected-type":
      return { ...state, selectedType: action.assetType };
    default:
      return state;
  }
}

interface AssetWorkspaceContextValue {
  state: AssetWorkspaceState;
  dispatch: React.Dispatch<AssetWorkspaceAction>;
}

const AssetWorkspaceContext = React.createContext<AssetWorkspaceContextValue | null>(null);

export function AssetWorkspaceProvider({
  children,
  initialAsset,
  initialPlugin,
  initialMarkdown,
}: {
  children: React.ReactNode;
  initialAsset: Asset;
  initialPlugin: string;
  initialMarkdown: string;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentAsset: initialAsset,
    currentPlugin: initialPlugin,
    currentVersion: initialAsset.version,
    draftState: createDraftState(initialMarkdown, "saved"),
    selectedCollection: initialAsset.collections[0] ?? null,
    selectedType: initialAsset.type,
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <AssetWorkspaceContext.Provider value={value}>{children}</AssetWorkspaceContext.Provider>;
}

export function useAssetWorkspaceState(): AssetWorkspaceContextValue {
  const context = React.useContext(AssetWorkspaceContext);
  if (!context) {
    throw new Error("useAssetWorkspaceState must be used within AssetWorkspaceProvider");
  }
  return context;
}
