'use client';

import React, { useState, useEffect } from 'react';
import { Info, X, Car, Search, Move as DragPan, Box as ViewInAr, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';
import dynamic from 'next/dynamic';

const WheelViewer3D = dynamic(() => import('./WheelViewer3D'), {
  ssr: false,
});

interface WheelSpecs {
  width: number;
  profile: number;
  diameter: number;
  offset: number;
}

export default function WheelSelector() {
  const { t } = useTranslation();
  const [width, setWidth] = useState<number>(245);
  const [profile, setProfile] = useState<number>(40);
  const [diameter, setDiameter] = useState<number>(19);
  const [offset, setOffset] = useState<number>(40);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'height' | 'diameter' | 'width'>('height');
  const [backHref, setBackHref] = useState<string>('/pneus');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('from') === 'dashboard') {
        setBackHref('/dashboard/pneus');
      }
    }
  }, []);

  // Scientific calculations
  const sidewall = width * (profile / 100);
  const rimMm = diameter * 25.4;
  const overallDiameter = rimMm + (sidewall * 2);
  const circumference = overallDiameter * Math.PI;
  const revsPerMile = 1609344 / circumference; // approximate mm per mile

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 bg-[#0a0a0a] text-[#e5e2e1] antialiased">
      {/* Header */}
      <header className="mb-12 relative text-center">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-[#BA2529] hover:underline text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
             <span>{t('wheelSelector.back')}</span>
          </Link>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
          {t('wheelSelector.title')}
        </h1>
        <p className="text-base md:text-lg text-[#dac1be]">
          {t('wheelSelector.subtitle')}
        </p>
      </header>

      {/* Main Grid: 3D Preview comes first on mobile/tablet via flex-col-reverse or CSS order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right Column (3D Viewer) - Appears FIRST on mobile/tablet */}
        <div className="lg:col-span-7 flex flex-col gap-4 order-1 lg:order-2">
          <div className="relative h-[450px] md:h-[500px] w-full bg-[#0e0e0e] border border-[#554241] rounded-xl flex flex-col overflow-hidden bg-[radial-gradient(#201f1f_1px,transparent_1px)] [background-size:20px_20px]">
            
            {/* Segmented Toggle Tabs */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-black/60 backdrop-blur-md p-1 rounded-lg border border-[#554241]">
              <button
                onClick={() => setActiveTab('height')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === 'height' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                }`}
              >
                {t('wheelSelector.viewHeightSide')}
              </button>
              <button
                onClick={() => setActiveTab('diameter')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === 'diameter' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                }`}
              >
                {t('wheelSelector.viewDiameterFront')}
              </button>
              <button
                onClick={() => setActiveTab('width')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === 'width' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                }`}
              >
                {t('wheelSelector.viewWidthTread')}
              </button>
            </div>

            {/* 3D Model Viewer Component */}
            <div className="flex-1 w-full h-full relative">
              <WheelViewer3D width={width} profile={profile} diameter={diameter} offset={offset} />
            </div>

            {/* Interaction Indicator */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[#dac1be]/40">
              <DragPan className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Interactive View</span>
            </div>
          </div>
        </div>

        {/* Left Column (Configuration & Specs) - Appears SECOND on mobile/tablet */}
        <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
          
          {/* Configuration Card */}
          <section className="bg-[#0e0e0e] p-6 rounded-xl border border-[#353534] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white uppercase tracking-tight">{t('wheelSelector.configuration')}</h2>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#BA2529] hover:underline cursor-pointer"
              >
                <Info className="w-4 h-4" /> {t('wheelSelector.sizeGuide')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">{t('wheelSelector.widthMm')}</label>
                <select
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-12 bg-[#131313] border border-[#554241] text-white rounded-lg px-3 focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
                >
                  <option value={195}>195</option>
                  <option value={205}>205</option>
                  <option value={225}>225</option>
                  <option value={245}>245</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">{t('wheelSelector.profile')}</label>
                <select
                  value={profile}
                  onChange={(e) => setProfile(Number(e.target.value))}
                  className="w-full h-12 bg-[#131313] border border-[#554241] text-white rounded-lg px-3 focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
                >
                  <option value={35}>35</option>
                  <option value={40}>40</option>
                  <option value={55}>55</option>
                  <option value={65}>65</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">{t('wheelSelector.diameterIn')}</label>
                <select
                  value={diameter}
                  onChange={(e) => setDiameter(Number(e.target.value))}
                  className="w-full h-12 bg-[#131313] border border-[#554241] text-white rounded-lg px-3 focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
                >
                  <option value={15}>15</option>
                  <option value={16}>16</option>
                  <option value={17}>17</option>
                  <option value={18}>18</option>
                  <option value={19}>19</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">{t('wheelSelector.offsetEt')}</label>
                <select
                  value={offset}
                  onChange={(e) => setOffset(Number(e.target.value))}
                  className="w-full h-12 bg-[#131313] border border-[#554241] text-white rounded-lg px-3 focus:border-[#BA2529] focus:ring-1 focus:ring-[#BA2529]"
                >
                  <option value={35}>35</option>
                  <option value={40}>40</option>
                  <option value={45}>45</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#353534] flex flex-col gap-3">
              <button className="w-full h-12 bg-[#BA2529] text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer">
                <Car className="w-5 h-5" /> {t('wheelSelector.checkCompatibility')}
              </button>
              <button className="w-full h-12 bg-[#131313] border border-[#554241] text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#353534] transition-all cursor-pointer">
                <Search className="w-5 h-5" /> {t('wheelSelector.searchTires')}
              </button>
            </div>
          </section>

          {/* Specification Table Card */}
          <section className="bg-[#0e0e0e] p-6 rounded-xl border border-[#353534]">
            <h3 className="text-xs uppercase tracking-widest text-[#dac1be] mb-4 font-bold">{t('wheelSelector.specification')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#554241]/30">
                <span className="text-sm text-[#dac1be]">{t('wheelSelector.rows.overallDiameter')}</span>
                <span className="text-sm font-bold text-white">{overallDiameter.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#554241]/30">
                <span className="text-sm text-[#dac1be]">{t('wheelSelector.rows.sidewall')}</span>
                <span className="text-sm font-bold text-white">{sidewall.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#554241]/30">
                <span className="text-sm text-[#dac1be]">{t('wheelSelector.rows.circumference')}</span>
                <span className="text-sm font-bold text-white">{circumference.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-[#dac1be]">Revs per Mile</span>
                <span className="text-sm font-bold text-white">{revsPerMile.toFixed(1)}</span>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Size Guide Modal Overlay */}
      {isGuideOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#e5e2e1]">
          {/* Modal Container */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col my-4 max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsGuideOpen(false)}
              aria-label="Close modal"
              className="absolute top-3 right-3 z-50 p-2 text-[#71717a] hover:text-[#fafafa] hover:bg-[#2a2a2a] rounded-full transition-colors duration-200 hover:rotate-90 transition-transform duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
            </button>
            {/* Modal Header / Hero */}
            <div className="relative w-full h-48 md:h-56 bg-[#0e0e0e] border-b border-[#27272a] overflow-hidden group flex-shrink-0">
              <img
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
                src="/assets/images/wheel-bg.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/50 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-4 md:px-10 text-center z-10">
                <h1 className="text-[24px] md:text-[28px] leading-[1.2] font-semibold text-[#fafafa] mb-1 drop-shadow-md">Comprendre les dimensions</h1>
                {/* Glowing Code Snippet */}
                <div className="mt-2 bg-[#0a0a0a]/80 backdrop-blur-md border border-[#BA2529]/30 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(186,37,41,0.2)]">
                  <div className="flex items-center gap-2 text-2xl md:text-4xl font-bold tracking-tighter">
                    <span className="bg-[#BA2529]/20 text-[#ffb3ae] px-2.5 py-0.5 rounded-full border border-[#BA2529]/30">195</span>
                    <span className="text-[#71717a]">/</span>
                    <span className="bg-[#BA2529]/20 text-[#ffb3ae] px-2.5 py-0.5 rounded-full border border-[#BA2529]/30">55</span>
                    <span className="text-[#fafafa] mx-1">R</span>
                    <span className="bg-[#BA2529]/20 text-[#ffb3ae] px-2.5 py-0.5 rounded-full border border-[#BA2529]/30">16</span>
                    <span className="bg-[#BA2529]/20 text-[#ffb3ae] px-2.5 py-0.5 rounded-full border border-[#BA2529]/30">87</span>
                    <span className="text-[#fafafa] ml-1">V</span>
                  </div>
                </div>
                <p className="text-[11px] leading-none tracking-[0.1em] font-bold text-[#71717a] mt-2 uppercase">Exemple de marquage standard sur le flanc</p>
              </div>
            </div>
            {/* Modal Body (Grid) */}
            <div className="p-4 md:p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="bg-[#131313]/40 backdrop-blur-md border border-[#27272a]/50 rounded-xl p-4 hover:border-[#BA2529]/40 hover:shadow-[0_0_20px_rgba(186,37,41,0.15)] hover:scale-[1.01] transition-all duration-300 flex flex-col group/card">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center border border-[#27272a] text-[#BA2529] flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">straighten</span>
                    </div>
                    <div>
                      <span className="text-[11px] leading-none tracking-[0.15em] font-bold text-[#dac1be] block">LARGEUR</span>
                      <span className="text-[20px] leading-[1.3] text-[#fafafa] font-bold tracking-tight drop-shadow-[0_0_8px_rgba(255,179,174,0.3)]">195</span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-[#dac1be] flex-grow border-t border-[#27272a]/50 mt-3 pt-3">Largeur nominale de boudin (en mm) : distance maximale entre les flancs externe et interne d'un pneu gonflé, hors marquages de protection.</p>
                </div>
                {/* Card 2 */}
                <div className="bg-[#131313]/40 backdrop-blur-md border border-[#27272a]/50 rounded-xl p-4 hover:border-[#BA2529]/40 hover:shadow-[0_0_20px_rgba(186,37,41,0.15)] hover:scale-[1.01] transition-all duration-300 flex flex-col group/card">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center border border-[#27272a] text-[#BA2529] flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">height</span>
                    </div>
                    <div>
                      <span className="text-[11px] leading-none tracking-[0.15em] font-bold text-[#dac1be] block">PROFIL</span>
                      <span className="text-[20px] leading-[1.3] text-[#fafafa] font-bold tracking-tight drop-shadow-[0_0_8px_rgba(255,179,174,0.3)]">55</span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-[#dac1be] flex-grow border-t border-[#27272a]/50 mt-3 pt-3">Rapport d'aspect (Série) : hauteur de flanc exprimée en pourcentage exact de la largeur de boudin (55% de 195 mm = 107.25 mm). Indique la hauteur du flanc.</p>
                </div>
                {/* Card 3 */}
                <div className="bg-[#131313]/40 backdrop-blur-md border border-[#27272a]/50 rounded-xl p-4 hover:border-[#BA2529]/40 hover:shadow-[0_0_20px_rgba(186,37,41,0.15)] hover:scale-[1.01] transition-all duration-300 flex flex-col group/card">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center border border-[#27272a] text-[#BA2529] flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">layers</span>
                    </div>
                    <div>
                      <span className="text-[11px] leading-none tracking-[0.15em] font-bold text-[#dac1be] block">STRUCTURE</span>
                      <span className="text-[20px] leading-[1.3] text-[#fafafa] font-bold tracking-tight drop-shadow-[0_0_8px_rgba(255,179,174,0.3)]">R</span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-[#dac1be] flex-grow border-t border-[#27272a]/50 mt-3 pt-3">Type de construction : 'R' désigne une structure radiale, où les câbles de la carcasse sont disposés perpendiculairement à la direction du mouvement (à 90° de l'axe longitudinal).</p>
                </div>
                {/* Card 4 */}
                <div className="bg-[#131313]/40 backdrop-blur-md border border-[#27272a]/50 rounded-xl p-4 hover:border-[#BA2529]/40 hover:shadow-[0_0_20px_rgba(186,37,41,0.15)] hover:scale-[1.01] transition-all duration-300 flex flex-col group/card">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center border border-[#27272a] text-[#BA2529] flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">radio_button_unchecked</span>
                    </div>
                    <div>
                      <span className="text-[11px] leading-none tracking-[0.15em] font-bold text-[#dac1be] block">DIAMÈTRE JANTE</span>
                      <span className="text-[20px] leading-[1.3] text-[#fafafa] font-bold tracking-tight drop-shadow-[0_0_8px_rgba(255,179,174,0.3)]">16"</span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-[#dac1be] flex-grow border-t border-[#27272a]/50 mt-3 pt-3">Diamètre nominal de la jante : diamètre du siège de la jante exprimé en pouces (correspondant au diamètre intérieur du pneu).</p>
                </div>
                {/* Card 5 */}
                <div className="bg-[#131313]/40 backdrop-blur-md border border-[#27272a]/50 rounded-xl p-4 hover:border-[#BA2529]/40 hover:shadow-[0_0_20px_rgba(186,37,41,0.15)] hover:scale-[1.01] transition-all duration-300 flex flex-col group/card">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center border border-[#27272a] text-[#BA2529] flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">weight</span>
                    </div>
                    <div>
                      <span className="text-[11px] leading-none tracking-[0.15em] font-bold text-[#dac1be] block">CHARGE</span>
                      <span className="text-[20px] leading-[1.3] text-[#fafafa] font-bold tracking-tight drop-shadow-[0_0_8px_rgba(255,179,174,0.3)]">87</span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-[#dac1be] flex-grow border-t border-[#27272a]/50 mt-3 pt-3">Indice de capacité de charge : code numérique standardisé (ex: 87 = 545 kg maximum par pneu sous charge statique maximale).</p>
                </div>
                {/* Card 6 */}
                <div className="bg-[#131313]/40 backdrop-blur-md border border-[#27272a]/50 rounded-xl p-4 hover:border-[#BA2529]/40 hover:shadow-[0_0_20px_rgba(186,37,41,0.15)] hover:scale-[1.01] transition-all duration-300 flex flex-col group/card">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center border border-[#27272a] text-[#BA2529] flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">speed</span>
                    </div>
                    <div>
                      <span className="text-[11px] leading-none tracking-[0.15em] font-bold text-[#dac1be] block">VITESSE</span>
                      <span className="text-[20px] leading-[1.3] text-[#fafafa] font-bold tracking-tight drop-shadow-[0_0_8px_rgba(255,179,174,0.3)]">V</span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-[#dac1be] flex-grow border-t border-[#27272a]/50 mt-3 pt-3">Code de catégorie de vitesse : lettre indiquant la vitesse maximale admissible en toute sécurité (ex: V = jusqu'à 240 km/h).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
