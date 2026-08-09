"use client";

import { Star, MapPin, Phone, Globe, ExternalLink, MessageCircle } from "lucide-react";
import { useTranslation } from "./TranslationProvider";
import { getDealerLogo } from "@/data/dealerLogos";
import type { Dealer } from "@/lib/dealers";

export default function DealerCard({ dealer }: { dealer: Dealer }) {
  const { t } = useTranslation();
  const phoneDigits = dealer.phone?.replace(/\D/g, "") ?? null;

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card ring-1 ring-border">
            <img
              src={getDealerLogo(dealer.name).src}
              alt={dealer.name}
              title={dealer.name}
              draggable={false}
              className="h-11 w-auto max-w-[110px] object-contain"
            />
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
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="inline-flex items-center gap-1.5 font-medium text-blue-500 hover:underline"
          >
            <Phone size={12} />
            {dealer.phone}
          </a>
        )}
        {phoneDigits && (
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-green-500 hover:underline"
          >
            <MessageCircle size={12} />
            {t("dealers.whatsapp")}
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
  );
}
