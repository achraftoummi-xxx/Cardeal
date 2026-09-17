import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Server-side OAuth callback route handler.
 *
 * Exchanges the PKCE authorization code for a session and sets the
 * auth cookies via HTTP Set-Cookie headers.  This is the canonical
 * Supabase pattern — the code exchange happens server-side so the
 * session cookies are propagated reliably to the middleware.
 *
 * The client-side AuthProvider handles the legacy implicit flow
 * (hash-fragment tokens) on any page load as a fallback.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const hasError = searchParams.get("error");

  // If Supabase returned an error from the OAuth provider
  if (hasError) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(hasError)}`, origin)
    );
  }

  // No code and no error — nothing to do
  if (!code) {
    return NextResponse.redirect(new URL("/auth", origin));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/auth", origin));
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Exchange failed — send user to auth page with error context
    return NextResponse.redirect(
      new URL("/auth?error=exchange_failed", origin)
    );
  }

  // Success — redirect to the intended destination, carrying the
  // session cookies that were set by exchangeCodeForSession via setAll.
  const redirectResponse = NextResponse.redirect(`${origin}${next}`);
  for (const cookie of supabaseResponse.cookies.getAll()) {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
  }
  return redirectResponse;
}
