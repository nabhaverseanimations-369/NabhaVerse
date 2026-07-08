export type StudioAttachmentKind = "image" | "document" | "reference" | "map";

export interface StudioAttachmentContract {
  id: string;
  workspaceId: string;
  pluginId: string;
  title: string;
  kind: StudioAttachmentKind;
  previewUrl: string;
  updatedAt: string;
}
