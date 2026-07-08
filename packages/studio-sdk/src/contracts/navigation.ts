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

export function resolveStudioRouteSegment<TId extends string>(
  pathname: string,
  segmentIndex: number,
  isValid: (value: string) => value is TId,
  fallback: TId,
): TId {
  const segments = pathname.split("/").filter(Boolean);
  const maybeSegment = segments[segmentIndex];
  if (!maybeSegment || !isValid(maybeSegment)) {
    return fallback;
  }
  return maybeSegment;
}
