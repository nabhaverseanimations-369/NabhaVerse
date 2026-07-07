"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { useTheme } from "./theme-provider";

export interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {}

/** Icon button that flips between the light and dark theme. */
export function ThemeToggle({ className, ...props }: ThemeToggleProps): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn("relative", className)}
      {...props}
    >
      <Sun
        className={cn(
          "h-5 w-5 transition-all",
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-5 w-5 transition-all",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
        )}
        aria-hidden="true"
      />
    </Button>
  );
}
