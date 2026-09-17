import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        response = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const redirect = (path: string) => {
    const redirectResponse = NextResponse.redirect(new URL(path, req.url));
    response.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  };

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) return redirect("/");
    const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];
    const email = user.email?.toLowerCase() || "";
    const isAdminEmail = ADMIN_EMAILS.includes(email);

    if (!isAdminEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return redirect("/dashboard");
      }
    }
  }

  // Protect /partner routes
  if (pathname.startsWith("/partner")) {
    if (!user) return redirect("/");
    const email = user.email?.toLowerCase() || "";
    const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];
    const isAdminEmail = ADMIN_EMAILS.includes(email);

    if (!isAdminEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("email", email)
        .maybeSingle();

      if (profile?.role !== "partner" || profile?.status !== "approved") {
        return redirect("/dashboard");
      }
    }
  }

  // Protect /business routes (approved partners only)
  if (pathname.startsWith("/business")) {
    if (!user) return redirect("/");
    const email = user.email?.toLowerCase() || "";
    const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];
    const isAdminEmail = ADMIN_EMAILS.includes(email);

    if (!isAdminEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("email", email)
        .maybeSingle();

      if (profile?.role !== "partner" || profile?.status !== "approved") {
        return redirect("/dashboard");
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/business/:path*"],
};
