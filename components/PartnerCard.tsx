"use client";

import { Star, Phone, Globe, MapPin, CalendarDays, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "./TranslationProvider";
import { partnerDistanceKm, type Partner } from "@/lib/partners";

type Props = {
  partner: Partner;
  origin?: { lat: number; lng: number } | null;
  active?: boolean;
  onSelect?: () => void;
  onBook?: () => void;
  onQuote?: () => void;
};

export default function PartnerCard({ partner, origin, active = false, onSelect, onBook, onQuote }: Props) {
  const { t } = useTranslation();
  const distanceKm = partnerDistanceKm(partner, origin ?? null);
  const reviewCount = partner.review_count ?? 0;

  return (
    <article
      id={`partner-card-${partner.id}`}
      onClick={onSelect}
      className={cn(
        "group cursor-pointer rounded-xl border bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        active
          ? "border-blue-500/60 ring-2 ring-blue-500/20"
          : "border-border hover:border-blue-500/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
            {partner.name}
          </h3>
          {partner.establishment_type && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {partner.establishment_type}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {partner.google_rating != null && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500 ring-1 ring-amber-500/20">
              <Star size={11} fill="currentColor" />
              {Number(partner.google_rating).toFixed(1)}
              {reviewCount > 0 && (
                <span className="font-normal text-muted-foreground">
                  ({t(reviewCount === 1 ? "partnerCard.review" : "partnerCard.reviews", {
                    count: reviewCount,
                  })})
                </span>
              )}
            </span>
          )}
          {distanceKm != null && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500 ring-1 ring-blue-500/20">
              {distanceKm < 1
                ? t("results.underOneKm")
                : t("results.km", { count: Math.round(distanceKm) })}
            </span>
          )}
        </div>
      </div>

      {partner.address && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin size={13} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{partner.address}</span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {partner.phone && (
          <a
            href={`tel:${partner.phone.replace(/\D/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 font-medium text-blue-500 hover:underline"
          >
            <Phone size={12} />
            {partner.phone}
          </a>
        )}
        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-blue-500 hover:underline"
          >
            <Globe size={12} />
            {t("partnerCard.website")}
          </a>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onBook?.();
          }}
          className="flex w-full min-w-0 items-center justify-center gap-2"
        >
          <CalendarDays size={15} className="shrink-0" />
          <span className="min-w-0 truncate">{t("partnerCard.takeAppointment")}</span>
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onQuote?.();
          }}
          variant="outline"
          className="flex w-full min-w-0 items-center justify-center gap-2"
        >
          <FileText size={15} className="shrink-0" />
          <span className="min-w-0 truncate">{t("partnerCard.requestNote")}</span>
        </Button>
      </div>
    </article>
  );
}
