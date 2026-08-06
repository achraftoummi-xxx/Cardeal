"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import { useTranslation } from "@/components/TranslationProvider";

type TireOffer = {
  brand: string;
  model: string;
  size: string;
  season: string;
  price: string;
  dealer: string;
};

export default function PneusPage() {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);

  const tires = t("pneus.tires") as unknown as TireOffer[];

  return (
    <div className="min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground antialiased">
      <SiteHeader onLogin={() => setShowLogin(true)} onPartner={() => setShowPartner(true)} />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BA2529] via-[#BA2529]/80 to-[#7A1418]/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("pneus.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              {t("pneus.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Tire offers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tires.map((tire, i) => (
            <div
              key={`${tire.brand}-${tire.model}-${i}`}
              className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground sm:text-xl">{tire.brand}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tire.model}</p>
                </div>
                <span className="shrink-0 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
                  {tire.season}
                </span>
              </div>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t("pneus.size")}</dt>
                  <dd className="font-semibold text-foreground">{tire.size}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t("pneus.dealer")}</dt>
                  <dd className="text-right font-semibold text-foreground">{tire.dealer}</dd>
                </div>
              </dl>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
                <p className="text-2xl font-extrabold tracking-tight text-foreground">{tire.price}</p>
                <a
                  href="/#find-service"
                  className="rounded-lg bg-[var(--cardeal-primary)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] hover:shadow-xl hover:shadow-[#BA2529]/30"
                >
                  {t("pneus.cta")}
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
