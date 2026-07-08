import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { clerkRoutes, hasClerkPublishableKey } from "@/lib/clerkConfig";

export default function LoginPage(): React.JSX.Element {
  if (!hasClerkPublishableKey) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Sign in unavailable
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable Clerk authentication.
        </p>
        <Link
          className="text-sm text-[var(--color-primary)] underline-offset-4 hover:underline"
          href="/"
        >
          Back to home
        </Link>
      </section>
    );
  }

  return (
    <SignIn
      path={clerkRoutes.signIn}
      signUpUrl={clerkRoutes.signUp}
      forceRedirectUrl={clerkRoutes.afterSignIn}
    />
  );
}
