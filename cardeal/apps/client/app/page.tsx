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
      <header className="bg-[var(--background)] border-b border-[var(--border)] sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-3xl font-extrabold text-[var(--primary)] tracking-tighter">{t("site.name")}</div>
          <div className="flex gap-8 text-sm font-semibold text-[var(--muted-foreground)]">
            <a href="#" className="hover:text-indigo-600 transition-colors">{t("nav.findService")}</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">{t("nav.requestQuote")}</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">{t("nav.searchParts")}</a>
          </div>
          <div className="flex gap-4 items-center">
            <LanguageSelector />
            <Button variant="outline" className="border-[var(--ring)] text-[var(--primary-foreground)] hover:bg-[var(--muted)]">{t("buttons.becomePartner")}</Button>
            <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--ring)]">{t("buttons.login")}</Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-[var(--background)] py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-extrabold text-[var(--foreground)] mb-8 tracking-tight">
            {t("hero.title", { highlight: t("hero.highlight") })}
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto">{t("hero.subtitle")}</p>
          <WorkshopSearch brandModels={brandModels} workshops={workshops} />
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">{t("how.title")}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {howSteps.map((step, i) => (
              <div key={i} className="text-center p-8 bg-[var(--background)] rounded-3xl shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8">{i + 1}</div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">{step.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">{t("services.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service} className="border border-[var(--border)] rounded-2xl p-8 text-center font-semibold text-[var(--card-foreground)] hover:border-[var(--ring)] hover:text-[var(--primary-foreground)] transition-all hover:shadow-md cursor-pointer">{service}</div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose */}
      <section className="py-24 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">{t("why.title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason) => (
              <div key={reason} className="bg-[var(--background)] p-8 rounded-2xl shadow-sm border border-[var(--border)] text-center">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{reason}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-24 text-center bg-[var(--secondary)] text-[var(--primary-foreground)] rounded-t-3xl mt-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">{t("partner.title")}</h2>
          <Button variant="primary" className="px-10 py-4 text-lg bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)] rounded-full font-bold">{t("partner.cta")}</Button>
        </div>
      </section>
    </div>
  );
}
