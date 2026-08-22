"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import { useTranslation } from "@/components/TranslationProvider";

export default function WheelTireSizeSelectorPage() {
  const { authed, loading } = useAuth();

  return (
    <WheelTireSizeSelector 
      isAuthenticated={authed} 
      isLoadingAuth={loading} 
    />
  );
}

function WheelTireSizeSelector({
  isAuthenticated,
  isLoadingAuth,
}: {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
}) {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);

  // State for Configuration
  const [width, setWidth] = useState("245");
  const [profile, setProfile] = useState("40");
  const [diameter, setDiameter] = useState("19");
  const [offset, setOffset] = useState("40");

  // State for Compare Mode
  const [isCompare, setIsCompare] = useState(false);
  const [compareWidth, setCompareWidth] = useState("265");
  const [compareProfile, setCompareProfile] = useState("40");
  const [compareDiameter, setCompareDiameter] = useState("20");
  const [compareOffset, setCompareOffset] = useState("40");

  // View state for visualizer
  const [activeView, setActiveView] = useState<"height" | "diameter" | "width">("height");

  // Modal State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Calculations
  const wNum = parseFloat(width);
  const pNum = parseFloat(profile);
  const dNum = parseFloat(diameter);

  const sidewall = (wNum * (pNum / 100)).toFixed(1);
  const rimMm = (dNum * 25.4).toFixed(1);
  const overallDiameter = (parseFloat(rimMm) + parseFloat(sidewall) * 2).toFixed(1);
  const circumference = (parseFloat(overallDiameter) * Math.PI).toFixed(1);

  // Compare calculations if active
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

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 text-[#e5e2e1] antialiased bg-background min-h-screen">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-3 text-[#fafafa]">
            Wheel &amp; Tire Size Selector
          </h1>
          <p className="text-lg text-[#dac1be] font-['Manrope']">
            Configure your setup to view technical specifications and compatibility.
          </p>
        </header>

        {isLoadingAuth ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#554241] border-t-[#BA2529]" />
            <p className="mt-4 text-sm text-[#dac1be]">Checking session...</p>
          </div>
        ) : isAuthenticated ? (
          /* Main Grid for Authenticated Users */
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
            
            {/* Left Side: Controls & Specs Table */}
            <section className="lg:col-span-5 flex flex-col gap-6 bg-[#0e0e0e] p-6 rounded-lg border border-[#353534] shadow-sm relative z-10 order-1">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h2 className="text-2xl font-semibold font-['Space_Grotesk'] text-[#fafafa]">Configuration</h2>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="ml-auto mr-4 flex items-center gap-1 text-xs font-bold tracking-widest text-[#BA2529] hover:underline"
                >
                  <span className="material-symbols-outlined text-lg">help</span>Size Guide
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
                    <div className={`block w-10 h-6 rounded-full transition-colors ${isCompare ? "bg-[#8e1c21]" : "bg-[#353534]"}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCompare ? "translate-x-4" : ""}`}></div>
                  </div>
                </label>
              </div>

              {/* Current Setup */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-[#BA2529] uppercase font-['Manrope']">Current Setup</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Width (mm)</label>
                    <select
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
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
                    <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Profile</label>
                    <select
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
                    >
                      <option>30</option>
                      <option>35</option>
                      <option>40</option>
                      <option>45</option>
                      <option>50</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Diameter (in)</label>
                    <select
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
                    >
                      {[...Array(21)].map((_, i) => {
                        const val = i + 10;
                        return <option key={val} value={val}>{val}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Offset (ET)</label>
                    <select
                      value={offset}
                      onChange={(e) => setOffset(e.target.value)}
                      className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
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
                <div className="space-y-4 pt-4 border-t border-[#554241] transition-all">
                  <h3 className="text-sm font-semibold tracking-wider text-[#f5504d] uppercase font-['Manrope']">New Setup</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Width (mm)</label>
                      <select
                        value={compareWidth}
                        onChange={(e) => setCompareWidth(e.target.value)}
                        className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#f5504d] focus:ring-1 focus:ring-[#f5504d]"
                      >
                        <option>245</option>
                        <option>265</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Profile</label>
                      <select
                        value={compareProfile}
                        onChange={(e) => setCompareProfile(e.target.value)}
                        className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#f5504d] focus:ring-1 focus:ring-[#f5504d]"
                      >
                        <option>35</option>
                        <option>40</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Diameter (in)</label>
                      <select
                        value={compareDiameter}
                        onChange={(e) => setCompareDiameter(e.target.value)}
                        className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#f5504d] focus:ring-1 focus:ring-[#f5504d]"
                      >
                        <option>19</option>
                        <option>20</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#dac1be] mb-2">Offset (ET)</label>
                      <select
                        value={compareOffset}
                        onChange={(e) => setCompareOffset(e.target.value)}
                        className="w-full h-12 bg-[#131313] border border-[#554241] text-[#e5e2e1] rounded-lg px-3 cursor-pointer focus:border-[#f5504d] focus:ring-1 focus:ring-[#f5504d]"
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

              {/* Info Panel Table */}
              <div className="border border-[#554241] rounded-lg overflow-hidden bg-[#131313]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c1b1b] border-b border-[#554241]">
                      <th className="py-2 px-3 text-xs font-bold tracking-wider text-[#dac1be]">Specification</th>
                      <th className="py-2 px-3 text-xs font-bold tracking-wider text-[#dac1be]">Value</th>
                      {isCompare && <th className="py-2 px-3 text-xs font-bold tracking-wider text-[#f5504d]">New Value</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#554241] text-sm">
                    <tr>
                      <td className="py-2 px-3 text-[#dac1be]">Width</td>
                      <td className="py-2 px-3 text-[#fafafa] font-semibold">{width} mm</td>
                      {isCompare && <td className="py-2 px-3 text-[#f5504d] font-semibold">{compareWidth} mm</td>}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-[#dac1be]">Sidewall</td>
                      <td className="py-2 px-3 text-[#fafafa] font-semibold">{sidewall} mm</td>
                      {isCompare && <td className="py-2 px-3 text-[#f5504d] font-semibold">{compSidewall} mm</td>}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-[#dac1be]">Rim Diameter</td>
                      <td className="py-2 px-3 text-[#fafafa] font-semibold">{diameter}" ({rimMm} mm)</td>
                      {isCompare && <td className="py-2 px-3 text-[#f5504d] font-semibold">{compareDiameter}" ({compRimMm} mm)</td>}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-[#dac1be]">Overall Diameter</td>
                      <td className="py-2 px-3 text-[#fafafa] font-semibold">{overallDiameter} mm</td>
                      {isCompare && <td className="py-2 px-3 text-[#f5504d] font-semibold">{compOverall} mm</td>}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-[#dac1be]">Circumference</td>
                      <td className="py-2 px-3 text-[#fafafa] font-semibold">{circumference} mm</td>
                      {isCompare && <td className="py-2 px-3 text-[#f5504d] font-semibold">{compCircum} mm</td>}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button className="w-full h-12 bg-[#BA2529] hover:bg-[#BA2529]/90 text-white text-sm font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined">directions_car</span>
                  Check compatibility with my vehicle
                </button>
                <a href="/pneus" className="w-full h-12 bg-[#131313] hover:bg-[#1c1b1b] border border-[#a28b8a] text-[#fafafa] text-sm font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined">search</span>
                  Search tires in this size
                </a>
              </div>
            </section>

            {/* Right Side: Visualizer */}
            <section className="lg:col-span-7 flex flex-col bg-[#0e0e0e] rounded-lg overflow-hidden relative min-h-[500px] lg:min-h-[600px] border border-[#353534] shadow-sm order-2 bg-gradient-to-b from-[#0e0e0e] to-[#131313]">
              {/* View Selector Tabs */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-[#0e0e0e] p-1 rounded-lg border border-[#554241] shadow-sm flex gap-1">
                <button
                  onClick={() => setActiveView("height")}
                  className={`px-4 py-2 rounded-md text-xs font-bold tracking-wider transition-colors ${activeView === "height" ? "bg-[#BA2529] text-white" : "text-[#dac1be] hover:bg-[#1c1b1b]"}`}
                >
                  Height (Side)
                </button>
                <button
                  onClick={() => setActiveView("diameter")}
                  className={`px-4 py-2 rounded-md text-xs font-bold tracking-wider transition-colors ${activeView === "diameter" ? "bg-[#BA2529] text-white" : "text-[#dac1be] hover:bg-[#1c1b1b]"}`}
                >
                  Diameter (Front)
                </button>
                <button
                  onClick={() => setActiveView("width")}
                  className={`px-4 py-2 rounded-md text-xs font-bold tracking-wider transition-colors ${activeView === "width" ? "bg-[#BA2529] text-white" : "text-[#dac1be] hover:bg-[#1c1b1b]"}`}
                >
                  Width (Tread)
                </button>
              </div>

              {/* Visualization Canvas Area */}
              <div className="relative flex-1 flex items-center justify-center p-8 overflow-hidden">
                {activeView === "height" && (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="text-center flex flex-col items-center">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXEcMX1ADHfq2E4jo-L99t3dN5saYVqQs8rQAoo_J3cHxTHbqkprRmi0IPuPZZL2q1pis3l_eqkfccXTrIH4XycILxMh5f9IgfqdNcDxJz70sAqQYtw_TLCxUFVbdJmbkTAqbm3eYeu_0EKJ7DkxLuif7GTWTBRs_pnFvVzqVPGi4vv4KMAVv9TfMQ0Ccz1aTbqagJ2Mv5JqGD2tSe5VisTHOb6oJbL1hpVoqcWe4zV1Gto2-0_Ycum45w8d9F59UvkfU"
                        alt="Wheel Side Profile"
                        className="max-h-[350px] object-contain drop-shadow-2xl"
                      />
                      <div className="mt-4 bg-[#18181b] border border-[#554241] px-4 py-2 rounded-lg text-sm">
                        <span className="text-[#BA2529] font-bold">Overall Diameter:</span> {overallDiameter} mm | <span className="text-[#BA2529] font-bold">Sidewall:</span> {sidewall} mm
                      </div>
                    </div>
                  </div>
                )}

                {activeView === "diameter" && (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="text-center flex flex-col items-center">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCewFIDL0pmcUvrXEnh1I9UiK7XnaaC-ivEUMdHkHQhhxVyXq88A_d6cdfGKiiJ3qmUCWtOb8b9fABMH9JGmB8rOXqXr_mmB23zknPihtJWDbyVdCFpw1rpZlWbu9DOeTKalDHMVxuAvrLTn8VfCrZlw2RrWpvmEa1HcUoan4JUlUvXM1I0BN-kuDAJRZoTlcME2OoYjc9cZASE1Hk5M9OjLziKreFHHlrwqG1ZFxl_QZllbt3J79SUblAYF5ou-1BjYio"
                        alt="Wheel Front View"
                        className="max-h-[350px] object-contain drop-shadow-2xl"
                      />
                      <div className="mt-4 bg-[#18181b] border border-[#554241] px-4 py-2 rounded-lg text-sm">
                        <span className="text-[#BA2529] font-bold">Rim Diameter:</span> {diameter}" ({rimMm} mm)
                      </div>
                    </div>
                  </div>
                )}

                {activeView === "width" && (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="text-center flex flex-col items-center">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzG_XP5LcgXPOmwyufYX0C_x8R1lcd5YqjtLB5ekVgCm5OuD9tj7BqfwqVFSYipRciAy59IDnh9TG_y07XlVyh_uG2kBmWaKuBOFT0ctbXClpifN1Kmjs1InQQ5LeDByLACuZGsDIehcjE1VZaKFzIfoI_vqWCZdeY1NEk3b9tCxQ_UuCteM_4jzmtRiKECtH4Mv_yFISQrTzHucP5gm8BEurd9kHi4JSVLE4IssiKo7NzmFbbt6703h2H829ComB-oRA"
                        alt="Tire Tread View"
                        className="max-h-[350px] object-contain drop-shadow-2xl"
                      />
                      <div className="mt-4 bg-[#18181b] border border-[#554241] px-4 py-2 rounded-lg text-sm">
                        <span className="text-[#BA2529] font-bold">Tread Width:</span> {width} mm
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Compare Variance Banner */}
              {isCompare && (
                <div className="absolute bottom-6 left-6 right-6 z-30 bg-[#18181b]/90 backdrop-blur-md rounded-lg p-4 flex justify-between items-center border border-[#554241]">
                  <div className="flex items-center gap-2 text-[#BA2529]">
                    <span className="material-symbols-outlined">speed</span>
                    <span className="text-sm font-bold tracking-wider">Speedometer Variance:</span>
                  </div>
                  <span className="text-xl font-bold text-[#fafafa]">{speedVariance}%</span>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Guest Access Restriction View */
          <div className="flex flex-col items-center justify-center bg-[#0e0e0e] border border-[#353534] rounded-2xl p-10 text-center shadow-xl max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-[#BA2529]/10 text-[#BA2529] flex items-center justify-center mb-6 ring-1 ring-[#BA2529]/20">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#fafafa] mb-3">
              Unlock Full Wheel &amp; Tire Configurations
            </h2>
            <p className="text-sm text-[#dac1be] mb-8 leading-relaxed">
              Sign in or create a free account to access custom dimensions, visualizer comparisons, speedometer variance calculations, and direct vehicle compatibility checks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowLogin(true)}
                className="h-12 bg-[#BA2529] hover:bg-[#BA2529]/95 text-white font-bold px-8 rounded-xl transition-all shadow-lg shadow-[#BA2529]/25"
              >
                Sign In / Register
              </button>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="h-12 bg-[#131313] hover:bg-[#1c1b1b] border border-[#554241] text-[#fafafa] font-bold px-8 rounded-xl transition-all"
              >
                Preview Wheel Size Guide
              </button>
            </div>
          </div>
        )}

        {/* Size Guide Modal with Non-Clipped Inline Definition Panel */}
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0e0e0e] border border-[#554241] rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#fafafa]">Understanding Wheel &amp; Tire Sizes</h3>
                <button onClick={() => setIsSizeGuideOpen(false)} className="text-[#dac1be] hover:text-[#fafafa]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Nomenclature Explanation Box */}
                <div className="bg-[#131313] p-4 rounded-lg border border-[#554241]">
                  <div className="flex justify-center items-center gap-2 text-2xl md:text-3xl font-bold text-[#fafafa] flex-wrap">
                    <span className="text-[#BA2529]">205</span>
                    <span className="text-[#554241]">/</span>
                    <span className="text-[#BA2529]">55</span>
                    <span className="text-[#dac1be]">R</span>
                    <span className="text-[#BA2529]">16</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center text-[#dac1be]">
                    <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                      <strong className="text-[#BA2529] block mb-1">Tire Width</strong>205 mm
                    </div>
                    <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                      <strong className="text-[#BA2529] block mb-1">Aspect Ratio</strong>55% of width
                    </div>
                    <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                      <strong className="text-[#dac1be] block mb-1">Construction</strong>Radial
                    </div>
                    <div className="bg-[#18181b] p-2 rounded border border-[#554241]">
                      <strong className="text-[#BA2529] block mb-1">Rim Diameter</strong>16 inches
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#dac1be]">
                  <div className="bg-[#131313] border border-[#554241] rounded-lg p-4 flex flex-col items-center text-center">
                    <h4 className="font-bold text-[#BA2529] mb-2">Tread Width</h4>
                    <p className="text-xs">Width in millimeters from sidewall to sidewall.</p>
                  </div>
                  <div className="bg-[#131313] border border-[#554241] rounded-lg p-4 flex flex-col items-center text-center">
                    <h4 className="font-bold text-[#BA2529] mb-2">Sidewall</h4>
                    <p className="text-xs">Calculated as Width × Aspect Ratio percentage.</p>
                  </div>
                  <div className="bg-[#131313] border border-[#554241] rounded-lg p-4 flex flex-col items-center text-center">
                    <h4 className="font-bold text-[#BA2529] mb-2">Rim Dia.</h4>
                    <p className="text-xs">Diameter of the wheel rim in inches.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <PartnerModal open={showPartner} onClose={() => setShowPartner(false)} />
    </div>
  );
}
