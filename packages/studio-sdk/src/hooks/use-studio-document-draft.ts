import * as React from "react";

import {
  createDraftState,
  markDraftSaved,
  setDraftSaveStatus,
  updateDraftMarkdown,
  type StudioDraftState,
} from "../contracts/workspace-state";
import type { StudioSaveStatus } from "../types/common";

export interface UseStudioDocumentDraftResult {
  draftState: StudioDraftState;
  unsavedChanges: boolean;
  updateMarkdown: (markdown: string) => void;
  setSaveStatus: (saveStatus: StudioSaveStatus) => void;
  markSaved: () => void;
}

export function useStudioDocumentDraft(initialMarkdown: string): UseStudioDocumentDraftResult {
  const [draftState, setDraftState] = React.useState(() =>
    createDraftState(initialMarkdown, "saved"),
  );
  const [unsavedChanges, setUnsavedChanges] = React.useState(false);

  const updateMarkdown = React.useCallback((markdown: string) => {
    setDraftState((current) => updateDraftMarkdown(current, markdown));
    setUnsavedChanges(true);
  }, []);

  const setSaveStatus = React.useCallback((saveStatus: StudioSaveStatus) => {
    setDraftState((current) => setDraftSaveStatus(current, saveStatus));
  }, []);

  const markSaved = React.useCallback(() => {
    setDraftState((current) => markDraftSaved(current));
    setUnsavedChanges(false);
  }, []);

  return {
    draftState,
    unsavedChanges,
    updateMarkdown,
    setSaveStatus,
    markSaved,
  };
}
