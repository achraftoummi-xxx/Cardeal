"use client";

import React, { useState } from "react";
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
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Selector internal state
  const [width, setWidth] = useState("245");
  const [profile, setProfile] = useState("40");
  const [diameter, setDiameter] = useState("19");
  const [offset, setOffset] = useState("40");
  const [isCompare, setIsCompare] = useState(false);
  const [compareWidth, setCompareWidth] = useState("265");
  const [compareProfile, setCompareProfile] = useState("40");
  const [compareDiameter, setCompareDiameter] = useState("20");
  const [compareOffset, setCompareOffset] = useState("40");
  const [activeView, setActiveView] = useState<"height" | "diameter" | "width">("height");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const tires = t("pneus.tires") as unknown as TireOffer[];
  const filtered = brand ? tires.filter((tire) => tire.brand === brand) : tires;

  // Calculations
  const wNum = parseFloat(width);
  const pNum = parseFloat(profile);
  const dNum = parseFloat(diameter);
  const sidewall = (wNum * (pNum / 100)).toFixed(1);
  const rimMm = (dNum * 25.4).toFixed(1);
  const overallDiameter = (parseFloat(rimMm) + parseFloat(sidewall) * 2).toFixed(1);
  const circumference = (parseFloat(overallDiameter) * Math.PI).toFixed(1);

  const cwNum = parseFloat(compareWidth);
  const cpNum = parseFloat(compareProfile);
  const cdNum = parseFloat(compareDiameter);
  const compSidewall = (cwNum * (cpNum / 100)).toFixed(1);
  const compRimMm = (cdNum * 25.4).toFixed(1);
  const compOverall = (parseFloat(compRimMm) + parseFloat(compSidewall) * 2).toFixed(1);
  const compCircum = (parseFloat(compOverall) * Math.PI).toFixed(1);
  const speedVariance = (((parseFloat(compOverall) - parseFloat(overallDiameter)) / parseFloat(overallDiameter)) * 100).toFixed(1);

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

      {/* Brand filter and subtle selector link */}
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
          
          {/* Visible Link Trigger */}
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="text-sm font-semibold text-[#BA2529] hover:text-[#f5504d] underline underline-offset-4 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span className="material-symbols-outlined text-base">settings</span>
            Wheel &amp; Tire Size Selector
          </button>
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

      {/* Selector Sub-Window Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0e0e0e] border border-[#554241] rounded-2xl max-w-5xl w-full p-6 md:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto text-[#e5e2e1]">
            <div className="flex justify-between items-center mb-8 border-b border-[#353534] pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-[#fafafa]">
                  Wheel &amp; Tire Size Selector
                </h2>
                <p className="text-sm text-[#dac1be] font-['Manrope'] mt-1">
                  Configure your setup to view technical specifications and compatibility.
                </p>
              </div>
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="h-10 w-10 rounded-full bg-[#1c1b1b] border border-[#554241] text-[#dac1be] hover:text-[#fafafa] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {isLoadingAuth ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#554241] border-t-[#BA2529]" />
                <p className="mt-4 text-sm text-[#dac1be]">Checking session...</p>
              </div>
            ) : authed ? (
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
                {/* Left Side: Controls & Specs Table */}
                <section className="lg:col-span-5 flex flex-col gap-6 bg-[#131313] p-5 rounded-xl border border-[#353534] shadow-sm relative z-10 order-1">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-lg font-semibold font-['Space_Grotesk'] text-[#fafafa]">Configuration</h3>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="ml-auto mr-2 flex items-center gap-1 text-xs font-bold tracking-widest text-[#BA2529] hover:underline"
                    >
                      <span className="material-symbols-outlined text-base">help</span>Size Guide
                    </button>
                    <label className="flex items-center cursor-pointer gap-2">
                      <span className="text-xs font-bold tracking-widest text-[#dac1be]">Compare</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isCompare}
                          onChange={(e) => setIsCompare(e.target.checked)}
                        />
                        <div className={`block w-9 h-5 rounded-full transition-colors ${isCompare ? "bg-[#8e1c21]" : "bg-[#353534]"}`}></div>
                        <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isCompare ? "translate-x-4" : ""}`}></div>
                      </div>
                    </label>
                  </div>

                  {/* Current Setup */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold tracking-wider text-[#BA2529] uppercase font-['Manrope']">Current Setup</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Width (mm)</label>
                        <select
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#BA2529]"
                        >
                          <option>225</option>
                          <option>235</option>
                          <option>245</option>
                          <option>255</option>
                          <option>265</option>
                          <option>275</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Profile</label>
                        <select
                          value={profile}
                          onChange={(e) => setProfile(e.target.value)}
                          className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#BA2529]"
                        >
                          <option>30</option>
                          <option>35</option>
                          <option>40</option>
                          <option>45</option>
                          <option>50</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Diameter (in)</label>
                        <select
                          value={diameter}
                          onChange={(e) => setDiameter(e.target.value)}
                          className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#BA2529]"
                        >
                          {[...Array(21)].map((_, i) => {
                            const val = i + 10;
                            return <option key={val} value={val}>{val}</option>;
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Offset (ET)</label>
                        <select
                          value={offset}
                          onChange={(e) => setOffset(e.target.value)}
                          className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#BA2529]"
                        >
                          <option>30</option>
                          <option>35</option>
                          <option>40</option>
                          <option>45</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Compare Setup */}
                  {isCompare && (
                    <div className="space-y-3 pt-3 border-t border-[#554241]">
                      <h4 className="text-xs font-semibold tracking-wider text-[#f5504d] uppercase font-['Manrope']">New Setup</h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Width (mm)</label>
                          <select
                            value={compareWidth}
                            onChange={(e) => setCompareWidth(e.target.value)}
                            className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#f5504d]"
                          >
                            <option>245</option>
                            <option>265</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Profile</label>
                          <select
                            value={compareProfile}
                            onChange={(e) => setCompareProfile(e.target.value)}
                            className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#f5504d]"
                          >
                            <option>35</option>
                            <option>40</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Diameter (in)</label>
                          <select
                            value={compareDiameter}
                            onChange={(e) => setCompareDiameter(e.target.value)}
                            className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#f5504d]"
                          >
                            <option>19</option>
                            <option>20</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-[#dac1be] mb-1">Offset (ET)</label>
                          <select
                            value={compareOffset}
                            onChange={(e) => setCompareOffset(e.target.value)}
                            className="w-full h-10 bg-[#18181b] border border-[#554241] text-[#e5e2e1] rounded-lg px-2.5 text-sm cursor-pointer focus:border-[#f5504d]"
                          >
                            <option>30</option>
                            <option>35</option>
                            <option>40</option>
                            <option>45</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Info Table */}
                  <div className="border border-[#554241] rounded-lg overflow-hidden bg-[#18181b]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#1c1b1b] border-b border-[#554241]">
                          <th className="py-2 px-2.5 font-bold text-[#dac1be]">Specification</th>
                          <th className="py-2 px-2.5 font-bold text-[#dac1be]">Value</th>
                          {isCompare && <th className="py-2 px-2.5 font-bold text-[#f5504d]">New Value</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#554241]">
                        <tr>
                          <td className="py-2 px-2.5 text-[#dac1be]">Width</td>
                          <td className="py-2 px-2.5 text-[#fafafa] font-semibold">{width} mm</td>
                          {isCompare && <td className="py-2 px-2.5 text-[#f5504d] font-semibold">{compareWidth} mm</td>}
                        </tr>
                        <tr>
                          <td className="py-2 px-2.5 text-[#dac1be]">Sidewall</td>
                          <td className="py-2 px-2.5 text-[#fafafa] font-semibold">{sidewall} mm</td>
                          {isCompare && <td className="py-2 px-2.5 text-[#f5504d] font-semibold">{compSidewall} mm</td>}
                        </tr>
                        <tr>
                          <td className="py-2 px-2.5 text-[#dac1be]">Rim Diameter</td>
                          <td className="py-2 px-2.5 text-[#fafafa] font-semibold">{diameter}" ({rimMm} mm)</td>
                          {isCompare && <td className="py-2 px-2.5 text-[#f5504d] font-semibold">{compareDiameter}" ({compRimMm} mm)</td>}
                        </tr>
                        <tr>
                          <td className="py-2 px-2.5 text-[#dac1be]">Overall Diameter</td>
                          <td className="py-2 px-2.5 text-[#fafafa] font-semibold">{overallDiameter} mm</td>
                          {isCompare && <td className="py-2 px-2.5 text-[#f5504d] font-semibold">{compOverall} mm</td>}
                        </tr>
                        <tr>
                          <td className="py-2 px-2.5 text-[#dac1be]">Circumference</td>
                          <td className="py-2 px-2.5 text-[#fafafa] font-semibold">{circumference} mm</td>
                          {isCompare && <td className="py-2 px-2.5 text-[#f5504d] font-semibold">{compCircum} mm</td>}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-1 flex flex-col gap-2.5">
                    <button className="w-full h-11 bg-[#BA2529] hover:bg-[#BA2529]/90 text-white text-xs font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <span className="material-symbols-outlined text-base">directions_car</span>
                      Check compatibility with my vehicle
                    </button>
                    <button
                      onClick={() => setIsSelectorOpen(false)}
                      className="w-full h-11 bg-[#18181b] hover:bg-[#1c1b1b] border border-[#554241] text-[#fafafa] text-xs font-bold tracking-wider rounded-lg transition-colors"
                    >
                      Close Selector
                    </button>
                  </div>
                </section>

                {/* Right Side: Visualizer */}
                <section className="lg:col-span-7 flex flex-col bg-[#131313] rounded-xl overflow-hidden relative min-h-[420px] border border-[#353534] shadow-sm order-2">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#0e0e0e] p-1 rounded-lg border border-[#554241] shadow-sm flex gap-1">
                    <button
                      onClick={() => setActiveView("height")}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeView === "height" ? "bg-[#BA2529] text-white" : "text-[#dac1be] hover:bg-[#1c1b1b]"}`}
                    >
                      Height
                    </button>
                    <button
                      onClick={() => setActiveView("diameter")}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeView === "diameter" ? "bg-[#BA2529] text-white" : "text-[#dac1be] hover:bg-[#1c1b1b]"}`}
                    >
                      Diameter
                    </button>
                    <button
                      onClick={() => setActiveView("width")}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeView === "width" ? "bg-[#BA2529] text-white" : "text-[#dac1be] hover:bg-[#1c1b1b]"}`}
                    >
                      Width
                    </button>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center p-6">
                    {activeView === "height" && (
                      <div className="text-center flex flex-col items-center">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXEcMX1ADHfq2E4jo-L99t3dN5saYVqQs8rQAoo_J3cHxTHbqkprRmi0IPuPZZL2q1pis3l_eqkfccXTrIH4XycILxMh5f9IgfqdNcDxJz70sAqQYtw_TLCxUFVbdJmbkTAqbm3eYeu_0EKJ7DkxLuif7GTWTBRs_pnFvVzqVPGi4vv4KMAVv9TfMQ0Ccz1aTbqagJ2Mv5JqGD2tSe5VisTHOb6oJbL1hpVoqcWe4zV1Gto2-0_Ycum45w8d9F59UvkfU"
                          alt="Side Profile"
                          className="max-h-[280px] object-contain drop-shadow-2xl"
                        />
                        <div className="mt-3 bg-[#18181b] border border-[#554241] px-3 py-1.5 rounded-lg text-xs">
                          <span className="text-[#BA2529] font-bold">Overall Diameter:</span> {overallDiameter} mm
                        </div>
                      </div>
                    )}
                    {activeView === "diameter" && (
                      <div className="text-center flex flex-col items-center">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCewFIDL0pmcUvrXEnh1I9UiK7XnaaC-ivEUMdHkHQhhxVyXq88A_d6cdfGKiiJ3qmUCWtOb8b9fABMH9JGmB8rOXqXr_mmB23zknPihtJWDbyVdCFpw1rpZlWbu9DOeTKalDHMVxuAvrLTn8VfCrZlw2RrWpvmEa1HcUoan4JUlUvXM1I0BN-kuDAJRZoTlcME2OoYjc9cZASE1Hk5M9OjLziKreFHHlrwqG1ZFxl_QZllbt3J79SUblAYF5ou-1BjYio"
                          alt="Front View"
                          className="max-h-[280px] object-contain drop-shadow-2xl"
                        />
                        <div className="mt-3 bg-[#18181b] border border-[#554241] px-3 py-1.5 rounded-lg text-xs">
                          <span className="text-[#BA2529] font-bold">Rim Diameter:</span> {diameter}" ({rimMm} mm)
                        </div>
                      </div>
                    )}
                    {activeView === "width" && (
                      <div className="text-center flex flex-col items-center">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzG_XP5LcgXPOmwyufYX0C_x8R1lcd5YqjtLB5ekVgCm5OuD9tj7BqfwqVFSYipRciAy59IDnh9TG_y07XlVyh_uG2kBmWaKuBOFT0ctbXClpifN1Kmjs1InQQ5LeDByLACuZGsDIehcjE1VZaKFzIfoI_vqWCZdeY1NEk3b9tCxQ_UuCteM_4jzmtRiKECtH4Mv_yFISQrTzHucP5gm8BEurd9kHi4JSVLE4IssiKo7NzmFbbt6703h2H829ComB-oRA"
                          alt="Tread View"
                          className="max-h-[280px] object-contain drop-shadow-2xl"
                        />
                        <div className="mt-3 bg-[#18181b] border border-[#554241] px-3 py-1.5 rounded-lg text-xs">
                          <span className="text-[#BA2529] font-bold">Tread Width:</span> {width} mm
                        </div>
                      </div>
                    )}
                  </div>

                  {isCompare && (
                    <div className="absolute bottom-4 left-4 right-4 z-30 bg-[#18181b]/95 backdrop-blur-md rounded-lg p-3 flex justify-between items-center border border-[#554241] text-xs">
                      <div className="flex items-center gap-2 text-[#BA2529]">
                        <span className="material-symbols-outlined text-base">speed</span>
                        <span className="font-bold">Speedometer Variance:</span>
                      </div>
                      <span className="text-base font-bold text-[#fafafa]">{speedVariance}%</span>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              /* Guest Restricted View */
              <div className="flex flex-col items-center justify-center bg-[#131313] border border-[#353534] rounded-2xl p-10 text-center shadow-xl max-w-xl mx-auto my-6">
                <div className="h-14 w-14 rounded-full bg-[#BA2529]/10 text-[#BA2529] flex items-center justify-center mb-5 ring-1 ring-[#BA2529]/20">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#fafafa] mb-2">
                  Unlock Full Wheel &amp; Tire Configurations
                </h3>
                <p className="text-xs text-[#dac1be] mb-6 leading-relaxed">
                  Sign in or create a free account to access custom dimensions, visualizer comparisons, speedometer variance calculations, and direct vehicle compatibility checks.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setIsSelectorOpen(false);
                      setShowLogin(true);
                    }}
                    className="h-11 bg-[#BA2529] hover:bg-[#BA2529]/95 text-white font-bold px-6 rounded-xl text-xs transition-all shadow-lg shadow-[#BA2529]/25"
                  >
                    Sign In / Register
                  </button>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="h-11 bg-[#18181b] hover:bg-[#202023] border border-[#554241] text-[#fafafa] font-bold px-6 rounded-xl text-xs transition-all"
                  >
                    Preview Wheel Size Guide
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0e0e] border border-[#554241] rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-[#e5e2e1]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#fafafa]">Understanding Wheel &amp; Tire Sizes</h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-[#dac1be] hover:text-[#fafafa]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#131313] p-3.5 rounded-lg border border-[#554241] text-center">
                <div className="flex justify-center items-center gap-1.5 text-2xl font-bold text-[#fafafa]">
                  <span className="text-[#BA2529]">205</span>
                  <span className="text-[#554241]">/</span>
                  <span className="text-[#BA2529]">55</span>
                  <span className="text-[#dac1be]">R</span>
                  <span className="text-[#BA2529]">16</span>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[#dac1be]">
                  <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                    <strong className="text-[#BA2529] block mb-0.5">Width</strong>205 mm
                  </div>
                  <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                    <strong className="text-[#BA2529] block mb-0.5">Profile</strong>55%
                  </div>
                  <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                    <strong className="text-[#dac1be] block mb-0.5">Type</strong>Radial
                  </div>
                  <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                    <strong className="text-[#BA2529] block mb-0.5">Diameter</strong>16 in
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
