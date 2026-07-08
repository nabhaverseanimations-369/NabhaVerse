import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  Clapperboard,
  CreditCard,
  Film,
  FolderKanban,
  Frame,
  GalleryVerticalEnd,
  Gauge,
  Globe,
  MessageSquareMore,
  Mic,
  MapPinned,
  Megaphone,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

export interface WorkspaceNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface WorkspaceNavGroup {
  id: string;
  label: string;
  items: readonly WorkspaceNavItem[];
}

export const workspaceNavGroups: readonly WorkspaceNavGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      {
        id: "dashboard-home",
        label: "Dashboard",
        href: "/dashboard",
        icon: Gauge,
        description: "Studio overview and activity",
      },
    ],
  },
  {
    id: "creative",
    label: "Creative",
    items: [
      {
        id: "characters",
        label: "Characters",
        href: "/creative/characters",
        icon: Users,
        description: "Character module entry point",
      },
      {
        id: "worlds",
        label: "Worlds",
        href: "/creative/worlds",
        icon: Globe,
        description: "World-building workspace entry point",
      },
      {
        id: "locations",
        label: "Locations",
        href: "/creative/locations",
        icon: MapPinned,
        description: "Location planning workspace entry point",
      },
      {
        id: "assets",
        label: "Assets",
        href: "/creative/assets",
        icon: GalleryVerticalEnd,
        description: "Asset library module entry point",
      },
    ],
  },
  {
    id: "production",
    label: "Production",
    items: [
      {
        id: "episodes",
        label: "Episodes",
        href: "/production/episodes",
        icon: Film,
        description: "Episode workspace entry point",
      },
      {
        id: "scenes",
        label: "Scenes",
        href: "/production/scenes",
        icon: Clapperboard,
        description: "Scene planning workspace entry point",
      },
      {
        id: "storyboards",
        label: "Storyboards",
        href: "/production/storyboards",
        icon: Frame,
        description: "Storyboard workspace entry point",
      },
      {
        id: "production-pipeline",
        label: "Production Pipeline",
        href: "/production/pipeline",
        icon: FolderKanban,
        description: "Pipeline status and operations",
      },
      {
        id: "production-studio",
        label: "Production Studio",
        href: "/production/studio",
        icon: FolderKanban,
        description: "Production planning and delivery workspace",
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    items: [
      {
        id: "prompt-library",
        label: "Prompt Library",
        href: "/ai/prompt-library",
        icon: Sparkles,
        description: "Prompt collection workspace",
      },
      {
        id: "voice-profiles",
        label: "Voice Profiles",
        href: "/ai/voice-profiles",
        icon: Mic,
        description: "Voice profile workspace",
      },
      {
        id: "ai-studio",
        label: "AI Studio",
        href: "/ai/studio",
        icon: Bot,
        description: "AI studio control surface",
      },
    ],
  },
  {
    id: "publishing",
    label: "Publishing",
    items: [
      {
        id: "publish",
        label: "Publish",
        href: "/publishing/publish",
        icon: Megaphone,
        description: "Publishing workflow entry point",
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "/publishing/analytics",
        icon: ChartNoAxesCombined,
        description: "Audience and release analytics",
      },
      {
        id: "publishing-studio",
        label: "Publishing Studio",
        href: "/publishing/studio",
        icon: Megaphone,
        description: "Publishing orchestration workspace",
      },
    ],
  },
  {
    id: "collaboration",
    label: "Collaboration",
    items: [
      {
        id: "collaboration-studio",
        label: "Collaboration Studio",
        href: "/collaboration/studio",
        icon: MessageSquareMore,
        description: "Shared comments, reviews, assignments, and activity workspace",
      },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    items: [
      {
        id: "studio-intelligence",
        label: "Studio Intelligence",
        href: "/intelligence/studio",
        icon: BrainCircuit,
        description: "Cross-studio intelligence, search, commands, and insights",
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/administration/settings",
        icon: Settings,
        description: "Studio settings",
      },
      {
        id: "team",
        label: "Team",
        href: "/administration/team",
        icon: Building2,
        description: "Team management workspace",
      },
      {
        id: "billing",
        label: "Billing",
        href: "/administration/billing",
        icon: CreditCard,
        description: "Billing and subscriptions",
      },
    ],
  },
];

export const workspaceNavItems: readonly WorkspaceNavItem[] = workspaceNavGroups.flatMap(
  (group) => group.items,
);

export function findWorkspaceNavItem(pathname: string): WorkspaceNavItem | undefined {
  return workspaceNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

export function findWorkspaceGroup(pathname: string): WorkspaceNavGroup | undefined {
  return workspaceNavGroups.find((group) =>
    group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
}
