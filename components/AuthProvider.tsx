"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { isAuthenticated, setAuthenticated, setUserName } from "@/lib/auth";
import { loadAvatarUrl, saveAvatarUrl } from "@/data/dashboard";

type AuthContextValue = {
  /** True when a valid session (real Supabase or local mock) exists. */
  authed: boolean;
  /** Display name of the signed-in user, "" when signed out. */
  userName: string;
  /** Exact email from the Supabase session (user.email), "" when unavailable. */
  email: string;
  /** Avatar URL (Supabase Storage public URL or local data URL), "" when unset. */
  avatarUrl: string;
  /** Persists a new avatar URL (local cache + Supabase user metadata). */
  setAvatarUrl: (url: string) => void;
  /** True until the initial session check has completed. */
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  authed: false,
  userName: "",
  email: "",
  avatarUrl: "",
  setAvatarUrl: () => {},
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

function nameFromUser(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): string {
  const meta = user.user_metadata ?? {};
  const fullName = typeof meta.full_name === "string" ? meta.full_name : "";
  const name = typeof meta.name === "string" ? meta.name : "";
  return fullName || name || user.email || "";
}

/**
 * App-wide auth provider.
 *
 * Real mode (Supabase configured):
 *  - Captures OAuth sessions delivered via the URL hash fragment
 *    (#access_token=...&refresh_token=...) right at startup with
 *    supabase.auth.setSession(), then cleans the URL.
 *  - Restores a persisted session with supabase.auth.getSession().
 *  - Reacts to onAuthStateChange (SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED)
 *    so the UI always mirrors the real session.
 *
 * Mock mode (no Supabase env vars): mirrors the local sessionStorage flag.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [userName, setUserNameState] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrlState] = useState("");
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((session: Session | null) => {
    if (session?.user) {
      const name = nameFromUser(session.user);
      const meta = session.user.user_metadata ?? {};
      const metaAvatar = typeof meta.avatar_url === "string" ? meta.avatar_url : "";
      setAuthenticated(true);
      setUserName(name);
      setUserNameState(name);
      setEmail(session.user.email ?? "");
      setAvatarUrlState(metaAvatar || loadAvatarUrl());
      setAuthed(true);
    } else {
      setAuthenticated(false);
      setUserNameState("");
      setEmail("");
      setAvatarUrlState("");
      setAuthed(false);
    }
  }, []);

  const setAvatarUrl = useCallback((url: string) => {
    setAvatarUrlState(url);
    saveAvatarUrl(url);
    if (isSupabaseConfigured && supabase) {
      void supabase.auth
        .updateUser({ data: { avatar_url: url || null } })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      /* Mock mode: no backend, mirror the sessionStorage flag. */
      setAuthed(isAuthenticated());
      setAvatarUrlState(loadAvatarUrl());
      setLoading(false);
      return;
    }

    let active = true;

    /**
     * OAuth providers can return the session in the URL hash fragment
     * (implicit flow, e.g. Supabase projects configured before PKCE).
     * Detect it, exchange it for a real session, and scrub the URL.
     */
    const captureHashSession = async (): Promise<boolean> => {
      const hash = window.location.hash;
      if (!hash || !hash.includes("access_token")) return false;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const hashError = params.get("error");
      const accessToken = params.get("access_token");
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      if (hashError || !accessToken) return false;
      const refreshToken = params.get("refresh_token") ?? "";
      const expiresAt = params.get("expires_at");
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        ...(expiresAt && !Number.isNaN(Number(expiresAt))
          ? { expires_at: Number(expiresAt) }
          : {}),
      });
      if (error || !data.session) return false;
      applySession(data.session);
      /* Route OAuth completions landing on the home page to the dashboard. */
      if (window.location.pathname === "/") {
        window.location.replace("/dashboard");
      }
      return true;
    };

    const init = async () => {
      const captured = await captureHashSession();
      if (!active) return;
      if (captured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      applySession(data.session);
      setLoading(false);
    };

    void init();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED"
      ) {
        applySession(session);
      } else if (event === "SIGNED_OUT") {
        applySession(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  return (
    <AuthContext.Provider value={{ authed, userName, email, avatarUrl, setAvatarUrl, loading }}>
      {children}
    </AuthContext.Provider>
  );
}