"use client";

import * as React from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { Button, cn } from "@nabhaverse/ui";

export type ToastSeverity = "info" | "success" | "warning";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  severity: ToastSeverity;
}

interface ToastContextValue {
  notify: (message: Omit<ToastMessage, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const iconBySeverity: Record<ToastSeverity, React.ReactNode> = {
  info: <Info className="h-4 w-4" aria-hidden="true" />,
  success: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
  warning: <TriangleAlert className="h-4 w-4" aria-hidden="true" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const notify = React.useCallback((message: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[var(--z-toast)] flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => (
          <article
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-card)]",
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-[var(--color-primary)]">
                {iconBySeverity[toast.severity]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                aria-label="Dismiss notification"
                onClick={() => {
                  setToasts((current) => current.filter((item) => item.id !== toast.id));
                }}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
