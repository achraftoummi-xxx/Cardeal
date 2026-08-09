"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import DealerCard from "@/components/DealerCard";
import { useTranslation } from "@/components/TranslationProvider";
import { getDealerLogo } from "@/data/dealerLogos";
import { getManufacturerLogo } from "@/data/manufacturerLogos";
import { MANUFACTURER_CATALOG } from "@/data/manufacturerCatalog";
import { fetchDealers, type Dealer } from "@/lib/dealers";
import { cn } from "@/lib/utils";
import heroPartsImage from "@/assets/images/quto_pqrts.png";

type PartItem = {
  brand: string;
  model: string;
  category: string;
  price: string;
  dealer: string;
};

export default function PartsSearchPage() {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loadingDealers, setLoadingDealers] = useState(true);
  const [dealersError, setDealersError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDealers()
      .then((rows) => {
        if (!cancelled) setDealers(rows);
      })
      .catch(() => {
        if (!cancelled) setDealersError(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingDealers(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const parts = t("parts.items") as unknown as PartItem[];

  const categories = useMemo(() => [...new Set(parts.map((p) => p.category))], [parts]);
  const brandGroups = useMemo(
    () =>
      MANUFACTURER_CATALOG.filter((region) => region.countries.some((c) => c.brands.length > 0))
        .map((region) => ({
          label: t(`parts.regions.${region.id}`),
          countries: region.countries
            .filter((c) => c.brands.length > 0)
            .map((c) => ({ name: c.name, flag: c.flag, brands: [...c.brands] })),
        })),
    [t]
  );

  const filtered = useMemo(
    () =>
      parts.filter(
        (p) =>
          (!category || p.category === category) &&
          (!brand || p.brand === brand)
      ),
    [parts, category, brand]
  );

  return (
    <div className="min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground antialiased">
      <SiteHeader onLogin={() => setShowLogin(true)} onPartner={() => setShowPartner(true)} />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        {/* Background photo — right side on desktop, soft scrim behind copy on mobile */}
        <div className="absolute inset-0 lg:left-auto lg:w-[55%]" aria-hidden>
          <img
            src={heroPartsImage.src}
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
              {t("parts.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              {t("parts.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <Select
            label={t("parts.category")}
            value={category}
            onChange={setCategory}
            options={["", ...categories]}
            placeholder={t("parts.all")}
          />
          <BrandSelect
            label={t("parts.brand")}
            value={brand}
            onChange={setBrand}
            groups={brandGroups}
            placeholder={t("parts.all")}
          />
        </div>
      </section>

      {/* Part offers */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((part, i) => (
            <div
              key={`${part.brand}-${part.model}-${i}`}
              className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-11 items-center">
                    <img
                      src={getManufacturerLogo(part.brand).src}
                      alt={part.brand}
                      title={part.brand}
                      draggable={false}
                      className="h-9 w-auto max-w-[300px] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{part.model}</p>
                </div>
                <span className="shrink-0 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
                  {part.category}
                </span>
              </div>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t("parts.price")}</dt>
                  <dd className="font-semibold text-foreground">{part.price}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t("parts.dealer")}</dt>
                  <dd className="flex items-center justify-end gap-2 text-right font-semibold text-foreground">
                    <img
                      src={getDealerLogo(part.dealer).src}
                      alt={part.dealer}
                      title={part.dealer}
                      draggable={false}
                      className="h-6 w-auto max-w-[90px] object-contain"
                    />
                    <span className="truncate">{part.dealer}</span>
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
                <p className="text-2xl font-extrabold tracking-tight text-foreground">{part.price}</p>
                <a
                  href="/#find-service"
                  className="rounded-lg bg-[var(--cardeal-primary)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] hover:shadow-xl hover:shadow-[#BA2529]/30"
                >
                  {t("parts.cta")}
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

      {/* Dealer directory window */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {t("dealers.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("dealers.subtitle")}
          </p>
        </div>

        {loadingDealers && (
          <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--cardeal-primary)] border-t-transparent" />
            <span className="text-sm">{t("dealers.loading")}</span>
          </div>
        )}

        {!loadingDealers && dealersError && (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-14 text-center backdrop-blur-sm">
            <p className="max-w-md text-sm text-muted-foreground">{t("dealers.error")}</p>
          </div>
        )}

        {!loadingDealers && !dealersError && dealers.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-14 text-center backdrop-blur-sm">
            <p className="max-w-md text-sm text-muted-foreground">{t("dealers.empty")}</p>
          </div>
        )}

        {!loadingDealers && !dealersError && dealers.length > 0 && (
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

function BrandSelect({
  label,
  value,
  groups,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  groups: { label: string; countries: { name: string; flag: string; brands: string[] }[] }[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const fieldId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const selected = groups.flatMap((g) => g.countries).flatMap((c) => c.brands).find((o) => o === value);

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
      >
        {label}
      </label>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          id={fieldId}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full max-sm:min-h-12 items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
            !value && "text-muted-foreground/70"
          )}
        >
          {selected ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex h-6 w-16 shrink-0 items-center justify-center">
                <img
                  src={getManufacturerLogo(selected).src}
                  alt={selected}
                  draggable={false}
                  className="h-5 w-auto max-w-[60px] object-contain"
                />
              </span>
              <span className="truncate font-medium text-foreground">{selected}</span>
            </span>
          ) : (
            <span>{placeholder ?? ""}</span>
          )}
          <svg className="h-4 w-4 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-30 mt-2 max-h-80 w-full min-w-64 overflow-y-auto rounded-xl border border-border bg-background p-1 shadow-xl">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-[var(--cardeal-primary)]">
                  {group.label}
                </p>
                {group.countries.map((country) => (
                  <div key={country.name}>
                    <p className="flex items-center gap-2 px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <img
                        src={country.flag}
                        alt=""
                        draggable={false}
                        className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                      />
                      {country.name}
                    </p>
                    {country.brands.map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={option === value}
                        onClick={() => {
                          onChange(option);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 pl-6 text-left text-sm text-foreground transition-colors hover:bg-accent",
                          option === value && "bg-accent font-semibold"
                        )}
                      >
                        <span className="flex h-6 w-16 shrink-0 items-center justify-center">
                          <img
                            src={getManufacturerLogo(option).src}
                            alt={option}
                            draggable={false}
                            className="h-5 w-auto max-w-[60px] object-contain"
                          />
                        </span>
                        <span className="truncate">{option}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
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
