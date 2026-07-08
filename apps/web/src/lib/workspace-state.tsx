"use client";

import * as React from "react";

import type { ThemePreference } from "@nabhaverse/ui";

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface WorkspaceStudio {
  id: string;
  name: string;
  slug: string;
  plan: "Starter" | "Pro" | "Enterprise";
}

export interface WorkspaceNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  severity: "info" | "success" | "warning";
}

export interface WorkspaceRecentItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  updatedAt: string;
}

export interface WorkspaceSettings {
  compactMode: boolean;
  reduceMotion: boolean;
  showSystemStatus: boolean;
}

export interface WorkspaceNavigationState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
}

export interface WorkspaceState {
  currentUser: WorkspaceUser;
  currentStudio: WorkspaceStudio;
  themePreference: ThemePreference;
  notifications: WorkspaceNotification[];
  navigation: WorkspaceNavigationState;
  recentItems: {
    projects: WorkspaceRecentItem[];
    characters: WorkspaceRecentItem[];
    episodes: WorkspaceRecentItem[];
    assets: WorkspaceRecentItem[];
  };
  workspaceSettings: WorkspaceSettings;
}

const initialState: WorkspaceState = {
  currentUser: {
    id: "usr_001",
    name: "Aarya Patel",
    email: "aarya@nabhaverse.studio",
    role: "Creative Director",
  },
  currentStudio: {
    id: "std_001",
    name: "NabhaVerse Prime",
    slug: "nabhaverse-prime",
    plan: "Pro",
  },
  themePreference: "system",
  notifications: [
    {
      id: "ntf_001",
      title: "Render queue stabilized",
      message: "All queued previews from this morning are now complete.",
      createdAt: "5m ago",
      read: false,
      severity: "success",
    },
    {
      id: "ntf_002",
      title: "Storyboard review due",
      message: "Episode 12 storyboard review is scheduled for today at 5:30 PM.",
      createdAt: "23m ago",
      read: false,
      severity: "warning",
    },
    {
      id: "ntf_003",
      title: "Team activity spike",
      message: "Creative uploads increased 18% week over week.",
      createdAt: "1h ago",
      read: true,
      severity: "info",
    },
  ],
  navigation: {
    sidebarCollapsed: false,
    mobileNavOpen: false,
  },
  recentItems: {
    projects: [
      {
        id: "prj_001",
        title: "Skybound Chronicles",
        subtitle: "Season 1 launch prep",
        href: "/production/episodes",
        updatedAt: "9m ago",
      },
      {
        id: "prj_002",
        title: "Lunar Caravan",
        subtitle: "World bible revision",
        href: "/creative/worlds",
        updatedAt: "34m ago",
      },
    ],
    characters: [
      {
        id: "chr_001",
        title: "Captain Ivara",
        subtitle: "Hero profile updated",
        href: "/creative/characters",
        updatedAt: "12m ago",
      },
      {
        id: "chr_002",
        title: "Nox-7",
        subtitle: "Expression set pending",
        href: "/creative/characters",
        updatedAt: "46m ago",
      },
    ],
    episodes: [
      {
        id: "eps_001",
        title: "Episode 12: Rift Wake",
        subtitle: "Scene planning active",
        href: "/production/episodes",
        updatedAt: "14m ago",
      },
      {
        id: "eps_002",
        title: "Episode 13: Ember Tide",
        subtitle: "Storyboard review",
        href: "/production/storyboards",
        updatedAt: "1h ago",
      },
    ],
    assets: [
      {
        id: "ast_001",
        title: "Skyport Matte v3",
        subtitle: "Background concept",
        href: "/creative/assets",
        updatedAt: "7m ago",
      },
      {
        id: "ast_002",
        title: "Drone Rig Pack",
        subtitle: "Animation approved",
        href: "/creative/assets",
        updatedAt: "51m ago",
      },
    ],
  },
  workspaceSettings: {
    compactMode: false,
    reduceMotion: false,
    showSystemStatus: true,
  },
};

type WorkspaceAction =
  | { type: "set-theme"; theme: ThemePreference }
  | { type: "set-sidebar-collapsed"; collapsed: boolean }
  | { type: "set-mobile-nav-open"; open: boolean }
  | { type: "toggle-mobile-nav" }
  | { type: "mark-notification-read"; id: string }
  | { type: "mark-all-notifications-read" }
  | { type: "set-current-studio"; studio: WorkspaceStudio }
  | { type: "update-settings"; settings: Partial<WorkspaceSettings> };

function reducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "set-theme":
      return { ...state, themePreference: action.theme };
    case "set-sidebar-collapsed":
      return {
        ...state,
        navigation: { ...state.navigation, sidebarCollapsed: action.collapsed },
      };
    case "set-mobile-nav-open":
      return {
        ...state,
        navigation: { ...state.navigation, mobileNavOpen: action.open },
      };
    case "toggle-mobile-nav":
      return {
        ...state,
        navigation: {
          ...state.navigation,
          mobileNavOpen: !state.navigation.mobileNavOpen,
        },
      };
    case "mark-notification-read":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.id ? { ...notification, read: true } : notification,
        ),
      };
    case "mark-all-notifications-read":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      };
    case "set-current-studio":
      return { ...state, currentStudio: action.studio };
    case "update-settings":
      return {
        ...state,
        workspaceSettings: { ...state.workspaceSettings, ...action.settings },
      };
    default:
      return state;
  }
}

interface WorkspaceStateContextValue {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
}

const WorkspaceStateContext = React.createContext<WorkspaceStateContextValue | null>(null);

export function WorkspaceStateProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(() => ({ state, dispatch }), [state]);
  return <WorkspaceStateContext.Provider value={value}>{children}</WorkspaceStateContext.Provider>;
}

export function useWorkspaceState(): WorkspaceStateContextValue {
  const context = React.useContext(WorkspaceStateContext);
  if (!context) {
    throw new Error("useWorkspaceState must be used within WorkspaceStateProvider");
  }
  return context;
}
