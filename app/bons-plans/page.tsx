"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import { useTranslation } from "@/components/TranslationProvider";

type Deal = {
  badge: string;
  title: string;
  desc: string;
  date: string;
};

export default function BonsPlansPage() {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);

  const deals = t("deals.deals") as unknown as Deal[];

  return (
    <div className="min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground antialiased">
      <SiteHeader onLogin={() => setShowLogin(true)} onPartner={() => setShowPartner(true)} />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BA2529] via-[#BA2529]/80 to-[#7A1418]/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("deals.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              {t("deals.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal, i) => (
            <div
              key={`${deal.title}-${i}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#BA2529]/10 blur-2xl" />
              <span className="inline-flex w-fit items-center rounded-full bg-[var(--cardeal-primary)] px-3 py-1 text-sm font-extrabold text-white shadow-lg shadow-[#BA2529]/25">
                {deal.badge}
              </span>
              <h2 className="mt-5 text-lg font-semibold leading-snug text-foreground sm:text-xl">
                {deal.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{deal.desc}</p>
              <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-6">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CalendarDays size={14} />
                  {t("deals.until", { date: deal.date })}
                </span>
                <a
                  href="/#find-service"
                  className="rounded-lg bg-[var(--cardeal-primary)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] hover:shadow-xl hover:shadow-[#BA2529]/30"
                >
                  {t("deals.cta")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <PartnerModal open={showPartner} onClose={() => setShowPartner(false)} />
    </div>
  );
}
