"use client";

import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";
import { supabase } from "@/lib/supabase";
import cardealLogo from "@/assets/images/cardeal_logo.png";
import {
  setAuthenticated,
  setUserName,
  readPendingRequest,
  clearPendingRequest,
  type PendingRequest,
} from "@/lib/auth";

const inputClasses =
  "w-full max-sm:min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

const labelClasses =
  "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

type Status = "idle" | "submitting" | "confirmed" | "done";

const EMPTY = { fullName: "", email: "", phone: "", password: "" };

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        required
        minLength={6}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputClasses} pe-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
        aria-pressed={visible}
        className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default function SignupPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [pending, setPending] = useState<PendingRequest | null>(null);

  const update =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    /* Mock sign-up: mark the user as authenticated in this session. */
    setAuthenticated(true);
    setUserName(form.fullName);

    /* Replay any request stored before redirecting here. */
    const stored = readPendingRequest();
    if (stored) {
      clearPendingRequest();
      try {
        if (stored.type === "appointment") {
          await supabase?.from("appointments").insert({
            partner_id: stored.partnerId,
            partner_name: stored.partnerName,
            full_name: stored.fullName,
            phone: stored.phone,
            appointment_date: stored.date,
            appointment_time: stored.time,
            notes: stored.notes ?? null,
          });
        } else {
          await supabase?.from("quotations").insert({
            partner_id: stored.partnerId,
            partner_name: stored.partnerName,
            full_name: stored.fullName,
            phone: stored.phone,
            notes: stored.notes ?? null,
          });
        }
      } catch (err) {
        console.error("Pending request insert error:", err);
      }
      setPending(stored);
      setStatus("confirmed");
      return;
    }

    setStatus("done");
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/60 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        {status === "confirmed" || status === "done" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 size={48} className="mb-3 text-green-500" />
            <h1 className="text-xl font-bold text-foreground">
              {status === "confirmed" ? t("signup.pendingTitle") : t("signup.successTitle")}
            </h1>
            {status === "confirmed" && pending ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {t("signup.pendingMessage", {
                  type: t(
                    pending.type === "appointment"
                      ? "signup.pendingAppointment"
                      : "signup.pendingQuote"
                  ),
                  partner: pending.partnerName,
                })}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{t("signup.successMessage")}</p>
            )}
            <Button onClick={goHome} className="mt-6 w-full">
              {t("appointment.done")}
            </Button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={goHome}
              aria-label={t("auth.closeAria")}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X size={18} />
            </button>

            <div className="mb-6 text-center">
              <img
                src={cardealLogo.src}
                alt={t("site.name")}
                draggable={false}
                className="mx-auto h-12 w-auto dark:brightness-150"
              />
              <h1 className="mt-2 text-lg font-bold text-foreground">{t("signup.title")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("signup.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="signup-page-name" className={labelClasses}>
                  {t("auth.fullName")}
                </label>
                <input
                  id="signup-page-name"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={update("fullName")}
                  className={inputClasses}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="signup-page-email" className={labelClasses}>
                  {t("auth.email")}
                </label>
                <input
                  id="signup-page-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  className={inputClasses}
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="signup-page-phone" className={labelClasses}>
                  {t("auth.phoneNumber")}
                </label>
                <input
                  id="signup-page-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={update("phone")}
                  className={inputClasses}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="signup-page-password" className={labelClasses}>
                  {t("auth.password")}
                </label>
                <PasswordInput
                  id="signup-page-password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="mt-2 w-full" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : null}
                {t("auth.signupButton")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
