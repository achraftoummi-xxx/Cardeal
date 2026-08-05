"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchAndMapSection from "@/components/SearchAndMapSection";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import { useTranslation } from "@/components/TranslationProvider";
import heroShopImage from "@/assets/images/cardeal-shop.png";
import cardealLogo from "@/assets/images/cardeal_logo.png";

export default function Page() {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const howSteps = t("how.steps") as unknown as Array<{ title: string; desc: string }>;
  const services = t("services.items") as unknown as string[];
  const reasons = t("why.reasons") as unknown as string[];
  const navLinks = [
    { href: "#find-service", label: t("nav.findService") },
    { href: "#request-quote", label: t("nav.requestQuote") },
    { href: "#search-parts", label: t("nav.searchParts") },
  ];

  return (
    <div className="min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 py-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-3 lg:px-8">
          <div className="shrink-0">
            <img
              src={cardealLogo.src}
              alt={t("site.name")}
              draggable={false}
              className="h-10 w-auto dark:brightness-150 sm:h-12"
            />
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageSelector />
            <Button variant="outline" className="hidden text-sm sm:inline-flex" onClick={() => setShowPartner(true)}>{t("buttons.becomePartner")}</Button>
            <Button onClick={() => setShowLogin(true)} className="text-sm">{t("buttons.login")}</Button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label={t("nav.menu")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-700/50 bg-white text-zinc-700 shadow-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-700/30 md:hidden dark:bg-zinc-800/30 dark:text-zinc-300 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-700/30"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
        {/* Mobile nav panel */}
        {menuOpen && (
          <div className="border-t border-border bg-background/95 px-[max(1rem,env(safe-area-inset-left))] py-2 pr-[max(1rem,env(safe-area-inset-right))] backdrop-blur-xl md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        {/* Background photo — right side on desktop, soft scrim behind copy on mobile */}
        <div className="absolute inset-0 lg:left-auto lg:w-[55%]" aria-hidden>
          <img
            src={heroShopImage.src}
            alt=""
            draggable={false}
            className="h-full w-full object-cover object-center"
          />
          {/* Diagonal theme overlay blending the photo into the banner */}
          <div className="absolute inset-y-0 left-1/3 hidden w-40 -skew-x-[18deg] bg-gradient-to-l from-[#BA2529]/95 via-[#BA2529]/60 to-transparent lg:block" />
          <div className="absolute inset-0 bg-[#4A0A0C]/50 lg:hidden" />
        </div>
        {/* Left-to-right tint so the white copy stays high-contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#BA2529] via-[#BA2529]/80 to-[#7A1418]/20" />

        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8 lg:pb-36 lg:pt-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Trouvez le bon garage. Comparez les offres de réparation. Gardez votre voiture en
              marche.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              Soumettez une demande de réparation et recevez des offres de garages de confiance
              près de chez vous.
            </p>
          </div>
        </div>
      </section>

      {/* Search module — overlaps the bottom edge of the hero banner */}
      <div
        id="find-service"
        className="relative z-10 mx-auto -mt-16 max-w-6xl scroll-mt-24 px-4 sm:-mt-20 sm:px-6 lg:px-8"
      >
        <SearchAndMapSection />
      </div>

      {/* How it works */}
      <section className="border-t border-border py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("how.title")}</h2>
          <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-3 lg:mt-16">
            {howSteps.map((step, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-card/50 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl sm:p-8"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-xl font-bold text-blue-400 ring-1 ring-blue-500/20 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:ring-blue-400/30 sm:h-16 sm:w-16 sm:text-2xl">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold sm:text-xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("services.title")}</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:mt-16">
            {services.map((service) => (
              <div
                key={service}
                className="cursor-pointer rounded-xl border border-border bg-card/30 p-5 text-center font-semibold text-muted-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:text-blue-500 hover:shadow-lg hover:shadow-blue-500/5 sm:p-6 sm:text-base"
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="border-t border-border py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("why.title")}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="rounded-xl border border-border bg-card/30 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-md sm:p-8"
              >
                <h3 className="text-base font-semibold sm:text-lg">{reason}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="relative mt-8 overflow-hidden rounded-t-3xl border-t border-border bg-gradient-to-b from-card to-background py-16 text-center sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="bg-gradient-to-r from-foreground via-muted-foreground to-muted bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl lg:text-4xl">{t("partner.title")}</h2>
          <Button onClick={() => setShowPartner(true)} className="mt-8 rounded-full bg-[var(--cardeal-primary)] px-8 py-3 text-base font-bold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] hover:shadow-xl hover:shadow-[#BA2529]/30 sm:px-10 sm:py-4 sm:text-lg">
            {t("partner.cta")}
          </Button>
        </div>
      </section>

      {/* Footer banner — mirrors the hero banner theme with the brand video */}
      <section className="relative mt-8 overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:justify-between lg:gap-12 lg:px-8 lg:py-24">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Votre voiture mérite un garage de confiance.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              Comparez les offres de réparation, suivez vos demandes et partez l'esprit
              tranquille — partout en Tunisie.
            </p>
            <Button
              onClick={() =>
                document
                  .getElementById("find-service")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="mt-8 rounded-full bg-white px-8 py-3 text-base font-bold text-[var(--cardeal-primary)] shadow-lg shadow-black/20 transition-all hover:bg-blue-50 hover:shadow-xl active:scale-95 sm:px-10 sm:py-4 sm:text-lg"
            >
              Trouver un garage
            </Button>
          </div>

          {/* Brand video — right side, mirroring the hero photo */}
          <div className="w-full max-w-md lg:w-[46%]">
            <video
              src="/assets/images/cardeal_video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="aspect-video w-full rounded-2xl border border-white/20 object-cover shadow-2xl shadow-black/40"
            />
          </div>
        </div>
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <PartnerModal open={showPartner} onClose={() => setShowPartner(false)} />
    </div>
  );
}
