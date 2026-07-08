"use client";

import * as React from "react";

import {
  createDraftState,
  markDraftSaved,
  setDraftSaveStatus,
  updateDraftMarkdown,
  type StudioDraftState,
} from "@nabhaverse/studio-sdk";

import type { Episode, EpisodePluginId } from "@/features/episode/types/episode.types";

export type EpisodeDraftState = StudioDraftState;

export interface EpisodeWorkspaceState {
  currentEpisode: Episode | null;
  currentPlugin: EpisodePluginId;
  draftState: EpisodeDraftState;
  selectedScene: string | null;
  unsavedChanges: boolean;
  currentVersion: string;
}

type EpisodeWorkspaceAction =
  | { type: "set-episode"; episode: Episode | null }
  | { type: "set-plugin"; plugin: EpisodePluginId }
  | { type: "update-draft"; markdown: string }
  | { type: "set-save-status"; status: EpisodeDraftState["saveStatus"] }
  | { type: "mark-saved" }
  | { type: "set-version"; version: string }
  | { type: "set-selected-scene"; sceneId: string | null };

const initialState: EpisodeWorkspaceState = {
  currentEpisode: null,
  currentPlugin: "overview",
  draftState: createDraftState(),
  selectedScene: null,
  unsavedChanges: false,
  currentVersion: "v1.0",
};

function reducer(
  state: EpisodeWorkspaceState,
  action: EpisodeWorkspaceAction,
): EpisodeWorkspaceState {
  switch (action.type) {
    case "set-episode":
      return {
        ...state,
        currentEpisode: action.episode,
        currentVersion: action.episode?.version ?? state.currentVersion,
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
      return {
        ...state,
        draftState: markDraftSaved(state.draftState),
        unsavedChanges: false,
      };
    case "set-version":
      return { ...state, currentVersion: action.version };
    case "set-selected-scene":
      return { ...state, selectedScene: action.sceneId };
    default:
      return state;
  }
}

interface EpisodeWorkspaceContextValue {
  state: EpisodeWorkspaceState;
  dispatch: React.Dispatch<EpisodeWorkspaceAction>;
}

const EpisodeWorkspaceContext = React.createContext<EpisodeWorkspaceContextValue | null>(null);

export function EpisodeWorkspaceProvider({
  children,
  initialEpisode,
  initialPlugin,
  initialMarkdown,
}: {
  children: React.ReactNode;
  initialEpisode: Episode;
  initialPlugin: EpisodePluginId;
  initialMarkdown: string;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentEpisode: initialEpisode,
    currentPlugin: initialPlugin,
    currentVersion: initialEpisode.version,
    draftState: createDraftState(initialMarkdown, "saved"),
    selectedScene: initialEpisode.scenes[0]?.id ?? null,
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <EpisodeWorkspaceContext.Provider value={value}>{children}</EpisodeWorkspaceContext.Provider>
  );
}

export function useEpisodeWorkspaceState(): EpisodeWorkspaceContextValue {
  const context = React.useContext(EpisodeWorkspaceContext);
  if (!context) {
    throw new Error("useEpisodeWorkspaceState must be used within EpisodeWorkspaceProvider");
  }
  return context;
}
