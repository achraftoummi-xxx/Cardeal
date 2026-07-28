"use client";

import { Button } from "@/components/ui/button";
import WorkshopSearch from "@/components/WorkshopSearch";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "@/components/TranslationProvider";
import { brandModels } from "@/data/carBrands";
import { workshops } from "@/data/workshops";

export default function Page() {
  const { t } = useTranslation();

  const howSteps = t("how.steps") as unknown as Array<{ title: string; desc: string }>;
  const services = t("services.items") as unknown as string[];
  const reasons = t("why.reasons") as unknown as string[];

  return (
    <div className="min-h-screen bg-[var(--muted)] text-[var(--foreground)]">
      {/* Header */}
      <header className="bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="text-2xl font-extrabold tracking-tight text-[var(--primary)] sm:text-3xl">
            {t("site.name")}
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-[var(--muted-foreground)] md:flex">
            <a href="#" className="transition-colors hover:text-[var(--primary)]">{t("nav.findService")}</a>
            <a href="#" className="transition-colors hover:text-[var(--primary)]">{t("nav.requestQuote")}</a>
            <a href="#" className="transition-colors hover:text-[var(--primary)]">{t("nav.searchParts")}</a>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button variant="outline" className="hidden text-sm sm:inline-flex">{t("buttons.becomePartner")}</Button>
            <Button className="text-sm">{t("buttons.login")}</Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {t("hero.title", { highlight: t("hero.highlight") })}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 md:mt-14">
              <WorkshopSearch brandModels={brandModels} workshops={workshops} />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("how.title")}</h2>
          <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-3 lg:mt-16">
            {howSteps.map((step, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 text-center shadow-sm transition-all hover:shadow-md sm:p-8"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10 text-xl font-bold text-[var(--primary)] sm:h-16 sm:w-16 sm:text-2xl">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold sm:text-xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--muted-foreground)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[var(--background)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("services.title")}</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:mt-16">
            {services.map((service) => (
              <div
                key={service}
                className="cursor-pointer rounded-xl border border-[var(--border)] p-5 text-center font-semibold text-[var(--foreground)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-sm sm:p-6 sm:text-base"
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("why.title")}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 text-center shadow-sm sm:p-8"
              >
                <h3 className="text-base font-semibold sm:text-lg">{reason}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="mt-8 rounded-t-3xl bg-[var(--primary)] py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[var(--primary-foreground)] sm:text-3xl lg:text-4xl">{t("partner.title")}</h2>
          <Button className="mt-8 rounded-full bg-[var(--background)] px-8 py-3 text-base font-bold text-[var(--foreground)] transition-all hover:bg-[var(--muted)] sm:px-10 sm:py-4 sm:text-lg">
            {t("partner.cta")}
          </Button>
        </div>
      </section>
    </div>
  );
}