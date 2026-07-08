"use client";

import * as React from "react";
import {
  createDraftState,
  markDraftSaved,
  setDraftSaveStatus,
  updateDraftMarkdown,
  type StudioDraftState,
} from "@nabhaverse/studio-sdk";

import { getCharacterSection } from "@/features/character/constants/character-sections";
import type { Character, CharacterDocumentType } from "@/features/character/types/character.types";

export type CharacterDraftState = StudioDraftState;

export interface CharacterWorkspaceState {
  currentCharacter: Character | null;
  selectedSheet: CharacterDocumentType;
  draftState: CharacterDraftState;
  unsavedChanges: boolean;
  currentVersion: string;
  sidebarCollapsed: boolean;
}

type CharacterWorkspaceAction =
  | { type: "set-character"; character: Character | null }
  | { type: "set-sheet"; sheet: CharacterDocumentType }
  | { type: "update-draft"; markdown: string }
  | { type: "set-save-status"; status: CharacterDraftState["saveStatus"] }
  | { type: "mark-saved" }
  | { type: "set-version"; version: string }
  | { type: "set-sidebar-collapsed"; collapsed: boolean };

const initialState: CharacterWorkspaceState = {
  currentCharacter: null,
  selectedSheet: "overview",
  draftState: createDraftState(),
  unsavedChanges: false,
  currentVersion: "v1.0",
  sidebarCollapsed: false,
};

function reducer(
  state: CharacterWorkspaceState,
  action: CharacterWorkspaceAction,
): CharacterWorkspaceState {
  switch (action.type) {
    case "set-character":
      return {
        ...state,
        currentCharacter: action.character,
        currentVersion: action.character?.version ?? state.currentVersion,
      };
    case "set-sheet": {
      const section = getCharacterSection(action.sheet);
      return {
        ...state,
        selectedSheet: section.id,
      };
    }
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
    case "set-version":
      return {
        ...state,
        currentVersion: action.version,
      };
    case "set-sidebar-collapsed":
      return {
        ...state,
        sidebarCollapsed: action.collapsed,
      };
    default:
      return state;
  }
}

interface CharacterWorkspaceContextValue {
  state: CharacterWorkspaceState;
  dispatch: React.Dispatch<CharacterWorkspaceAction>;
}

const CharacterWorkspaceContext = React.createContext<CharacterWorkspaceContextValue | null>(null);

export function CharacterWorkspaceProvider({
  children,
  initialCharacter,
  initialSheet,
  initialMarkdown,
}: {
  children: React.ReactNode;
  initialCharacter: Character;
  initialSheet: CharacterDocumentType;
  initialMarkdown: string;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentCharacter: initialCharacter,
    selectedSheet: initialSheet,
    currentVersion: initialCharacter.version,
    draftState: createDraftState(initialMarkdown, "saved"),
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <CharacterWorkspaceContext.Provider value={value}>
      {children}
    </CharacterWorkspaceContext.Provider>
  );
}

export function useCharacterWorkspaceState(): CharacterWorkspaceContextValue {
  const context = React.useContext(CharacterWorkspaceContext);
  if (!context) {
    throw new Error("useCharacterWorkspaceState must be used within CharacterWorkspaceProvider");
  }
  return context;
}
