"use client";

import * as React from "react";
import { StudioDocumentEditor } from "@/components/studio";
import { useCharacterWorkspaceState } from "@/features/character/state/character-workspace-state";

interface CharacterDocumentEditorProps {
  title: string;
  description: string;
  version: string;
}

export function CharacterDocumentEditor({
  title,
  description,
  version,
}: CharacterDocumentEditorProps): React.JSX.Element {
  const { state, dispatch } = useCharacterWorkspaceState();

  return (
    <StudioDocumentEditor
      title={title}
      description={description}
      version={version}
      markdown={state.draftState.markdown}
      saveStatus={state.draftState.saveStatus}
      unsavedChanges={state.unsavedChanges}
      onChange={(markdown) => {
        dispatch({ type: "update-draft", markdown });
      }}
      onSave={() => {
        dispatch({ type: "set-save-status", status: "saving" });
        window.setTimeout(() => {
          dispatch({ type: "mark-saved" });
        }, 250);
      }}
      commentsLabel={title}
    />
  );
}
