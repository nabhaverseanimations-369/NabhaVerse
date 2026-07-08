export interface StudioNavigationEntry<TId extends string = string> {
  id: TId;
  title: string;
}

export interface StudioNavigationContract<TId extends string = string> {
  entityId: string;
  activePluginId: TId;
  plugins: readonly StudioNavigationEntry<TId>[];
  collapsed?: boolean;
  label: string;
}
