export interface StudioWorkspaceContract {
  id: string;
  slug: string;
  name: string;
  studio: string;
  updatedAt: string;
}

export interface StudioWorkspaceUiSettings {
  sidebarCollapsed: boolean;
  compactMode: boolean;
}

export interface StudioWorkspaceScope {
  workspaceId: string;
  activePluginId: string;
}
