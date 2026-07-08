"use client";

import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { StudioDocumentEditor } from "@/components/studio/studio-document-editor";
import { useAIWorkspaceState } from "@/features/ai/state/ai-workspace-state";
import type { AIPrompt } from "@/features/ai/types/ai.types";

export function PromptEditor({ prompt }: { prompt: AIPrompt }): React.JSX.Element {
  const { state, dispatch } = useAIWorkspaceState();

  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Prompt Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {prompt.variables.map((variable) => (
              <div
                key={variable.key}
                className="rounded-md border border-[var(--color-border)] p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-[var(--color-text-primary)]">{`{{${variable.key}}}`}</p>
                  <Badge variant={variable.required ? "warning" : "outline"}>
                    {variable.required ? "Required" : "Optional"}
                  </Badge>
                </div>
                <p>{variable.description}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Example: {variable.sampleValue}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
              Preview placeholder: the compiled prompt with variable interpolation will appear here.
            </p>
            <p className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
              Validation placeholder: provider-neutral prompt checks will surface here.
            </p>
          </CardContent>
        </Card>
      </div>

      <StudioDocumentEditor
        title={prompt.name}
        description={prompt.description}
        version={prompt.version}
        markdown={state.draftState.markdown}
        saveStatus={state.draftState.saveStatus}
        unsavedChanges={state.unsavedChanges}
        commentsLabel={`${prompt.name} comments`}
        onChange={(markdown) => {
          dispatch({ type: "update-draft", markdown });
        }}
        onSave={() => {
          dispatch({ type: "set-save-status", status: "saving" });
          window.setTimeout(() => {
            dispatch({ type: "mark-saved" });
          }, 200);
        }}
      />
    </section>
  );
}
