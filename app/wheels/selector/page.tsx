'use client';

import React, { useState } from 'react';
import { Info, X, Car, Search, Move as DragPan, Box as ViewInAr } from 'lucide-react';

export default function WheelSelectorPage() {
  const [width, setWidth] = useState<number>(245);
  const [profile, setProfile] = useState<number>(40);
  const [diameter, setDiameter] = useState<number>(19);
  const [offset, setOffset] = useState<number>(40);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'height' | 'diameter' | 'width'>('height');

  // Scientific calculations
  const sidewall = width * (profile / 100);
  const rimMm = diameter * 25.4;
  const overallDiameter = rimMm + (sidewall * 2);
  const circumference = overallDiameter * Math.PI;
  const revsPerMile = 1609344 / circumference;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-10 py-12 bg-[#0a0a0a] text-[#e5e2e1] min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
          Wheel & Tire Size Selector
        </h1>
        <p className="text-base md:text-lg text-[#dac1be]">
          Configure your setup to view technical specifications and compatibility.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right Column (3D Viewer) - Appears first on mobile/tablet */}
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
                Height (Side)
              </button>
              <button
                onClick={() => setActiveTab('diameter')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === 'diameter' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                }`}
              >
                Diameter (Front)
              </button>
              <button
                onClick={() => setActiveTab('width')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === 'width' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                }`}
              >
                Width (Tread)
              </button>
            </div>

            {/* 3D Model Placeholder Container */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <ViewInAr className="w-24 h-24 text-[#BA2529] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ViewInAr className="w-12 h-12 text-[#BA2529] animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-[10px] text-[#dac1be] uppercase tracking-[0.3em] font-bold">
                Premium 3D Visualization ({activeTab.toUpperCase()})
              </p>
            </div>

            {/* Interaction Indicator */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[#dac1be]/40">
              <DragPan className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Interactive View</span>
            </div>
          </div>
        </div>

        {/* Left Column (Configuration & Specs) - Appears second on mobile/tablet */}
        <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
          
          {/* Configuration Card */}
          <section className="bg-[#0e0e0e] p-6 rounded-xl border border-[#353534] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white uppercase tracking-tight">Configuration</h2>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#BA2529] hover:underline cursor-pointer"
              >
                <Info className="w-4 h-4" /> Guide des tailles
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">Width (mm)</label>
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
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">Profile</label>
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
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">Diameter (in)</label>
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
                <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">Offset (ET)</label>
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
                <Car className="w-5 h-5" /> Check Compatibility
              </button>
              <button className="w-full h-12 bg-[#131313] border border-[#554241] text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#353534] transition-all cursor-pointer">
                <Search className="w-5 h-5" /> Search Tires
              </button>
            </div>
          </section>

          {/* Specification Table Card */}
          <section className="bg-[#0e0e0e] p-6 rounded-xl border border-[#353534]">
            <h3 className="text-xs uppercase tracking-widest text-[#dac1be] mb-4 font-bold">Technical Specifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#554241]/30">
                <span className="text-sm text-[#dac1be]">Overall Diameter</span>
                <span className="text-sm font-bold text-white">{overallDiameter.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#554241]/30">
                <span className="text-sm text-[#dac1be]">Sidewall Height</span>
                <span className="text-sm font-bold text-white">{sidewall.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#554241]/30">
                <span className="text-sm text-[#dac1be]">Circumference</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e0e0e] border border-[#554241] rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Understanding Wheel & Tire Sizes</h3>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-[#dac1be] hover:text-white p-2 rounded-full hover:bg-[#353534] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-sm text-[#dac1be]">
              <div className="bg-[#131313] p-4 rounded-lg border border-[#353534] text-center">
                <p className="text-2xl font-bold text-white tracking-widest">
                  <span className="text-[#BA2529]">205</span> / <span className="text-[#BA2529]">55</span> R <span className="text-[#BA2529]">16</span> 87V
                </p>
                <p className="text-xs mt-2 text-[#dac1be]">Standard ETRTO sidewall marking layout breakdown.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#131313] p-4 rounded-lg border border-[#353534]">
                  <h4 className="font-bold text-base mb-1 text-[#BA2529]">Section Width (205)</h4>
                  <p className="text-xs">Nominal section width in millimeters measured across outer to inner sidewalls.</p>
                </div>
                <div className="bg-[#131313] p-4 rounded-lg border border-[#353534]">
                  <h4 className="font-bold text-base mb-1 text-[#BA2529]">Aspect Ratio (55)</h4>
                  <p className="text-xs">Sidewall height as a precise percentage of the total tread width.</p>
                </div>
                <div className="bg-[#131313] p-4 rounded-lg border border-[#353534]">
                  <h4 className="font-bold text-base mb-1 text-[#BA2529]">Radial Construction (R)</h4>
                  <p className="text-xs">Radial ply structure layout aligning internal cords perpendicularly.</p>
                </div>
                <div className="bg-[#131313] p-4 rounded-lg border border-[#353534]">
                  <h4 className="font-bold text-base mb-1 text-[#BA2529]">Rim Diameter (16)</h4>
                  <p className="text-xs">Diameter of the wheel rim bead seat measured directly in inches.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
