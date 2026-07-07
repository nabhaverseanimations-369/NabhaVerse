"use client";

import * as React from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  /** The currently active theme. */
  theme: Theme;
  /** Explicitly set the theme. */
  setTheme: (theme: Theme) => void;
  /** Flip between light and dark. */
  toggleTheme: () => void;
}

const STORAGE_KEY = "nabhaverse_theme";

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function applyThemeClass(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
}

function readStoredTheme(): Theme | undefined {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : undefined;
  } catch {
    return undefined;
  }
}

function readSystemTheme(): Theme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Theme used before the client has hydrated / read persisted preference. Defaults to "dark". */
  defaultTheme?: Theme;
}

/**
 * Provides light/dark theme state to the component tree, persisting the
 * preference to `localStorage` and falling back to the OS preference.
 * Implemented without third-party dependencies so it can live in the
 * framework-agnostic `packages/ui` component library.
 */
export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps): React.JSX.Element {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

  React.useEffect(() => {
    const initial = readStoredTheme() ?? readSystemTheme();
    setThemeState(initial);
    applyThemeClass(initial);
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    applyThemeClass(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write failures (e.g. private browsing mode).
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
