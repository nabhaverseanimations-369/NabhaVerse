export const clerkRoutes = {
  signIn: "/login",
  signUp: "/signup",
  afterSignIn: "/dashboard",
  afterSignUp: "/onboarding",
  afterSignOut: "/",
} as const;

export const hasClerkPublishableKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
