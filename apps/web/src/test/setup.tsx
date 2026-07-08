import * as React from "react";
import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

import { navigationMockState, resetMockNavigation } from "@/test/mock-utils";

afterEach(() => {
  cleanup();
  resetMockNavigation();
});

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: () => `uuid-${Math.random().toString(16).slice(2)}`,
    },
    writable: true,
  });
}

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }) => {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
        }}
        {...props}
      >
        {children}
      </a>
    );
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMockState.pathname,
  useRouter: () => ({
    push: navigationMockState.push,
  }),
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="dynamic-control" />,
}));

vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  RedirectToSignIn: () => <div>Redirecting to sign in</div>,
  UserButton: () => <button type="button">Account</button>,
}));
