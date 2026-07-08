import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage, cn } from "@nabhaverse/ui";

interface CharacterAvatarProps {
  name: string;
  avatarUrl?: string | undefined;
  size?: "sm" | "md" | "lg";
}

const sizeClassMap: Record<NonNullable<CharacterAvatarProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function CharacterAvatar({
  name,
  avatarUrl,
  size = "md",
}: CharacterAvatarProps): React.JSX.Element {
  const initials = name
    .split(" ")
    .map((segment) => segment[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className={cn(sizeClassMap[size], "border border-[var(--color-border)]")}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
