import * as React from "react";
import { MessageSquareMore } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@nabhaverse/ui";

export function CommentPanel({ sectionLabel }: { sectionLabel: string }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          title="Comment thread placeholder"
          description={`Feedback threads for ${sectionLabel} will appear here once collaborative reviews are enabled.`}
          icon={<MessageSquareMore className="h-8 w-8" aria-hidden="true" />}
        />
      </CardContent>
    </Card>
  );
}
