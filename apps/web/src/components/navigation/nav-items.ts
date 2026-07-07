import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Globe,
  Film,
  FolderOpen,
  Clapperboard,
  Wand2,
  Rocket,
  BarChart3,
  Settings,
} from "lucide-react";

export interface NavItem {
  /** Visible navigation label. */
  label: string;
  /** Route the item links to. */
  href: string;
  /** Icon rendered alongside the label. */
  icon: LucideIcon;
}

/**
 * Primary application navigation, rendered in the collapsible sidebar.
 * Order matches the module priority defined in the Sprint 3 design system.
 */
export const navItems: readonly NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Characters", href: "/characters", icon: Users },
  { label: "Worlds", href: "/worlds", icon: Globe },
  { label: "Episodes", href: "/episodes", icon: Film },
  { label: "Assets", href: "/assets", icon: FolderOpen },
  { label: "Production", href: "/production", icon: Clapperboard },
  { label: "AI Studio", href: "/ai-studio", icon: Wand2 },
  { label: "Publishing", href: "/publishing", icon: Rocket },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];
