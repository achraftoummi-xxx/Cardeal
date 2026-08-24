'use client';

import React from 'react';
import Link from 'next/link';
import WheelSelector from '@/components/wheels/WheelSelector';
import { SlidersHorizontal, ChevronRight, Disc } from 'lucide-react';

export default function TiresPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 bg-[#0a0a0a] text-[#e5e2e1] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-[#353534]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tires Management</h1>
          <p className="text-sm text-[#dac1be] mt-1">Manage tire inventory, stock levels, and technical dimensions.</p>
        </div>

        {/* Permanent Link to Dedicated Wheel Selector Route */}
        <Link
          href="/wheels/selector"
          className="flex items-center gap-2 px-6 py-3.5 bg-[#BA2529] hover:brightness-110 text-white font-semibold rounded-lg shadow-xl transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Open Wheel & Size Selector</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Quick Access Card Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link 
          href="/wheels/selector"
          className="bg-[#0e0e0e] border border-[#353534] hover:border-[#BA2529] p-6 rounded-xl transition-all group flex flex-col justify-between cursor-pointer"
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
        </Link>
      </div>

      {/* Embedded Component Preview Section */}
      <div className="mt-12 pt-8 border-t border-[#353534]">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Interactive Fitment Preview</h2>
            <p className="text-xs text-[#dac1be] mt-1">Direct live view of the Wheel & Tire Size Selector component.</p>
          </div>
          <Link
            href="/wheels/selector"
            className="text-xs font-bold text-[#BA2529] hover:underline flex items-center gap-1"
          >
            <span>Open Fullscreen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="bg-[#0e0e0e] border border-[#353534] rounded-2xl overflow-hidden shadow-2xl">
          <WheelSelector />
        </div>
      </div>
    </div>
  );
}
