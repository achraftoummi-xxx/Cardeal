import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = ["mokhtari.achref06@gmail.com", "toumiachref21@gmail.com"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  // ── Retrieve the authenticated user ──────────────────────────────────
  // getUser() hits the GoTrue API; it refreshes the JWT if expired and
  // calls setAll() with the updated cookies.  It never throws — on
  // failure it returns { user: null }.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /** Build a redirect Response that carries the (possibly-refreshed) cookies. */
  const redirect = (path: string) => {
    const redirectResponse = NextResponse.redirect(new URL(path, req.url));
    response.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  };

  /** Check whether the user's email is in the admin allow-list. */
  const isAdminEmail = (email: string) => ADMIN_EMAILS.includes(email);

  // ── Protect /admin routes ────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!user) return redirect("/");
    const email = user.email?.toLowerCase() || "";

    if (!isAdminEmail(email)) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("email", email)
          .maybeSingle();

        if (profile?.role !== "admin") {
          return redirect("/dashboard");
        }
      } catch {
        // Profile query failed — let the request through and let the
        // client-side admin guard handle it.  This avoids false redirects
        // caused by transient DB errors or RLS misconfigurations.
      }
    }
  }

  // ── Protect /partner routes ──────────────────────────────────────────
  if (pathname.startsWith("/partner")) {
    if (!user) return redirect("/");
    const email = user.email?.toLowerCase() || "";

    if (!isAdminEmail(email)) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("email", email)
          .maybeSingle();

        if (profile?.role !== "partner" || profile?.status !== "approved") {
          return redirect("/dashboard");
        }
      } catch {
        // Let the client-side guard handle it.
      }
    }
  }

  // ── Protect /business routes (approved partners only) ────────────────
  if (pathname.startsWith("/business")) {
    if (!user) return redirect("/");
    const email = user.email?.toLowerCase() || "";

    if (!isAdminEmail(email)) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("email", email)
          .maybeSingle();

        if (profile?.role !== "partner" || profile?.status !== "approved") {
          return redirect("/dashboard");
        }
      } catch {
        // Let the client-side BusinessProvider guard handle it.
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/business/:path*"],
};
