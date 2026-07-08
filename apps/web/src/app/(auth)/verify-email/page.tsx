import Link from "next/link";

export default function VerifyEmailPage(): React.JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Verify your email</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Check your inbox for a verification email from Clerk and complete verification before
        continuing.
      </p>
      <Link
        className="text-sm text-[var(--color-primary)] underline-offset-4 hover:underline"
        href="/login"
      >
        Back to login
      </Link>
    </section>
  );
}
