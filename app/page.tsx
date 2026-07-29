"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import WorkshopSearch from "@/components/WorkshopSearch";
import type { Workshop } from "@/components/WorkshopSearch";
import LocationBar from "@/components/LocationBar";
import NearbyMap from "@/components/NearbyMap";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "@/components/TranslationProvider";
import { brandModels } from "@/data/carBrands";
import { workshops } from "@/data/workshops";

export default function Page() {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>(workshops);

  const howSteps = t("how.steps") as unknown as Array<{ title: string; desc: string }>;
  const services = t("services.items") as unknown as string[];
  const reasons = t("why.reasons") as unknown as string[];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
            {t("site.name")}
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
            <a href="#" className="transition-colors hover:text-zinc-100">{t("nav.findService")}</a>
            <a href="#" className="transition-colors hover:text-zinc-100">{t("nav.requestQuote")}</a>
            <a href="#" className="transition-colors hover:text-zinc-100">{t("nav.searchParts")}</a>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button variant="outline" className="hidden text-sm sm:inline-flex">{t("buttons.becomePartner")}</Button>
            <Button className="text-sm">{t("buttons.login")}</Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t("hero.title", { highlight: t("hero.highlight") })}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg md:text-xl">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
              <LocationBar onLocationChange={setSelectedLocation} />
            </div>

            <div className="mt-6">
              <WorkshopSearch
                brandModels={brandModels}
                workshops={workshops}
                externalLocation={selectedLocation}
                onResultsFiltered={setFilteredWorkshops}
              />
            </div>

            <div className="mt-6">
              <NearbyMap location={selectedLocation} workshops={filteredWorkshops} />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800/50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("how.title")}</h2>
          <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-3 lg:mt-16">
            {howSteps.map((step, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/80 hover:shadow-xl sm:p-8"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-xl font-bold text-blue-400 ring-1 ring-blue-500/20 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:ring-blue-400/30 sm:h-16 sm:w-16 sm:text-2xl">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold sm:text-xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-zinc-800/50 bg-zinc-900/30 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("services.title")}</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:mt-16">
            {services.map((service) => (
              <div
                key={service}
                className="cursor-pointer rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5 text-center font-semibold text-zinc-300 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/5 sm:p-6 sm:text-base"
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="border-t border-zinc-800/50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("why.title")}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/80 hover:shadow-md sm:p-8"
              >
                <h3 className="text-base font-semibold sm:text-lg">{reason}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="relative mt-8 overflow-hidden rounded-t-3xl border-t border-zinc-800/50 bg-gradient-to-b from-zinc-900 to-zinc-950 py-16 text-center sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl lg:text-4xl">{t("partner.title")}</h2>
          <Button className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 sm:px-10 sm:py-4 sm:text-lg">
            {t("partner.cta")}
          </Button>
        </div>
      </section>
    </div>
  );
}
