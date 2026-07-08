export interface StudioCommentContract {
  id: string;
  workspaceId: string;
  pluginId: string;
  author: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioCommentThreadContract {
  id: string;
  workspaceId: string;
  pluginId: string;
  title: string;
  resolved: boolean;
  comments: StudioCommentContract[];
}
