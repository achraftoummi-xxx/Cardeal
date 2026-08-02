"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, CheckCircle2, AlertCircle, Loader2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "./TranslationProvider";
import { supabase } from "@/lib/supabase";
import type { Partner } from "@/lib/partners";

type Props = {
  partner: Partner | null;
  onClose: () => void;
};

const inputClasses =
  "w-full max-sm:min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

const labelClasses =
  "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) =>
  `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`
);

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  date: "",
  time: "",
  notes: "",
};

export default function AppointmentModal({ partner, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const open = partner !== null;

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setStatus("idle");
      nameRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || !partner) return null;

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const { error } = await supabase.from("appointments").insert({
        partner_id: partner.id,
        partner_name: partner.name,
        full_name: form.fullName.trim(),
        phone: form.phone.replace(/\D/g, ""),
        appointment_date: form.date,
        appointment_time: form.time,
        notes: form.notes.trim() || null,
      });
      if (error) throw error;
      setStatus("success");
    } catch (err) {
      console.error("Appointment insert error:", err);
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t("appointment.title")}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-4 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="min-w-0">
            <h2 className="text-base font-bold sm:text-lg">{t("appointment.title")}</h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {t("appointment.subtitle", { partner: partner.name })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("appointment.close")}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground max-sm:p-2.5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {status === "success" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 size={44} className="mb-3 text-green-500" />
              <h3 className="text-base font-bold">{t("appointment.successTitle")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("appointment.successMessage", { partner: partner.name })}
              </p>
            </div>
          ) : (
            <form id="appointment-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="appointment-name" className={labelClasses}>
                  {t("appointment.fullName")}
                </label>
                <input
                  ref={nameRef}
                  id="appointment-name"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={update("fullName")}
                  className={inputClasses}
                  autoComplete="name"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="appointment-phone" className={labelClasses}>
                  {t("appointment.phone")}
                </label>
                <input
                  id="appointment-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={update("phone")}
                  className={inputClasses}
                  placeholder={t("appointment.phonePlaceholder")}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="appointment-date" className={labelClasses}>
                  {t("appointment.date")}
                </label>
                <input
                  id="appointment-date"
                  type="date"
                  required
                  min={today}
                  value={form.date}
                  onChange={update("date")}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="appointment-time" className={labelClasses}>
                  {t("appointment.time")}
                </label>
                <select
                  id="appointment-time"
                  required
                  value={form.time}
                  onChange={update("time")}
                  className={cn(inputClasses, !form.time && "text-muted-foreground/50")}
                >
                  <option value="" disabled>
                    {t("appointment.selectTime")}
                  </option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time} className="text-foreground">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="appointment-notes" className={labelClasses}>
                  {t("appointment.notes")}
                </label>
                <textarea
                  id="appointment-notes"
                  rows={3}
                  value={form.notes}
                  onChange={update("notes")}
                  className={cn(inputClasses, "min-h-24 resize-y")}
                  placeholder={t("appointment.notesPlaceholder")}
                />
              </div>
              {status === "error" && (
                <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>
                    {supabase
                      ? t("appointment.errorMessage")
                      : t("appointment.notConfigured")}
                  </span>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-card/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          {status === "success" ? (
            <Button onClick={onClose} className="w-full">
              {t("appointment.done")}
            </Button>
          ) : (
            <Button type="submit" form="appointment-form" className="w-full" disabled={status === "submitting"}>
              {status === "submitting" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {t("appointment.sending")}
                </>
              ) : (
                <>
                  <CalendarDays size={15} />
                  {t("appointment.submit")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
