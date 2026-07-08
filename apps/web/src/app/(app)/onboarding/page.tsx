"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nabhaverse/ui";

import { apiFetch } from "@/lib/api";

interface CreateStudioResponse {
  id: string;
  name: string;
  slug: string;
}

export default function OnboardingPage(): React.JSX.Element {
  const router = useRouter();
  const [studioName, setStudioName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSubmitting(true);

      try {
        await apiFetch<CreateStudioResponse>("/api/v1/studios", {
          method: "POST",
          headers: {
            "X-Clerk-User-Id": "onboarding-user",
            "X-Clerk-Email": "onboarding@nabhaverse.local",
          },
          body: JSON.stringify({ name: studioName }),
        });
        router.push("/dashboard");
      } catch (submitError) {
        const message =
          submitError instanceof Error ? submitError.message : "Unable to create studio";
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
    [router, studioName],
  );

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Welcome to NabhaVerse Studio</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Create your first studio workspace to start collaborating.
        </p>
      </header>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Studio name"
          placeholder="Dreamworks Lab"
          value={studioName}
          onChange={(event) => setStudioName(event.target.value)}
          required
        />

        {error ? <p className="text-sm text-[var(--color-destructive)]">{error}</p> : null}

        <Button
          type="submit"
          variant="primary"
          isLoading={submitting}
          disabled={!studioName.trim()}
        >
          Create studio
        </Button>
      </form>
    </section>
  );
}
