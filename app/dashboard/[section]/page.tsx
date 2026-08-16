"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Construction } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { NAV_ITEMS, navLabel, type NavKey } from "@/components/dashboard/DashboardSidebar";

/* Public section slugs — every sidebar item must resolve to one of these
   (next segment is decoded, so accented characters survive routing). */
const SECTION_SLUGS: Record<string, NavKey> = {
  vehicules: "vehicles",
  devis: "quotes",
  pieces: "parts",
  "rendez-vous": "appointments",
  historique: "history",
  messages: "messages",
  favoris: "favorites",
  documents: "documents",
  depenses: "expenses",
  parametres: "settings",
};

export default function DashboardSectionPage({ params }: { params: { section: string } }) {
  const { t } = useTranslation();
  const navKey = SECTION_SLUGS[params.section];
  if (!navKey) notFound();

  const item = NAV_ITEMS.find((i) => i.key === navKey);
  const Icon = item?.icon ?? Construction;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:py-16">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground ring-1 ring-border">
          <Icon size={28} />
        </span>
        <h1 className="mt-5 text-xl font-bold text-foreground">{navLabel(t, navKey)}</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("dashboard.section.comingSoon")}
        </p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--cardeal-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[#9E1F23]"
        >
          <ArrowLeft size={15} />
          {t("dashboard.section.back")}
        </Link>
      </div>
    </div>
  );
}