"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, Phone, Globe, ExternalLink, PackageSearch } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
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
              <article
                key={dealer.id}
                className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20">
                      <PackageSearch size={20} />
                    </span>
                    <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
                      {dealer.name}
                    </h2>
                  </div>
                  {dealer.google_rating != null && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500 ring-1 ring-amber-500/20">
                      <Star size={12} fill="currentColor" />
                      {Number(dealer.google_rating).toFixed(1)}
                      {dealer.review_count != null && (
                        <span className="font-normal text-muted-foreground">
                          ({dealer.review_count})
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {dealer.address && (
                  <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                    <MapPin size={13} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{dealer.address}</span>
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                  {dealer.phone && (
                    <a
                      href={`tel:${dealer.phone.replace(/\D/g, "")}`}
                      className="inline-flex items-center gap-1.5 font-medium text-blue-500 hover:underline"
                    >
                      <Phone size={12} />
                      {dealer.phone}
                    </a>
                  )}
                  {dealer.website && (
                    <a
                      href={dealer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-500 hover:underline"
                    >
                      <Globe size={12} />
                      {t("dealers.website")}
                    </a>
                  )}
                  {dealer.facebook_url && (
                    <a
                      href={dealer.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-500 hover:underline"
                    >
                      <ExternalLink size={12} />
                      {t("dealers.facebook")}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <PartnerModal open={showPartner} onClose={() => setShowPartner(false)} />
    </div>
  );
}
