import { vi } from "vitest";

export const navigationMockState = {
  pathname: "/dashboard",
  push: vi.fn(),
};

export function setMockPathname(pathname: string): void {
  navigationMockState.pathname = pathname;
}

export function resetMockNavigation(): void {
  navigationMockState.pathname = "/dashboard";
  navigationMockState.push.mockReset();
}
