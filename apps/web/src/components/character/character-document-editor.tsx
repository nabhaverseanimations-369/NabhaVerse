"use client";

import * as React from "react";
import { FileImage, FileText, Save } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
} from "@nabhaverse/ui";

import { CommentPanel } from "@/components/character/comment-panel";
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
    <section className="grid gap-4 2xl:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{title}</CardTitle>
            <Badge variant="outline">{version}</Badge>
            <Badge variant={state.unsavedChanges ? "warning" : "success"}>
              {state.unsavedChanges ? "Unsaved changes" : "All changes saved"}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">Rich text placeholder</p>
            <p>Toolbar and rich formatting controls will be integrated in a subsequent epic.</p>
          </div>

          <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">
              Markdown support placeholder
            </p>
            <p>Live markdown preview pane will be attached to this editor region.</p>
          </div>

          <Textarea
            value={state.draftState.markdown}
            onChange={(event) => {
              dispatch({ type: "update-draft", markdown: event.currentTarget.value });
            }}
            className="min-h-56"
            aria-label={`${title} content`}
          />

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              <FileImage className="h-4 w-4" aria-hidden="true" /> Image attachment placeholder
            </Button>
            <Button type="button" variant="outline">
              <FileText className="h-4 w-4" aria-hidden="true" /> Reference attachment placeholder
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                dispatch({ type: "set-save-status", status: "saving" });
                window.setTimeout(() => {
                  dispatch({ type: "mark-saved" });
                }, 250);
              }}
            >
              <Save className="h-4 w-4" aria-hidden="true" /> Save draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <CommentPanel sectionLabel={title} />
    </section>
  );
}
