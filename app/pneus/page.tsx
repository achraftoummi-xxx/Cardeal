"use client";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "@/components/AuthProvider";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import { useTranslation } from "@/components/TranslationProvider";
import { getTireBrandLogo } from "@/data/tireBrandLogos";
import { cn } from "@/lib/utils";
import heroTiresImage from "@/assets/images/cardeal-tires.png";

type TireOffer = {
  brand: string;
  model: string;
  size: string;
  season: string;
  price: string;
  dealer: string;
};

const TIRE_BRANDS = ["Amine", "Bridgestone", "Continental", "Goodyear", "Hankook", "Michelin", "Pirelli"];

export default function PneusPage() {
  const { t } = useTranslation();
  const { authed, loading: isLoadingAuth } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [brand, setBrand] = useState("");

  const tires = t("pneus.tires") as unknown as TireOffer[];
  const filtered = brand ? tires.filter((tire) => tire.brand === brand) : tires;

  return (
    <div className="min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground antialiased">
      <SiteHeader onLogin={() => setShowLogin(true)} onPartner={() => setShowPartner(true)} />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        <div className="absolute inset-0 lg:left-auto lg:w-[55%]" aria-hidden>
          <img
            src={heroTiresImage.src}
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
              {t("pneus.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              {t("pneus.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Brand filter */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto grid gap-4 sm:grid-cols-2 lg:max-w-2xl flex-1">
            <Select
              label={t("pneus.brand")}
              value={brand}
              onChange={setBrand}
              options={["", ...TIRE_BRANDS]}
              placeholder={t("pneus.all")}
            />
          </div>
        </div>
      </section>

      {/* Tire offers */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tire, i) => (
            <div
              key={`${tire.brand}-${tire.model}-${i}`}
              className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  {(() => {
                    const logo = getTireBrandLogo(tire.brand);
                    return logo ? (
                      <div className="flex h-11 items-center">
                        <img
                          src={logo.src}
                          alt={tire.brand}
                          title={tire.brand}
                          draggable={false}
                          className="h-9 w-auto max-w-[300px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <h2 className="text-lg font-semibold text-foreground sm:text-xl">{tire.brand}</h2>
                    );
                  })()}
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

        {filtered.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-14 text-center backdrop-blur-sm">
            <p className="max-w-md text-sm text-muted-foreground">{t("results.noPartnersHint")}</p>
          </div>
        )}
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <PartnerModal open={showPartner} onClose={() => setShowPartner(false)} />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const fieldId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          name={label.toLowerCase().replace(/\s+/g, "-")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full max-sm:min-h-12 appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
            !value && "text-muted-foreground/70"
          )}
        >
          <option value="" className="bg-card text-foreground">
            {placeholder ?? ""}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-card text-foreground">
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
