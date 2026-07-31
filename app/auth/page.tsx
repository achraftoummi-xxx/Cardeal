"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

export default function AuthPage() {
  const { t } = useTranslation();
  const handleAuth = () => {
    // Mock authentication
    alert(t("auth.successAlert"));
    window.location.href = '/results';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)]">
      <div className="bg-[var(--background)] p-12 rounded-3xl shadow-xl border border-[var(--border)] text-center max-w-lg">
        <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-6">{t("auth.oneStepAway")}</h1>
        <p className="text-lg text-[var(--muted-foreground)] mb-10">{t("auth.description")}</p>
        <div className="flex flex-col gap-4">
          <Button onClick={handleAuth} className="bg-[var(--primary)] text-[var(--primary-foreground)] text-lg py-6 rounded-full hover:bg-[var(--ring)]">{t("auth.createAccount")}</Button>
          <Button onClick={handleAuth} variant="outline" className="text-lg py-6 rounded-full border-[var(--border)] hover:border-[var(--ring)]">{t("auth.signInButton")}</Button>
        </div>
      </div>
    </div>
  );
}
