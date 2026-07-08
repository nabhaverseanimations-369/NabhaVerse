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

import { StudioCommentPanel } from "./comment-panel";

export interface StudioDocumentEditorProps {
  title: string;
  description: string;
  version: string;
  markdown: string;
  saveStatus: "idle" | "saving" | "saved";
  unsavedChanges: boolean;
  onChange: (markdown: string) => void;
  onSave: () => void;
  commentsLabel: string;
}

export function StudioDocumentEditor({
  title,
  description,
  version,
  markdown,
  saveStatus,
  unsavedChanges,
  onChange,
  onSave,
  commentsLabel,
}: StudioDocumentEditorProps): React.JSX.Element {
  return (
    <section className="grid gap-4 2xl:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{title}</CardTitle>
            <Badge variant="outline">{version}</Badge>
            <Badge variant={unsavedChanges || saveStatus === "saving" ? "warning" : "success"}>
              {saveStatus === "saving"
                ? "Saving..."
                : unsavedChanges
                  ? "Unsaved changes"
                  : "All changes saved"}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">Rich text placeholder</p>
            <p>Toolbar and rich formatting controls will be integrated in a later epic.</p>
          </div>

          <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">
              Markdown support placeholder
            </p>
            <p>Live markdown preview pane will be attached to this editor region.</p>
          </div>

          <Textarea
            value={markdown}
            onChange={(event) => {
              onChange(event.currentTarget.value);
            }}
            className="min-h-56"
            aria-label={`${title} content`}
          />

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              <FileImage className="h-4 w-4" aria-hidden="true" /> Image attachment placeholder
            </Button>
            <Button type="button" variant="outline">
              <FileText className="h-4 w-4" aria-hidden="true" /> Attachment placeholder
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onSave();
              }}
            >
              <Save className="h-4 w-4" aria-hidden="true" /> Save draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <StudioCommentPanel sectionLabel={commentsLabel} />
    </section>
  );
}
