"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { setAuthenticated, setUserName } from "@/lib/auth";
import { useTranslation } from "@/components/TranslationProvider";

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const [message] = useState(() => t("auth.redirecting"));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const searchError = params.get("error");

    const hashParams = window.location.hash
      ? new URLSearchParams(window.location.hash.replace(/^#/, ""))
      : null;
    const hashError = hashParams?.get("error") ?? null;
    const accessToken = hashParams?.get("access_token") ?? null;

    const finish = (href: string) => {
      window.location.replace(href);
    };

    if (searchError || hashError || !supabase) {
      finish("/");
      return;
    }

    const completeSession = (name: string) => {
      setAuthenticated(true);
      setUserName(name);
      finish("/dashboard");
    };

    /* Implicit flow: tokens delivered in the URL hash fragment. */
    if (accessToken) {
      const refreshToken = hashParams!.get("refresh_token") ?? "";
      const expiresAt = hashParams!.get("expires_at");
      window.history.replaceState(null, "", window.location.pathname);
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
          ...(expiresAt && !Number.isNaN(Number(expiresAt))
            ? { expires_at: Number(expiresAt) }
            : {}),
        })
        .then(({ data, error }) => {
          if (error || !data.session) {
            finish("/");
            return;
          }
          const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
          const name =
            (typeof meta.full_name === "string" && meta.full_name) ||
            (typeof meta.name === "string" && meta.name) ||
            data.user.email ||
            "";
          completeSession(name);
        })
        .catch(() => finish("/"));
      return;
    }

    /* PKCE flow: single-use authorization code in the query string. */
    if (!code) {
      finish("/");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ data, error }) => {
        if (error || !data.session) {
          finish("/");
          return;
        }
        const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
        const name =
          (typeof meta.full_name === "string" && meta.full_name) ||
          (typeof meta.name === "string" && meta.name) ||
          data.user.email ||
          "";
        completeSession(name);
      })
      .catch(() => finish("/"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/60 px-4">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--cardeal-primary)] border-t-transparent" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}