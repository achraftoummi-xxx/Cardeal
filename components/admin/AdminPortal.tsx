'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Handshake, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown, 
  Calendar, 
  Menu, 
  HelpCircle, 
  Gauge, 
  CreditCard, 
  Car, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  Activity, 
  ArrowLeft,
  Layers
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'clients' | 'vehicles' | 'logs'>('overview');
  
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ 
    clients: 842, 
    vehicles: 12840, 
    pending: 12, 
    activeSessions: 24,
    revenue: "125k",
    servicePartners: 156,
    rentalPartners: 42,
    servicesDelivered: 4820,
    commissionEarnings: "24.5k"
  });
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  async function fetchAdminData() {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setPendingRequests([
        { id: '1-mock', company_name: 'Garage Al-Amine', email: 'amine@garage.tn', category: 'Mécanique générale', status: 'pending', created_at: new Date().toISOString() },
        { id: '2-mock', company_name: 'Electro-Auto Tunis', email: 'contact@electroauto.tn', category: 'Électricité & Diagnostic', status: 'pending', created_at: new Date().toISOString() }
      ]);
      setClients([
        { id: 'c1', email: 'mokhtari.achref06@gmail.com', role: 'admin', created_at: new Date().toISOString() },
        { id: 'c2', email: 'toumiachref21@gmail.com', role: 'admin', created_at: new Date().toISOString() },
        { id: 'c3', email: 'client.tunis@cardeal.tn', role: 'client', created_at: new Date().toISOString() }
      ]);
      setVehicles([
        { id: 'v1', brand: 'Toyota', model: 'Corolla', year: 2022, health_score: 94, owner_email: 'client.tunis@cardeal.tn', history: [{ date: '2026-02-10', service: 'Vidange & Filtres', status: 'Complété' }] },
        { id: 'v2', brand: 'Volkswagen', model: 'Golf 7', year: 2019, health_score: 82, owner_email: 'client.tunis@cardeal.tn', history: [{ date: '2026-01-15', service: 'Remplacement Plaquettes de Frein', status: 'Complété' }] }
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data: requests } = await supabase.from('partner_requests').select('*').eq('status', 'pending');
      const { data: clientData, count: clientCount } = await supabase.from('profiles').select('*', { count: 'exact' });
      const { data: vehicleData, count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact' });

      setPendingRequests(requests || []);
      setClients(clientData || []);
      setVehicles(vehicleData || []);
      setMetrics(prev => ({
        ...prev,
        clients: clientCount || clientData?.length || prev.clients,
        vehicles: vehicleCount || vehicleData?.length || prev.vehicles,
        pending: requests?.length || prev.pending,
      }));
    } catch (err) {
      console.error("Error loading portal data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePartnerAction(requestId: string, email: string, category: string, action: 'accept' | 'denied') {
    if (!isSupabaseConfigured || !supabase) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      return;
    }
    if (action === 'accept') {
      await supabase.from('partner_requests').update({ status: 'accepted' }).eq('id', requestId);
      await supabase.from('profiles').update({ role: 'partner', category }).eq('email', email);
    } else {
      await supabase.from('partner_requests').update({ status: 'denied' }).eq('id', requestId);
    }
    fetchAdminData();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/85 backdrop-blur-md animate-fadeIn overflow-x-hidden text-foreground">
      {/* SideNavBar Component */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-card border-r border-border py-6 z-40 backdrop-blur-xl shadow-sm">
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[--radius] bg-[var(--cardeal-primary)]/15 flex items-center justify-center text-[var(--cardeal-primary)]">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--cardeal-primary)] tracking-tight font-['Space_Grotesk']">CarDeal</h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">Precision Admin</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[--radius] transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'overview'
                ? 'text-foreground font-bold border-r-2 border-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'overview' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[--radius] transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'requests'
                ? 'text-foreground font-bold border-r-2 border-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Handshake className={`w-5 h-5 ${activeTab === 'requests' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm">Partnership Requests ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[--radius] transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'clients'
                ? 'text-foreground font-bold border-r-2 border-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'clients' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm">Customers ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[--radius] transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'vehicles'
                ? 'text-foreground font-bold border-r-2 border-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Car className={`w-5 h-5 ${activeTab === 'vehicles' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm">Fleet & Vehicles</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[--radius] transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'logs'
                ? 'text-foreground font-bold border-r-2 border-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <FileText className={`w-5 h-5 ${activeTab === 'logs' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm">System Logs</span>
          </button>
        </div>

        {/* CTA / Footer */}
        <div className="mt-auto px-4 pt-4 border-t border-border">
          <button onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-accent text-foreground border border-border py-2.5 rounded-[--radius] transition-colors text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Close Portal
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col relative w-full bg-background overflow-y-auto">
        {/* TopNavBar Component */}
        <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-50 bg-card/80 backdrop-blur-md border-b border-border h-16 px-6 flex justify-between items-center">
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-[var(--cardeal-primary)] transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[var(--cardeal-primary)] transition-colors w-4 h-4" />
              <input 
                className="w-full bg-background border border-border rounded-[--radius] pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--cardeal-primary)] focus:ring-1 focus:ring-[var(--cardeal-primary)] transition-all placeholder:text-muted-foreground" 
                placeholder="Search inventory, orders, or customers..." 
                type="text" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-[var(--cardeal-primary)] transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--cardeal-primary)] rounded-full"></span>
              </button>
              <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-[var(--cardeal-primary)] transition-colors">
                ✕
              </button>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block"></div>
            <div className="flex items-center gap-2.5">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqFp7-6HB3OaQeH219Wb1nZOWqBZ5rAbv8CZToBJ-vcR-Cx40iwQZ-A6tNRUi3Fwvi6-wP6ojk1GoAQIxsmn7cXvMXvVuQCxsuhWe0P5PyoI5xR3wLuoxHcseORQBB2kmmwxwaN0DJZgUz42S_qRjSLRu9ohLYkTSpsx2RZS42YLYAOwqmNesCD6VH1t5GZZv5Wq74MRpFt2DdxIJEV1SJE38Nq1NEF_JlDnVc9bBOC9C8au_B5PB_3A" 
                alt="Administrator" 
                className="w-8 h-8 rounded-full border border-border object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-foreground leading-tight">Admin User</p>
                <p className="text-[11px] text-muted-foreground">CarDeal HQ</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 md:p-8 mt-16 max-w-[1440px] mx-auto w-full font-['Manrope']">
          {/* Page Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-['Space_Grotesk']">Control Center Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">Real-time performance metrics and admin management.</p>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-[--radius] p-1.5 shadow-sm">
              <Calendar className="w-4 h-4 text-muted-foreground ml-2" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none text-sm text-foreground focus:ring-0 cursor-pointer pl-1 pr-6 py-1 appearance-none"
              >
                <option value="today" className="bg-card text-foreground">Today</option>
                <option value="7d" className="bg-card text-foreground">Last 7 Days</option>
                <option value="30d" className="bg-card text-foreground">Last 30 Days</option>
                <option value="ytd" className="bg-card text-foreground">Year to Date</option>
              </select>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Bento Grid: Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-4">
                <div className="bg-card/60 border border-border rounded-2xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cardeal-primary)]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[var(--cardeal-primary)]/10 transition-colors"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border text-[var(--cardeal-primary)]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10 px-2 py-1 rounded-lg border border-[var(--cardeal-primary)]/20">
                      <span className="relative flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cardeal-primary)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--cardeal-primary)]"></span>
                      </span>
                      LIVE
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Active Clients</p>
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.clients}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Subscription based</p>
                  </div>
                </div>

                <div className="bg-card/60 border border-border rounded-2xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cardeal-primary)]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[var(--cardeal-primary)]/10 transition-colors"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border text-emerald-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      <TrendingUp className="w-3.5 h-3.5" /> +12.5%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Monthly Revenue</p>
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.revenue} <span className="text-sm text-muted-foreground font-semibold">DT</span></h3>
                    <p className="text-xs text-muted-foreground mt-1">Gross volume</p>
                  </div>
                </div>

                <div className="bg-card/60 border border-border rounded-2xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cardeal-primary)]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[var(--cardeal-primary)]/10 transition-colors"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border text-amber-500">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                      <TrendingDown className="w-3.5 h-3.5" /> -1.2%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Pending Requests</p>
                    <h3 className="text-2xl font-extrabold text-amber-500 tracking-tight font-['Space_Grotesk']">{pendingRequests.length}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Requires validation</p>
                  </div>
                </div>

                <div className="bg-card/60 border border-border rounded-2xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group backdrop-blur-xl shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cardeal-primary)]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[var(--cardeal-primary)]/10 transition-colors"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border text-purple-500">
                      <Car className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      <TrendingUp className="w-3.5 h-3.5" /> +8.4%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Vehicles Managed</p>
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.vehicles.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Across all regions</p>
                  </div>
                </div>
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-4">
                <div className="bg-card/60 border border-border rounded-2xl p-5 backdrop-blur-xl">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Service Partners</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.servicePartners}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Verified workshops</p>
                </div>
                <div className="bg-card/60 border border-border rounded-2xl p-5 backdrop-blur-xl">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Rental Partners</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.rentalPartners}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Fleet providers</p>
                </div>
                <div className="bg-card/60 border border-border rounded-2xl p-5 backdrop-blur-xl">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Services Delivered</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.servicesDelivered.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Total completions</p>
                </div>
                <div className="bg-card/60 border border-border rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[var(--cardeal-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-xs font-bold text-[var(--cardeal-primary)] mb-1 uppercase tracking-wider">Commission Earnings</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.commissionEarnings} <span className="text-xs text-muted-foreground">DT</span></h3>
                  <p className="text-xs text-muted-foreground mt-1">Partner transactions</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'requests' && (
            <div className="bg-card/60 border border-border rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 font-['Space_Grotesk']">Partnership Requests Queue ({pendingRequests.length})</h3>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No pending partnership requests.</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-border bg-secondary/30 p-4 gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground text-base">{req.company_name}</h4>
                        <p className="text-xs text-muted-foreground">{req.email} • <span className="text-[var(--cardeal-primary)] font-medium">{req.category}</span></p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handlePartnerAction(req.id, req.email, req.category, 'accept')}
                          className="flex-1 sm:flex-none bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition">
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button 
                          onClick={() => handlePartnerAction(req.id, req.email, req.category, 'denied')}
                          className="flex-1 sm:flex-none bg-secondary hover:bg-accent border border-border text-[var(--cardeal-primary)] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition">
                          <XCircle size={14} /> Refuse
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="bg-card/60 border border-border rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 font-['Space_Grotesk']">Customer Directory ({clients.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs bg-secondary/50">
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {clients.map((client) => (
                      <tr key={client.id || client.email} className="hover:bg-accent/30 transition">
                        <td className="p-3 font-medium text-foreground">{client.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            client.role === 'admin' ? 'bg-[var(--cardeal-primary)]/20 text-[var(--cardeal-primary)] border border-[var(--cardeal-primary)]/40' :
                            client.role === 'partner' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          }`}>
                            {client.role || 'client'}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{new Date(client.created_at || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="bg-card/60 border border-border rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 font-['Space_Grotesk']">Vehicle Fleet Management ({vehicles.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <div key={v.id} className="bg-secondary/30 border border-border p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-[var(--cardeal-primary)] uppercase tracking-wider">{v.brand}</span>
                        <h4 className="text-lg font-bold text-foreground">{v.model} ({v.year})</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Owner: {v.owner_email || 'client.tunis@cardeal.tn'}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                        Health: {v.health_score || 92}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-card/60 border border-border rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 font-['Space_Grotesk']">System Activity & Maintenance Logs</h3>
              <div className="space-y-3">
                <div className="bg-secondary/30 border border-border p-4 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-foreground">Supabase Realtime RLS Synced</p>
                      <span className="text-muted-foreground text-[11px]">Secure database channels active</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">Just now</span>
                </div>
                <div className="bg-secondary/30 border border-border p-4 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--cardeal-primary)]"></div>
                    <div>
                      <p className="font-semibold text-foreground">Partner Request Webhook Handled</p>
                      <span className="text-muted-foreground text-[11px]">Sousse & Ariana garage registrations processed</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">15m ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
