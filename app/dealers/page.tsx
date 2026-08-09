"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import DealerCard from "@/components/DealerCard";
import { useTranslation } from "@/components/TranslationProvider";
import { fetchDealers, type Dealer } from "@/lib/dealers";
import heroDealersImage from "@/assets/images/logo_auto-plus.tn.png";

export default function DealersPage() {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDealers()
      .then((rows) => {
        if (!cancelled) setDealers(rows);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground antialiased">
      <SiteHeader onLogin={() => setShowLogin(true)} onPartner={() => setShowPartner(true)} />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        <div className="absolute inset-0 lg:left-auto lg:w-[55%]" aria-hidden>
          <img
            src={heroDealersImage.src}
            alt=""
            draggable={false}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-y-0 left-1/3 hidden w-40 -skew-x-[18deg] bg-gradient-to-l from-[#BA2529]/95 via-[#BA2529]/60 to-transparent lg:block" />
          <div className="absolute inset-0 bg-[#4A0A0C]/50 lg:hidden" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#BA2529] via-[#BA2529]/80 to-[#7A1418]/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("dealers.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              {t("dealers.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Dealer directory */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--cardeal-primary)] border-t-transparent" />
            <span className="text-sm">{t("dealers.loading")}</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-14 text-center backdrop-blur-sm">
            <p className="max-w-md text-sm text-muted-foreground">{t("dealers.error")}</p>
          </div>
        )}

        {!loading && !error && dealers.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-14 text-center backdrop-blur-sm">
            <p className="max-w-md text-sm text-muted-foreground">{t("dealers.empty")}</p>
          </div>
        )}

        {!loading && !error && dealers.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dealers.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))}
          </div>
        )}
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <PartnerModal open={showPartner} onClose={() => setShowPartner(false)} />
    </div>
  );
}
