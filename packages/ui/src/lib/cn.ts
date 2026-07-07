import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, resolving conflicting Tailwind CSS utility classes
 * in favour of the class that appears last.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
