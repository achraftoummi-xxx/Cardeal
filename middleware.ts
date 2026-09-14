import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // If Supabase is not configured, pass through
  if (!supabase) {
    return NextResponse.next();
  }

  // Check auth session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];
    const email = session.user.email?.toLowerCase() || "";
    const isAdminEmail = ADMIN_EMAILS.includes(email);

    if (!isAdminEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  // Protect /partner routes
  if (pathname.startsWith("/partner")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const email = session.user.email?.toLowerCase() || "";
    const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];
    const isAdminEmail = ADMIN_EMAILS.includes(email);

    if (!isAdminEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("email", email)
        .maybeSingle();

      if (profile?.role !== "partner" || profile?.status !== "approved") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*"],
};
