"use client";

import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@nabhaverse/ui";
import { StudioCommentPanel, useStudioDocumentDraft } from "@nabhaverse/studio-sdk";

import type { Episode } from "@/features/episode/types/episode.types";

export function EpisodeScriptEditor({ episode }: { episode: Episode }): React.JSX.Element {
  const { draftState, unsavedChanges, updateMarkdown, setSaveStatus, markSaved } =
    useStudioDocumentDraft(
      `# Episode ${episode.episodeNumber}: ${episode.title}\n\nINT. SKYPORT RELAY - DAWN\n\nA placeholder script draft showing scene headings, dialogue, and action blocks.`,
    );

  return (
    <section className="grid gap-4 2xl:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Script</CardTitle>
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)]">
              {episode.version}
            </span>
            <span
              className="rounded-full border px-3 py-1 text-xs"
              aria-label={unsavedChanges ? "Unsaved changes" : "Saved"}
            >
              {draftState.saveStatus === "saving"
                ? "Saving..."
                : unsavedChanges
                  ? "Draft updated"
                  : "Saved"}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Placeholder script editor with scene headings, dialogue, action blocks, and notes.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Block title="Scene headings" text="INT./EXT. beat markers and slug line structure." />
            <Block
              title="Character dialogue"
              text="Dialogue passages and voice notes for each character."
            />
            <Block title="Action blocks" text="Action descriptions and visual rhythm cues." />
            <Block title="Notes" text="Editorial reminders and continuity callouts." />
          </div>
          <Textarea
            value={draftState.markdown}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              updateMarkdown(event.currentTarget.value);
            }}
            className="min-h-72"
            aria-label="Episode script draft"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setSaveStatus("saving")}>
              Mark saving
            </Button>
            <Button type="button" variant="primary" onClick={markSaved}>
              Save draft
            </Button>
          </div>
        </CardContent>
      </Card>
      <StudioCommentPanel sectionLabel="script review" />
    </section>
  );
}

function Block({ title, text }: { title: string; text: string }): React.JSX.Element {
  return (
    <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]">
      <p className="font-medium text-[var(--color-text-primary)]">{title}</p>
      <p>{text}</p>
    </div>
  );
}
