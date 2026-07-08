import type { StudioSaveStatus } from "../types/common";

export interface StudioDocumentContract<TDocumentType extends string = string> {
  id: string;
  workspaceId: string;
  type: TDocumentType;
  title: string;
  markdown: string;
  versionLabel: string;
  saveStatus: StudioSaveStatus;
  hasUnsavedChanges: boolean;
  updatedAt: string;
}

export interface StudioDocumentEditorContract {
  title: string;
  description: string;
  version: string;
  markdown: string;
  saveStatus: StudioSaveStatus;
  unsavedChanges: boolean;
}
