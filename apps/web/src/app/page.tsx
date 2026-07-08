import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { clerkRoutes, hasClerkPublishableKey } from "@/lib/clerkConfig";

export default function Home(): React.JSX.Element {
  if (!hasClerkPublishableKey) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <section className="max-w-lg space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
            NabhaVerse Studio
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable authentication controls.
          </p>
          <Link
            className="text-sm text-[var(--color-primary)] underline-offset-4 hover:underline"
            href="/dashboard"
          >
            Continue to dashboard shell
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-lg space-y-6 text-center">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
          NabhaVerse Studio
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Create your account to start building your animated universe.
        </p>

        <div className="flex items-center justify-center gap-3">
          <SignedOut>
            <SignInButton>
              <button className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-black">
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl={clerkRoutes.afterSignOut} />
            <Link
              className="text-sm text-[var(--color-primary)] underline-offset-4 hover:underline"
              href={clerkRoutes.afterSignIn}
            >
              Go to dashboard
            </Link>
          </SignedIn>
        </div>
      </section>
    </main>
  );
}
