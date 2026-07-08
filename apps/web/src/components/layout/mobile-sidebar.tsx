"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTitle } from "@nabhaverse/ui";

import { SidebarNav } from "@/components/navigation/sidebar-nav";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation menu"
        onClick={() => {
          onOpenChange(true);
        }}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>
      <DialogContent className="left-0 top-0 h-full max-w-[320px] translate-x-0 translate-y-0 rounded-none border-r border-[var(--color-border)] p-0">
        <DialogTitle className="border-b border-[var(--color-border)] px-4 py-4">
          Navigation
        </DialogTitle>
        <div className="p-2">
          <SidebarNav
            collapsed={false}
            onNavigate={() => {
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
