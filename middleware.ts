import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = ["mokhtari.achref06@gmail.com", "toumiachref21@gmail.com"];

/**
 * Centralised RBAC middleware — single source of truth for route protection.
 *
 * Tier model (most restrictive first):
 *   1. Admin     /admin/*      – must be logged in + email in ADMIN_EMAILS
 *   2. Partner   /business/*   – must be logged in + profile role=partner, status=approved
 *   3. Auth      /dashboard/*  – must be logged in (any user)
 *   4. Public    everything else – no gate
 *
 * When a gate fails the user is redirected to /auth?redirect=<original-path>
 * so the login flow can bounce them back afterwards.
 */
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, let everything through (dev / mock mode).
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        } catch {
          // setAll may be called from a Server Component where cookies are
          // read-only.  The middleware will still work because the refreshed
          // tokens are stored in the Supabase client's in-memory cache.
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /** Redirect to /auth with ?redirect= so we can bounce back after auth. */
  const redirectToLogin = () => {
    const authUrl = new URL("/auth", req.url);
    authUrl.searchParams.set("redirect", pathname);
    const redirectResponse = NextResponse.redirect(authUrl);
    response.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  };

  /** Redirect to a hard path (e.g. /dashboard when access is denied but user is authed). */
  const redirect = (path: string) => {
    const redirectResponse = NextResponse.redirect(new URL(path, req.url));
    response.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  };

  const email = (user?.email ?? "").toLowerCase();
  const isAdminEmail = ADMIN_EMAILS.includes(email);

  /** Tier 1 — Admin: /admin/* ─────────────────────────────────────────── */
  if (pathname.startsWith("/admin")) {
    if (!user) return redirectToLogin();

    if (!isAdminEmail) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .ilike("email", email)
          .maybeSingle();

        if (profile?.role !== "admin") {
          return redirect("/dashboard");
        }
      } catch {
        // Profile query failed — deny by default.
        return redirect("/dashboard");
      }
    }
  }

  /** Tier 2 — Partner-verified: /business/* ───────────────────────────── */
  if (pathname.startsWith("/business")) {
    if (!user) return redirectToLogin();

    if (!isAdminEmail) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, status")
          .ilike("email", email)
          .maybeSingle();

        if (profile?.role !== "partner" || profile?.status !== "approved") {
          return redirect("/dashboard");
        }
      } catch {
        // Profile query failed — deny by default.
        return redirect("/dashboard");
      }
    }
  }

  /** Tier 2 — Partner-verified: /partner/* ────────────────────────────── */
  if (pathname.startsWith("/partner")) {
    if (!user) return redirectToLogin();

    if (!isAdminEmail) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, status")
          .ilike("email", email)
          .maybeSingle();

        if (profile?.role !== "partner" || profile?.status !== "approved") {
          return redirect("/dashboard");
        }
      } catch {
        // Profile query failed — deny by default.
        return redirect("/dashboard");
      }
    }
  }

  /** Tier 3 — Auth-required: /dashboard/* ──────────────────────────────── */
  if (pathname.startsWith("/dashboard")) {
    if (!user) return redirectToLogin();
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Only run the middleware on protected routes.
     * Public routes (/, /auth, /auth/callback, /bons-plans, etc.) are
     * intentionally excluded so the OAuth callback can exchange the
     * authorization code without being intercepted.
     */
    "/dashboard/:path*",
    "/admin/:path*",
    "/partner/:path*",
    "/business/:path*",
  ],
};
