import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// TODO(epic-2-cleanup): Track migration from middleware.ts to proxy.ts for newer Next.js conventions.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)", "/__clerk/:path*"],
};
