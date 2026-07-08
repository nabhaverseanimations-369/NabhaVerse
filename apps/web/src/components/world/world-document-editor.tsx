"use client";

import * as React from "react";

import { StudioDocumentEditor } from "@/components/studio";
import { useWorldWorkspaceState } from "@/features/world/state/world-workspace-state";

interface WorldDocumentEditorProps {
  title: string;
  description: string;
  version: string;
}

export function WorldDocumentEditor({
  title,
  description,
  version,
}: WorldDocumentEditorProps): React.JSX.Element {
  const { state, dispatch } = useWorldWorkspaceState();

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
