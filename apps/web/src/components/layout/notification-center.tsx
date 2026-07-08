"use client";

import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Badge, Button } from "@nabhaverse/ui";

import { DropdownMenu } from "@/components/common/dropdown-menu";
import { useWorkspaceState } from "@/lib/workspace-state";

export function NotificationCenter(): React.JSX.Element {
  const { state, dispatch } = useWorkspaceState();

  const unread = state.notifications.filter((notification) => !notification.read).length;

  const items = state.notifications.map((notification) => ({
    id: notification.id,
    label: notification.title,
    description: `${notification.message} · ${notification.createdAt}`,
    onSelect: () => {
      dispatch({ type: "mark-notification-read", id: notification.id });
    },
  }));

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu
        label="Notification center"
        items={items}
        trigger={
          <div className="relative">
            <Button type="button" variant="ghost" size="icon" aria-label="Open notifications">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </Button>
            {unread > 0 ? (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]"
              >
                {unread}
              </Badge>
            ) : null}
          </div>
        }
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Mark all notifications read"
        onClick={() => {
          dispatch({ type: "mark-all-notifications-read" });
        }}
      >
        <CheckCheck className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
