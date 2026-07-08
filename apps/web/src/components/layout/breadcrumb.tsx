"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@nabhaverse/ui";

import { findWorkspaceGroup, findWorkspaceNavItem } from "@/components/navigation/nav-items";

interface BreadcrumbSegment {
  label: string;
  href: string;
}

function toLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildSegments(pathname: string): BreadcrumbSegment[] {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, index) => ({
    label: toLabel(part),
    href: `/${parts.slice(0, index + 1).join("/")}`,
  }));
}

export type BreadcrumbProps = React.HTMLAttributes<HTMLElement>;

/** Route-aware breadcrumb trail derived from the current pathname. */
export function Breadcrumb({ className, ...props }: BreadcrumbProps): React.JSX.Element {
  const pathname = usePathname() ?? "/";
  const activeGroup = findWorkspaceGroup(pathname);
  const activeItem = findWorkspaceNavItem(pathname);
  const segments =
    activeGroup && activeItem
      ? [
          { label: activeGroup.label, href: activeGroup.items[0]?.href ?? "/dashboard" },
          { label: activeItem.label, href: activeItem.href },
        ]
      : buildSegments(pathname);

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)} {...props}>
      <ol className="flex items-center gap-1.5">
        <li className="flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={segment.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              {isLast ? (
                <span aria-current="page" className="font-medium text-[var(--color-text-primary)]">
                  {segment.label}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  {segment.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
