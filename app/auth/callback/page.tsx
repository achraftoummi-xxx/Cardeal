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
    const error = params.get("error");

    const finish = (href: string) => {
      window.location.replace(href);
    };

    if (error || !code || !supabase) {
      finish("/");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ data, error: exchangeError }) => {
        if (exchangeError || !data.session) {
          finish("/");
          return;
        }
        setAuthenticated(true);
        const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
        const name =
          (typeof meta.full_name === "string" && meta.full_name) ||
          (typeof meta.name === "string" && meta.name) ||
          data.user.email ||
          "";
        setUserName(name);
        finish("/dashboard");
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