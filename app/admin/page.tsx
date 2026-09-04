"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Handshake, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Menu,
  HelpCircle,
  MoreVertical,
  Activity,
  Zap,
  FileText,
  CreditCard,
  Layers,
  Car
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function CarDealAdminDashboard() {
  const pathname = usePathname();
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    clients: 842,
    vehicles: 12840,
    pendingRequests: 12,
    revenue: "125k",
    activeSessions: 24,
    servicePartners: 156,
    rentalPartners: 42,
    servicesDelivered: 4820,
    commissionEarnings: "24.5k"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveData() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      try {
        const { count: clientCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
        const { count: reqsCount } = await supabase.from('partner_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        
        setStats(prev => ({
          ...prev,
          clients: clientCount || prev.clients,
          vehicles: vehicleCount || prev.vehicles,
          pendingRequests: reqsCount || prev.pendingRequests,
        }));
      } catch (err) {
        console.error("Error loading live dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, active: true },
    { name: 'Services', href: '/admin/services', icon: FileText },
    { name: 'Customers', href: '/admin/clients', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Partnership Requests', href: '/admin/requests', icon: Handshake },
    { name: 'Settings', href: '/admin/settings', icon: Settings, isBottom: true },
  ];

  return (
    <div className="bg-neutral-950 text-neutral-100 antialiased min-h-screen flex w-full">
      {/* SideNavBar Component */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-neutral-900/90 border-r border-neutral-800 py-6 z-40 backdrop-blur-xl shadow-2xl">
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-red-500 tracking-tight">CarDeal</h1>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest mt-0.5">Precision Admin</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active || pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200 ease-in-out group ${
                  isActive
                    ? 'text-white font-bold border-r-2 border-red-600 bg-red-600/10'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                } ${item.isBottom ? 'mt-auto' : ''}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'group-hover:text-neutral-200'} transition-colors`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA / Footer */}
        <div className="mt-auto px-4 pt-4 border-t border-neutral-800">
          <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 py-2.5 rounded-xl transition-colors text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            Support Portal
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col relative w-full">
        {/* TopNavBar Component */}
        <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 h-16 px-6 flex justify-between items-center">
          <button className="md:hidden text-neutral-400 hover:text-red-500 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-500 transition-colors w-4 h-4" />
              <input 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-neutral-500" 
                placeholder="Search inventory, orders, or customers..." 
                type="text" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-red-500 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <Link href="/admin/settings" className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-red-500 transition-colors hidden sm:flex">
                <Settings className="w-5 h-5" />
              </Link>
            </div>
            <div className="h-8 w-px bg-neutral-800 hidden sm:block"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-neutral-700 bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xs">
                AU
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Admin User</p>
                <p className="text-[11px] text-neutral-400">CarDeal HQ</p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-500 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 md:p-8 mt-16 max-w-[1440px] mx-auto w-full">
          {/* Page Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Overview</h2>
              <p className="text-sm text-neutral-400 mt-1">Real-time performance metrics and operational insights.</p>
            </div>
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1.5">
              <Calendar className="w-4 h-4 text-neutral-400 ml-2" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none text-sm text-white focus:ring-0 cursor-pointer pl-1 pr-6 py-1 appearance-none"
              >
                <option value="today" className="bg-neutral-900">Today</option>
                <option value="7d" className="bg-neutral-900">Last 7 Days</option>
                <option value="30d" className="bg-neutral-900">Last 30 Days</option>
                <option value="ytd" className="bg-neutral-900">Year to Date</option>
              </select>
            </div>
          </div>

          {/* Bento Grid: Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-4">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 hover:border-red-500/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-600/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 text-red-500">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  LIVE
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Active Clients</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.clients}</h3>
                <p className="text-xs text-neutral-500 mt-1">Subscription based</p>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 hover:border-red-500/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-600/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.5%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Monthly Revenue</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.revenue} <span className="text-lg text-neutral-400 font-semibold">DT</span></h3>
                <p className="text-xs text-neutral-500 mt-1">Gross volume</p>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 hover:border-red-500/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-600/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                  <TrendingDown className="w-3.5 h-3.5" /> -1.2%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Pending Requests</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.pendingRequests}</h3>
                <p className="text-xs text-neutral-500 mt-1">Partnership approvals</p>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 hover:border-red-500/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-600/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 text-purple-400">
                  <Car className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">
                  <TrendingUp className="w-3.5 h-3.5" /> +8.4%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Vehicles Managed</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.vehicles.toLocaleString()}</h3>
                <p className="text-xs text-neutral-500 mt-1">Across all regions</p>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-4">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 backdrop-blur-xl">
              <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Service Partners</p>
              <h3 className="text-xl font-bold text-white tracking-tight">{stats.servicePartners}</h3>
              <p className="text-xs text-neutral-500 mt-1">Verified workshops</p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 backdrop-blur-xl">
              <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Rental Partners</p>
              <h3 className="text-xl font-bold text-white tracking-tight">{stats.rentalPartners}</h3>
              <p className="text-xs text-neutral-500 mt-1">Fleet providers</p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 backdrop-blur-xl">
              <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Services Delivered</p>
              <h3 className="text-xl font-bold text-white tracking-tight">{stats.servicesDelivered.toLocaleString()}</h3>
              <p className="text-xs text-neutral-500 mt-1">Total completions</p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-xs font-bold text-red-500 mb-1 uppercase tracking-wider">Commission Earnings</p>
              <h3 className="text-xl font-bold text-white tracking-tight">{stats.commissionEarnings} <span className="text-xs text-neutral-400">DT</span></h3>
              <p className="text-xs text-neutral-500 mt-1">Partner transactions</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Inventory Distribution */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 lg:col-span-1 flex flex-col backdrop-blur-xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-white">Inventory Distribution</h3>
                <button className="text-neutral-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center relative py-6">
                <div className="w-48 h-48 rounded-full border-[16px] border-neutral-800 relative flex items-center justify-center" style={{ borderTopColor: '#dc2626', borderRightColor: '#7f1d1d', borderBottomColor: '#262626', borderLeftColor: '#991b1b', transform: 'rotate(45deg)' }}>
                  <div className="absolute inset-0 m-auto flex flex-col items-center justify-center" style={{ transform: 'rotate(-45deg)' }}>
                    <span className="text-2xl font-extrabold text-white">100%</span>
                    <span className="text-xs text-neutral-400">Total Stock</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-y-2 gap-x-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-xs text-neutral-400">All-Season (40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7f1d1d]"></div>
                  <span className="text-xs text-neutral-400">Performance (30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#991b1b]"></div>
                  <span className="text-xs text-neutral-400">Summer (20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                  <span className="text-xs text-neutral-400">Winter (10%)</span>
                </div>
              </div>
            </div>

            {/* Service Request Volume */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 lg:col-span-2 flex flex-col backdrop-blur-xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-white">Service Request Volume</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">Last 7 Days</span>
                </div>
              </div>
              <div className="flex-1 flex items-end justify-between gap-3 h-52 relative pt-6 px-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 px-2">
                  <div className="w-full h-px bg-neutral-800"></div>
                  <div className="w-full h-px bg-neutral-800"></div>
                  <div className="w-full h-px bg-neutral-800"></div>
                  <div className="w-full h-px bg-neutral-800"></div>
                </div>
                {[
                  { day: 'Mon', val: '40%', count: 12 },
                  { day: 'Tue', val: '60%', count: 18 },
                  { day: 'Wed', val: '90%', count: 28, highlight: true },
                  { day: 'Thu', val: '45%', count: 14 },
                  { day: 'Fri', val: '70%', count: 22 },
                  { day: 'Sat', val: '30%', count: 9 },
                  { day: 'Sun', val: '55%', count: 16 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="absolute -top-6 opacity-0 group-hover:opacity-100 bg-neutral-800 border border-neutral-700 text-white text-[11px] px-2 py-0.5 rounded transition-opacity z-10 font-bold">
                      {item.count}
                    </div>
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-300 bg-gradient-to-t from-red-950 to-red-600 ${item.highlight ? 'shadow-[0_0_20px_rgba(220,38,38,0.5)] ring-1 ring-red-500' : 'opacity-80 group-hover:opacity-100'}`}
                      style={{ height: item.val }}
                    ></div>
                    <span className="text-[11px] text-neutral-400 mt-2 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
