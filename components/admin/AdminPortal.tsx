'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useTranslation } from '@/components/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import cardealLogo from '@/assets/images/cardeal_logo.png';
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
  const { userName: authUserName, email: authEmail, avatarUrl: authAvatarUrl } = useAuth();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'clients' | 'vehicles' | 'logs'>('overview');
  
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ 
    clients: 0, 
    vehicles: 0, 
    pending: 0, 
    activeSessions: 0,
    revenue: "0",
    servicePartners: 0,
    rentalPartners: 0,
    servicesDelivered: 0,
    commissionEarnings: "0"
  });
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; details: string; type: 'success' | 'warning' | 'info' | 'error'; timestamp: string }>>([
    { id: 'log-1', action: 'Supabase RLS Sync', details: 'Secure database channels active for partnership verification', type: 'success', timestamp: 'Just now' },
    { id: 'log-2', action: 'Partnership Onboarding Webhook', details: 'Ariana & Sousse workshop profiles processed successfully', type: 'info', timestamp: '15m ago' }
  ]);

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  async function fetchAdminData() {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setPendingRequests([
        { id: '1-mock', company_name: 'Alpha Construction & Co', email: 'contact@alphabuild.tn', category: 'General Construction', status: 'pending', created_at: new Date().toISOString() },
        { id: '2-mock', company_name: 'Tunis Property Facilities', email: 'ops@tunisprop.tn', category: 'Facilities Management', status: 'pending', created_at: new Date().toISOString() }
      ]);
      setClients([
        { id: 'c1', email: 'mokhtari.achref06@gmail.com', role: 'admin', created_at: new Date().toISOString() },
        { id: 'c2', email: 'toumiachref21@gmail.com', role: 'admin', created_at: new Date().toISOString() },
        { id: 'c3', email: 'client.tunis@geometra.io', role: 'client', created_at: new Date().toISOString() }
      ]);
      setVehicles([
        { id: 'v1', brand: 'Alpha Site', model: 'Block A Residential', year: 2026, health_score: 94, owner_email: 'client.tunis@geometra.io', history: [{ date: '2026-02-10', service: 'Foundation Inspection', status: 'Completed' }] },
        { id: 'v2', brand: 'Beta Complex', model: 'Commercial Tower', year: 2025, health_score: 82, owner_email: 'client.tunis@geometra.io', history: [{ date: '2026-01-15', service: 'Structural Review', status: 'Completed' }] }
      ]);
      setLoading(false);
      return;
    }

      try {
        const { data: requests, error: requestsError } = await supabase.from('partner_requests').select('*');
        console.log("AdminPortal partner_requests fetch:", { requests, requestsError });
        const clientRes = await supabase.from('profiles').select('*', { count: 'exact' });
        const vehicleRes = await supabase.from('vehicles').select('*', { count: 'exact' });

        setPendingRequests(requests || []);
        setClients(clientRes.data || []);
        setVehicles(vehicleRes.data || []);
        setMetrics(prev => ({
          ...prev,
          clients: clientRes.count || clientRes.data?.length || prev.clients,
          vehicles: vehicleRes.count || vehicleRes.data?.length || prev.vehicles,
          pending: requests?.length || prev.pending,
        }));
      } catch (err) {
        console.error("Error loading portal data", err);
      } finally {
        setLoading(false);
      }
  }

  async function handlePartnerAction(requestId: string, email: string, category: string, action: 'accept' | 'denied') {
    const timestamp = new Date().toLocaleTimeString();
    if (!isSupabaseConfigured || !supabase) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      setAuditLogs(prev => [
        { id: `log-${Date.now()}`, action: action === 'accept' ? 'Partner Request Accepted' : 'Partner Request Refused', details: `Request ID: ${requestId} for ${email} (${category})`, type: action === 'accept' ? 'success' : 'warning', timestamp },
        ...prev
      ]);
      return;
    }
    try {
      if (action === 'accept') {
        await supabase.from('partner_requests').update({ status: 'accepted' }).eq('id', requestId);
        
        // Find partner ID or create partner record
        const reqObj = pendingRequests.find(r => r.id === requestId);
        let partnerId = null;
        if (reqObj) {
          const { data: partnerMatch } = await supabase
            .from('partners')
            .select('id')
            .ilike('email', email.trim())
            .maybeSingle();

          if (partnerMatch) {
            partnerId = partnerMatch.id;
          } else {
            const { data: newPart } = await supabase
              .from('partners')
              .insert({
                name: reqObj.company_name,
                email: email.trim(),
                phone: reqObj.phone || null,
                city: reqObj.address || 'Tunis',
                establishment_type: category || 'Atelier de mécanique automobile',
                services_offered: Array.isArray(reqObj.services_offered) ? reqObj.services_offered.join('\n') : reqObj.services_offered
              })
              .select('id')
              .maybeSingle();
            if (newPart) partnerId = newPart.id;
          }
        }

        // Update profiles table: set role to 'partner', status to 'approved', and link partner_id
        const { data: existingProf } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', email.trim())
          .maybeSingle();

        if (existingProf) {
          await supabase.from('profiles').update({
            role: 'partner',
            status: 'approved',
            category: category || 'Général',
            ...(partnerId ? { partner_id: partnerId } : {})
          }).ilike('email', email.trim());
        } else {
          await supabase.from('profiles').insert({
            email: email.trim(),
            full_name: email.split('@')[0],
            role: 'partner',
            status: 'approved',
            category: category || 'Général',
            ...(partnerId ? { partner_id: partnerId } : {})
          });
        }

        setAuditLogs(prev => [
          { id: `log-${Date.now()}`, action: 'Partner Request Accepted', details: `Successfully accepted request for ${email} in category ${category}`, type: 'success', timestamp },
          ...prev
        ]);
      } else {
        await supabase.from('partner_requests').update({ status: 'denied' }).eq('id', requestId);
        setAuditLogs(prev => [
          { id: `log-${Date.now()}`, action: 'Partner Request Refused', details: `Refused partnership request for ${email}`, type: 'warning', timestamp },
          ...prev
        ]);
      }
    } catch (err: any) {
      console.error("Error handling partner action", err);
      setAuditLogs(prev => [
        { id: `log-${Date.now()}`, action: 'Action Error', details: err?.message || 'Failed to process partnership request', type: 'error', timestamp },
        ...prev
      ]);
    }
    fetchAdminData();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/85 backdrop-blur-md animate-fadeIn overflow-x-hidden text-foreground antialiased font-sans">
      {/* SideNavBar Component */}
      <nav className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-card border-r border-border py-4 z-40 backdrop-blur-xl shadow-sm">
        {/* Brand Header */}
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="relative w-36 h-12">
            <Image 
              src={cardealLogo.src} 
              alt="Geometra" 
              fill 
              sizes="144px"
              className="object-contain object-left dark:brightness-150" 
              priority 
            />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'overview'
                ? 'bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20 font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground font-medium'
            }`}
          >
            <LayoutDashboard size={18} className={`shrink-0 ${activeTab === 'overview' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm truncate">{t('admin.nav.dashboard') !== 'admin.nav.dashboard' ? t('admin.nav.dashboard') : 'Dashboard'}</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'requests'
                ? 'bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20 font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground font-medium'
            }`}
          >
            <Handshake size={18} className={`shrink-0 ${activeTab === 'requests' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm truncate">{t('admin.nav.requests') !== 'admin.nav.requests' ? t('admin.nav.requests') : 'Partnership Requests'} ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'clients'
                ? 'bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20 font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground font-medium'
            }`}
          >
            <Users size={18} className={`shrink-0 ${activeTab === 'clients' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm truncate">{t('admin.nav.users') !== 'admin.nav.users' ? t('admin.nav.users') : 'Users'} ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'vehicles'
                ? 'bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20 font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground font-medium'
            }`}
          >
            <Car size={18} className={`shrink-0 ${activeTab === 'vehicles' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm truncate">{t('admin.nav.portfolios') !== 'admin.nav.portfolios' ? t('admin.nav.portfolios') : 'Projects & Portfolios'}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-200 ease-in-out text-left group ${
              activeTab === 'logs'
                ? 'bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20 font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground font-medium'
            }`}
          >
            <FileText size={18} className={`shrink-0 ${activeTab === 'logs' ? 'text-[var(--cardeal-primary)]' : 'group-hover:text-foreground'} transition-colors`} />
            <span className="text-sm truncate">{t('admin.nav.logs') !== 'admin.nav.logs' ? t('admin.nav.logs') : 'System Logs'}</span>
          </button>
        </div>

        {/* CTA / Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between gap-2">
          <LanguageSelector />
          <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-accent text-foreground border border-border py-2.5 rounded-xl transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            {t('admin.nav.close') !== 'admin.nav.close' ? t('admin.nav.close') : 'Close Portal'}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen flex flex-col relative w-full bg-background overflow-y-auto">
        {/* TopNavBar Component */}
        <header className="fixed top-0 right-0 w-full md:w-[calc(100%-18rem)] z-50 bg-card/80 backdrop-blur-md border-b border-border h-16 px-6 flex justify-between items-center">
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-[var(--cardeal-primary)] transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[var(--cardeal-primary)] transition-colors" size={16} />
              <input 
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--cardeal-primary)] focus:ring-1 focus:ring-[var(--cardeal-primary)] transition-all placeholder:text-muted-foreground" 
                placeholder={t('admin.search.placeholder') !== 'admin.search.placeholder' ? t('admin.search.placeholder') : "Search projects, invoices, or users..."} 
                type="text" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-[var(--cardeal-primary)] transition-colors relative"
              >
                <Bell size={18} />
                {pendingRequests.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--cardeal-primary)] rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-xl z-50 p-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm font-['Space_Grotesk']">{t('admin.notifications.title') !== 'admin.notifications.title' ? t('admin.notifications.title') : 'Partnership Requests'}</h4>
                      <span className="bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] text-xs font-bold px-2 py-0.5 rounded-full">
                        {pendingRequests.length}
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {pendingRequests.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-6 text-center">{t('admin.notifications.empty') !== 'admin.notifications.empty' ? t('admin.notifications.empty') : 'No pending partnership requests.'}</p>
                    ) : (
                      pendingRequests.map((req) => (
                        <div 
                          key={req.id} 
                          onClick={() => {
                            setActiveTab('requests');
                            setShowNotifications(false);
                          }}
                          className="bg-secondary/40 hover:bg-accent/60 border border-border/80 rounded-xl p-3 cursor-pointer transition text-left group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-foreground text-xs group-hover:text-[var(--cardeal-primary)] transition-colors">
                              {req.company_name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(req.created_at || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-1">{req.email}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] px-2 py-0.5 rounded font-medium">
                              {req.category || 'Partner'}
                            </span>
                            <span className="text-[10px] font-semibold text-foreground group-hover:underline flex items-center gap-1">
                              {t('admin.notifications.view') !== 'admin.notifications.view' ? t('admin.notifications.view') : 'View request →'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 border-t border-border mt-3 text-center">
                    <button 
                      onClick={() => {
                        setActiveTab('requests');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-semibold text-[var(--cardeal-primary)] hover:underline"
                    >
                      {t('admin.notifications.viewAll') !== 'admin.notifications.viewAll' ? t('admin.notifications.viewAll') : 'View all requests in portal'}
                    </button>
                  </div>
                </div>
              )}

              <button onClick={onClose} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-[var(--cardeal-primary)] transition-colors">
                ✕
              </button>
            </div>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <div className="flex items-center gap-2.5">
              {authAvatarUrl ? (
                <img 
                  src={authAvatarUrl} 
                  alt={authUserName || "Administrator"} 
                  className="w-8 h-8 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--cardeal-primary)] text-white flex items-center justify-center text-xs font-bold">
                  {(authUserName || "Admin").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-foreground leading-tight">{authUserName || "Administrator"}</p>
                <p className="text-xs text-muted-foreground">{authEmail || "Geometra Admin"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 md:p-8 mt-16 max-w-6xl mx-auto w-full">
          {/* Page Header & Actions */}
          {(() => {
            const headerInfo = (() => {
              switch (activeTab) {
                case 'requests':
                  return { title: "Current Requests", desc: "Partnership performance analytics and administrative management." };
                case 'clients':
                  return { title: "User & Partner Directory", desc: "Manage registered users, roles, and administrative permissions." };
                case 'vehicles':
                  return { title: "Construction & Property Portfolio", desc: "Monitor active construction sites, assets, and health ratings." };
                case 'logs':
                  return { title: "System Activity & RLS Audit Logs", desc: "Real-time security audits and transaction logs." };
                case 'overview':
                default:
                  return { title: "Overview", desc: "Real-time performance metrics and operational insights." };
              }
            })();

            return (
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-['Space_Grotesk']">{headerInfo.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{headerInfo.desc}</p>
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
            );
          })()}

          {activeTab === 'overview' && (
            <>
              {/* Bento Grid: Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-4">
                <div className="bg-card border border-border rounded-xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group shadow-sm">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[var(--cardeal-primary)]/10 flex items-center justify-center text-[var(--cardeal-primary)]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10 px-2 py-1 rounded">
                      <span className="relative flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cardeal-primary)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--cardeal-primary)]"></span>
                      </span>
                      LIVE
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Active Partners</p>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.clients}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Partnership network</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group shadow-sm">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[var(--cardeal-primary)]/10 flex items-center justify-center text-[var(--cardeal-primary)]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                      <TrendingUp className="w-3.5 h-3.5" /> +12.5%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Monthly MRR</p>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.revenue} <span className="text-sm text-muted-foreground font-semibold">USD</span></h3>
                    <p className="text-xs text-muted-foreground mt-1">Stripe billing</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group shadow-sm">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[var(--cardeal-primary)]/10 flex items-center justify-center text-[var(--cardeal-primary)]">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                      <TrendingDown className="w-3.5 h-3.5" /> -1.2%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Pending Requests</p>
                    <h3 className="text-2xl font-bold text-amber-500 tracking-tight font-['Space_Grotesk']">{pendingRequests.length}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Requires validation</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 hover:border-[var(--cardeal-primary)]/50 transition-colors relative overflow-hidden group shadow-sm">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[var(--cardeal-primary)]/10 flex items-center justify-center text-[var(--cardeal-primary)]">
                      <Car className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                      <TrendingUp className="w-3.5 h-3.5" /> +8.4%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Managed Projects</p>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.vehicles.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Active construction sites</p>
                  </div>
                </div>
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-4">
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Contractors</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.servicePartners}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Verified providers</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Property Managers</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.rentalPartners}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Asset supervisors</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Tasks Delivered</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.servicesDelivered.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Total completions</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group">
                  <p className="text-xs font-bold text-[var(--cardeal-primary)] mb-1 uppercase tracking-wider">Platform Commission</p>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-['Space_Grotesk']">{metrics.commissionEarnings} <span className="text-xs text-muted-foreground">USD</span></h3>
                  <p className="text-xs text-muted-foreground mt-1">Partnership volume</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'requests' && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
               <h3 className="text-lg font-bold text-foreground mb-4 font-['Space_Grotesk']">Partnership Registration Requests ({pendingRequests.length})</h3>
              {pendingRequests.length === 0 ? (
                 <p className="text-sm text-muted-foreground py-8 text-center">No pending partnership requests.</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-border bg-secondary/30 p-4 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--cardeal-primary)]/10 border border-[var(--cardeal-primary)]/30 flex items-center justify-center text-[var(--cardeal-primary)] shrink-0 mt-0.5">
                          <Handshake size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-foreground text-base">{req.company_name}</h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--cardeal-primary)]/15 text-[var(--cardeal-primary)] border border-[var(--cardeal-primary)]/30">
                              {req.category || 'Partner'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Users size={13} className="text-muted-foreground" /> {req.email}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={13} className="text-muted-foreground" /> {new Date(req.created_at || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handlePartnerAction(req.id, req.email, req.category, 'accept')}
                          className="flex-1 sm:flex-none bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button 
                          onClick={() => handlePartnerAction(req.id, req.email, req.category, 'denied')}
                          className="flex-1 sm:flex-none bg-secondary hover:bg-accent border border-border text-[var(--cardeal-primary)] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
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
            <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 font-['Space_Grotesk']">User & Partner Directory ({clients.length})</h3>
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
            <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 font-['Space_Grotesk']">Construction & Property Portfolio ({vehicles.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <div key={v.id} className="bg-secondary/30 border border-border p-4 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-[var(--cardeal-primary)] uppercase tracking-wider">{v.brand}</span>
                        <h4 className="text-lg font-bold text-foreground">{v.model} ({v.year})</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Manager: {v.owner_email || 'client.tunis@geometra.io'}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                        Health: {v.health_score || 92}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground font-['Space_Grotesk']">System Activity & RLS Audit Logs ({auditLogs.length})</h3>
                <button 
                  onClick={() => setAuditLogs([{ id: `log-${Date.now()}`, action: 'Logs Cleared', details: 'Admin cleared audit history', type: 'info', timestamp: 'Just now' }])}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition"
                >
                  Clear logs
                </button>
              </div>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-secondary/30 border border-border p-4 rounded-xl flex items-center justify-between text-xs gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        log.type === 'success' ? 'bg-emerald-500' :
                        log.type === 'warning' ? 'bg-amber-500' :
                        log.type === 'error' ? 'bg-red-500 animate-pulse' :
                        'bg-[var(--cardeal-primary)] animate-pulse'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{log.action}</p>
                        <span className="text-muted-foreground text-xs">{log.details}</span>
                      </div>
                    </div>
                    <span className="text-muted-foreground whitespace-nowrap text-xs font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
