import * as React from "react";
import { Star } from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { AIPrompt } from "@/features/ai/types/ai.types";

export function PromptCard({
  prompt,
  onToggleFavorite,
  onSelect,
}: {
  prompt: AIPrompt;
  onToggleFavorite: (promptId: string) => void;
  onSelect?: (promptId: string) => void;
}): React.JSX.Element {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle>
            <button
              type="button"
              onClick={() => {
                onSelect?.(prompt.id);
              }}
              className="text-left hover:underline"
            >
              {prompt.name}
            </button>
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={prompt.favorite ? "Remove favorite prompt" : "Favorite prompt"}
            onClick={() => onToggleFavorite(prompt.id)}
          >
            <Star
              className="h-4 w-4"
              aria-hidden="true"
              fill={prompt.favorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{prompt.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{prompt.category}</Badge>
          <Badge variant="secondary">{prompt.version}</Badge>
          <Badge variant="secondary">Updated {prompt.updatedAt}</Badge>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{prompt.summary}</p>
        <div className="flex flex-wrap gap-1">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
