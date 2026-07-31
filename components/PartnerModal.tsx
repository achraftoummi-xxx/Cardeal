"use client";

import { useEffect, useRef, useState } from "react";
import { X, User, Briefcase, Clock, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "./TranslationProvider";
import { localized } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "./WorkshopSearch";

type Props = {
  open: boolean;
  onClose: () => void;
};

const inputClasses =
  "w-full max-sm:min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

const labelClasses =
  "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

const sectionClasses =
  "mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-2";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) =>
  `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`
);

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  serviceCategory: "",
  specializedBrand: "",
  location: "",
  openDayFrom: "",
  openDayTo: "",
  openTimeFrom: "",
  openTimeTo: "",
  staffMembers: "",
  extraServices: "",
  priceLow: "",
  priceHigh: "",
};

export default function PartnerModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<{ pricing?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setErrors({});
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

  if (!open) return null;

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (field === "priceLow" || field === "priceHigh") {
        setErrors((prev) => ({ ...prev, pricing: undefined }));
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const low = Number(form.priceLow);
    const high = Number(form.priceHigh);
    if (form.priceLow !== "" && form.priceHigh !== "" && high < low) {
      setErrors({ pricing: t("partnerForm.priceError") });
      return;
    }
    window.location.href = "/results";
  };

  const days = DAYS.map((d) => ({ value: d, label: t(`partnerForm.${d}`) }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t("partnerForm.title")}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Sticky header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <h2 className="text-base font-bold sm:text-lg">{t("partnerForm.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("partnerForm.closeAria")}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground max-sm:p-2.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="partner-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-5 sm:px-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Personal Information */}
            <h3 className={sectionClasses}>
              <User size={16} />
              {t("partnerForm.personalSection")}
            </h3>
            <div>
              <label htmlFor="partner-name" className={labelClasses}>
                {t("auth.fullName")}
              </label>
              <input
                ref={nameRef}
                id="partner-name"
                type="text"
                required
                value={form.fullName}
                onChange={update("fullName")}
                className={inputClasses}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="partner-email" className={labelClasses}>
                {t("auth.email")}
              </label>
              <input
                id="partner-email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                className={inputClasses}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="partner-phone" className={labelClasses}>
                {t("auth.phoneNumber")}
              </label>
              <input
                id="partner-phone"
                type="tel"
                required
                value={form.phone}
                onChange={update("phone")}
                className={inputClasses}
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="partner-password" className={labelClasses}>
                {t("auth.password")}
              </label>
              <input
                id="partner-password"
                type="password"
                required
                value={form.password}
                onChange={update("password")}
                className={inputClasses}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {/* Business Information */}
            <h3 className={cn(sectionClasses, "mt-2")}>
              <Briefcase size={16} />
              {t("partnerForm.businessSection")}
            </h3>
            <div className="sm:col-span-2">
              <label htmlFor="partner-category" className={labelClasses}>
                {t("partnerForm.serviceCategory")}
              </label>
              <select
                id="partner-category"
                required
                value={form.serviceCategory}
                onChange={update("serviceCategory")}
                className={cn(inputClasses, !form.serviceCategory && "text-muted-foreground/50")}
              >
                <option value="" disabled>
                  {t("auth.pleaseSelect")}
                </option>
                {SERVICE_CATEGORIES.map((s) => (
                  <option key={s} value={s} className="text-foreground">
                    {localized(t, "serviceCat", s)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="partner-brand" className={labelClasses}>
                {t("partnerForm.specializedBrand")}
              </label>
              <input
                id="partner-brand"
                type="text"
                value={form.specializedBrand}
                onChange={update("specializedBrand")}
                className={inputClasses}
                placeholder={t("partnerForm.brandPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="partner-staff" className={labelClasses}>
                {t("partnerForm.staffMembers")}
              </label>
              <input
                id="partner-staff"
                type="number"
                min={1}
                max={1000}
                required
                value={form.staffMembers}
                onChange={update("staffMembers")}
                className={inputClasses}
                placeholder="5"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="partner-location" className={labelClasses}>
                {t("auth.address")}
              </label>
              <input
                id="partner-location"
                type="text"
                required
                value={form.location}
                onChange={update("location")}
                className={inputClasses}
                autoComplete="street-address"
              />
            </div>

            {/* Business hours */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Clock size={16} />
                {t("partnerForm.openDays")}
              </div>
              <div>
                <label htmlFor="partner-day-from" className={labelClasses}>
                  {t("partnerForm.from")}
                </label>
                <select
                  id="partner-day-from"
                  required
                  value={form.openDayFrom}
                  onChange={update("openDayFrom")}
                  className={cn(inputClasses, !form.openDayFrom && "text-muted-foreground/50")}
                >
                  <option value="" disabled>
                    {t("auth.pleaseSelect")}
                  </option>
                  {days.map((d) => (
                    <option key={d.value} value={d.value} className="text-foreground">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="partner-day-to" className={labelClasses}>
                  {t("partnerForm.to")}
                </label>
                <select
                  id="partner-day-to"
                  required
                  value={form.openDayTo}
                  onChange={update("openDayTo")}
                  className={cn(inputClasses, !form.openDayTo && "text-muted-foreground/50")}
                >
                  <option value="" disabled>
                    {t("auth.pleaseSelect")}
                  </option>
                  {days.map((d) => (
                    <option key={d.value} value={d.value} className="text-foreground">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:mt-2">
                <Clock size={16} />
                {t("partnerForm.openTime")}
              </div>
              <div>
                <label htmlFor="partner-time-from" className={labelClasses}>
                  {t("partnerForm.from")}
                </label>
                <select
                  id="partner-time-from"
                  required
                  value={form.openTimeFrom}
                  onChange={update("openTimeFrom")}
                  className={cn(inputClasses, !form.openTimeFrom && "text-muted-foreground/50")}
                >
                  <option value="" disabled>
                    {t("auth.pleaseSelect")}
                  </option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time} className="text-foreground">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="partner-time-to" className={labelClasses}>
                  {t("partnerForm.to")}
                </label>
                <select
                  id="partner-time-to"
                  required
                  value={form.openTimeTo}
                  onChange={update("openTimeTo")}
                  className={cn(inputClasses, !form.openTimeTo && "text-muted-foreground/50")}
                >
                  <option value="" disabled>
                    {t("auth.pleaseSelect")}
                  </option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time} className="text-foreground">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="partner-extra" className={labelClasses}>
                {t("partnerForm.extraServices")}
              </label>
              <textarea
                id="partner-extra"
                rows={3}
                value={form.extraServices}
                onChange={update("extraServices")}
                className={cn(inputClasses, "min-h-24 resize-y")}
              />
            </div>

            {/* Pricing */}
            <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Banknote size={16} />
                {t("partnerForm.pricing")}
              </div>
              <div>
                <label htmlFor="partner-price-low" className={labelClasses}>
                  {t("partnerForm.pricingLow")}
                </label>
                <input
                  id="partner-price-low"
                  type="number"
                  min={0}
                  step={1}
                  required
                  value={form.priceLow}
                  onChange={update("priceLow")}
                  className={inputClasses}
                  placeholder="50"
                />
              </div>
              <div>
                <label htmlFor="partner-price-high" className={labelClasses}>
                  {t("partnerForm.pricingHigh")}
                </label>
                <input
                  id="partner-price-high"
                  type="number"
                  min={0}
                  step={1}
                  required
                  value={form.priceHigh}
                  onChange={update("priceHigh")}
                  className={cn(inputClasses, errors.pricing && "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20")}
                  placeholder="200"
                  aria-invalid={!!errors.pricing}
                  aria-describedby={errors.pricing ? "partner-price-error" : undefined}
                />
              </div>
              {errors.pricing && (
                <p
                  id="partner-price-error"
                  role="alert"
                  className="col-span-2 -mt-2 text-xs font-medium text-red-500"
                >
                  {errors.pricing}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-border bg-card/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <Button type="submit" form="partner-form" className="w-full">
            {t("partnerForm.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
