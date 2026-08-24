'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronRight, Disc, Info, X, Car, Search, Move as DragPan, Box as ViewInAr } from 'lucide-react';

export default function TiresPage() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [width, setWidth] = useState<number>(245);
  const [profile, setProfile] = useState<number>(40);
  const [diameter, setDiameter] = useState<number>(19);
  const [offset, setOffset] = useState<number>(40);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'height' | 'diameter' | 'width'>('height');

  // Calculations
  const sidewall = width * (profile / 100);
  const rimMm = diameter * 25.4;
  const overallDiameter = rimMm + (sidewall * 2);
  const circumference = overallDiameter * Math.PI;
  const revsPerMile = 1609344 / circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 bg-[#0a0a0a] text-[#e5e2e1] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-[#353534]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tires Management</h1>
          <p className="text-sm text-[#dac1be] mt-1">Manage tire inventory, stock levels, and technical dimensions.</p>
        </div>

        {/* Highly Visible Action Button */}
        <button
          onClick={() => setIsSelectorOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#BA2529] hover:brightness-110 text-white font-semibold rounded-lg shadow-xl transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Open Wheel & Size Selector</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Quick Access Card Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button 
          onClick={() => setIsSelectorOpen(true)}
          className="text-left bg-[#0e0e0e] border border-[#353534] hover:border-[#BA2529] p-6 rounded-xl transition-all group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#BA2529]/10 flex items-center justify-center text-[#BA2529] mb-4 group-hover:scale-110 transition-transform">
              <Disc className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Size & Fitment Calculator</h3>
            <p className="text-xs text-[#dac1be]">Calculate overall dimensions, sidewall heights, and check clearance compatibility.</p>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[#BA2529]">
            <span>Launch tool</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Main Wheel Selector Modal Overlay */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-[#554241] rounded-2xl max-w-6xl w-full p-6 md:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto my-auto">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsSelectorOpen(false)}
              className="absolute top-6 right-6 text-[#dac1be] hover:text-white p-2 rounded-full bg-[#131313] border border-[#353534] hover:bg-[#353534] transition-colors z-30 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <header className="mb-8 text-center pr-12">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">
                Wheel & Tire Size Selector
              </h2>
              <p className="text-sm text-[#dac1be]">
                Configure your setup to view technical specifications and compatibility.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* 3D Viewer Column */}
              <div className="lg:col-span-7 flex flex-col gap-4 order-1 lg:order-2">
                <div className="relative h-[380px] md:h-[450px] w-full bg-[#0e0e0e] border border-[#554241] rounded-xl flex flex-col overflow-hidden bg-[radial-gradient(#201f1f_1px,transparent_1px)] [background-size:20px_20px]">
                  
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-black/60 backdrop-blur-md p-1 rounded-lg border border-[#554241]">
                    <button
                      onClick={() => setActiveTab('height')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        activeTab === 'height' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                      }`}
                    >
                      Height (Side)
                    </button>
                    <button
                      onClick={() => setActiveTab('diameter')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        activeTab === 'diameter' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                      }`}
                    >
                      Diameter (Front)
                    </button>
                    <button
                      onClick={() => setActiveTab('width')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        activeTab === 'width' ? 'bg-[#BA2529] text-white' : 'text-[#dac1be] hover:text-white'
                      }`}
                    >
                      Width (Tread)
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative">
                      <ViewInAr className="w-20 h-20 text-[#BA2529] opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ViewInAr className="w-10 h-10 text-[#BA2529] animate-pulse" />
                      </div>
                    </div>
                    <p className="mt-4 text-[10px] text-[#dac1be] uppercase tracking-[0.3em] font-bold">
                      Premium 3D Visualization ({activeTab.toUpperCase()})
                    </p>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[#dac1be]/40">
                    <DragPan className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Interactive View</span>
                  </div>
                </div>
              </div>

              {/* Controls Column */}
              <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
                <section className="bg-[#0e0e0e] p-5 rounded-xl border border-[#353534]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-tight">Configuration</h3>
                    <button
                      onClick={() => setIsGuideOpen(true)}
                      className="flex items-center gap-1 text-xs font-bold text-[#BA2529] hover:underline cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" /> Guide des tailles
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-widest text-[#dac1be] font-bold">Width (mm)</label>
                      <select
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full h-10 bg-[#131313] border border-[#554241] text-white rounded-lg px-2 text-sm focus:border-[#BA2529]"
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
                        className="w-full h-10 bg-[#131313] border border-[#554241] text-white rounded-lg px-2 text-sm focus:border-[#BA2529]"
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
                        className="w-full h-10 bg-[#131313] border border-[#554241] text-white rounded-lg px-2 text-sm focus:border-[#BA2529]"
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
                        className="w-full h-10 bg-[#131313] border border-[#554241] text-white rounded-lg px-2 text-sm focus:border-[#BA2529]"
                      >
                        <option value={35}>35</option>
                        <option value={40}>40</option>
                        <option value={45}>45</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#353534] flex flex-col gap-2.5">
                    <button className="w-full h-10 bg-[#BA2529] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer">
                      <Car className="w-4 h-4" /> Check Compatibility
                    </button>
                    <button className="w-full h-10 bg-[#131313] border border-[#554241] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#353534] cursor-pointer">
                      <Search className="w-4 h-4" /> Search Tires
                    </button>
                  </div>
                </section>

                <section className="bg-[#0e0e0e] p-5 rounded-xl border border-[#353534]">
                  <h3 className="text-xs uppercase tracking-widest text-[#dac1be] mb-3 font-bold">Technical Specs</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-[#554241]/30">
                      <span className="text-[#dac1be]">Overall Diameter</span>
                      <span className="font-bold text-white">{overallDiameter.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#554241]/30">
                      <span className="text-[#dac1be]">Sidewall Height</span>
                      <span className="font-bold text-white">{sidewall.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#554241]/30">
                      <span className="text-[#dac1be]">Circumference</span>
                      <span className="font-bold text-white">{circumference.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#dac1be]">Revs per Mile</span>
                      <span className="font-bold text-white">{revsPerMile.toFixed(1)}</span>
                    </div>
                  </div>
                </section>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Guide Modal Sub-view */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0e0e] border border-[#554241] rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-white">Size Guide Breakdown</h4>
              <button onClick={() => setIsGuideOpen(false)} className="text-[#dac1be] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#dac1be] mb-4">
              Standard tire notation uses width, profile, and rim diameter to map structural fitment tolerances.
            </p>
            <button 
              onClick={() => setIsGuideOpen(false)}
              className="w-full py-2 bg-[#BA2529] text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
