import * as React from "react";
import { Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, cn } from "@nabhaverse/ui";

interface WorldAvatarProps {
  name: string;
  coverImageUrl?: string | undefined;
  size?: "sm" | "md" | "lg";
}

const sizeClassMap: Record<NonNullable<WorldAvatarProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function WorldAvatar({
  name,
  coverImageUrl,
  size = "md",
}: WorldAvatarProps): React.JSX.Element {
  return (
    <Avatar className={cn(sizeClassMap[size], "border border-[var(--color-border)]")}>
      <AvatarImage src={coverImageUrl} alt={name} />
      <AvatarFallback>
        <Globe className="h-4 w-4" aria-hidden="true" />
      </AvatarFallback>
    </Avatar>
  );
}
