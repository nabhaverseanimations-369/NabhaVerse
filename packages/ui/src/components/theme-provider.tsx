"use client";

import * as React from "react";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

export interface ThemeContextValue {
  /** The stored theme preference (light, dark, or system). */
  theme: ThemePreference;
  /** The effective resolved theme currently applied to the UI. */
  resolvedTheme: Theme;
  /** Explicitly set the theme. */
  setTheme: (theme: ThemePreference) => void;
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

function readStoredTheme(): ThemePreference | undefined {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : undefined;
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

function resolveTheme(theme: ThemePreference): Theme {
  if (theme === "system") {
    return readSystemTheme();
  }
  return theme;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Theme preference before hydration. Defaults to "system". */
  defaultTheme?: ThemePreference;
}

/**
 * Provides light/dark theme state to the component tree, persisting the
 * preference to `localStorage` and falling back to the OS preference.
 * Implemented without third-party dependencies so it can live in the
 * framework-agnostic `packages/ui` component library.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps): React.JSX.Element {
  const [theme, setThemeState] = React.useState<ThemePreference>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<Theme>(resolveTheme(defaultTheme));

  React.useEffect(() => {
    const initialPreference = readStoredTheme() ?? defaultTheme;
    const nextResolved = resolveTheme(initialPreference);

    setThemeState(initialPreference);
    setResolvedTheme(nextResolved);
    applyThemeClass(nextResolved);

    return;
  }, []);

  React.useEffect(() => {
    if (theme !== "system" || typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (): void => {
      const systemResolved = readSystemTheme();
      setResolvedTheme(systemResolved);
      applyThemeClass(systemResolved);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = React.useCallback((next: ThemePreference) => {
    const nextResolved = resolveTheme(next);
    setThemeState(next);
    setResolvedTheme(nextResolved);
    applyThemeClass(nextResolved);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write failures (e.g. private browsing mode).
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    const basis = theme === "system" ? resolvedTheme : theme;
    setTheme(basis === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme, theme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [resolvedTheme, setTheme, theme, toggleTheme],
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
