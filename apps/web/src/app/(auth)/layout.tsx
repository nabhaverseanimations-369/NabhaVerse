import * as React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
        {children}
      </div>
    </div>
  );
}
