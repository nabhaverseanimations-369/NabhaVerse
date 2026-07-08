import Link from "next/link";

export default function ForgotPasswordPage(): React.JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Forgot password</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Password reset is handled by Clerk on the sign in flow.
      </p>
      <Link
        className="text-sm text-[var(--color-primary)] underline-offset-4 hover:underline"
        href="/login"
      >
        Go to login and select Forgot password
      </Link>
    </section>
  );
}
