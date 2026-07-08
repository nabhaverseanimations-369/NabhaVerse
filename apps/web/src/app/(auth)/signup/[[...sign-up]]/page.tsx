import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignupPage(): React.JSX.Element {
  if (!hasClerkKey) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Sign up unavailable
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

  return <SignUp path="/signup" signInUrl="/login" forceRedirectUrl="/onboarding" />;
}
