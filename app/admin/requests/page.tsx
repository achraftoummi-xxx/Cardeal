"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Building2, MapPin, Mail, Phone, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  
  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    requestId: string;
    email: string;
    category: string;
    companyName: string;
    action: 'accepted' | 'denied';
  } | null>(null);

  useEffect(() => {
    fetchRequests();

    // Polling interval & window focus listener for zero-delay instant updates
    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);

    const onFocus = () => {
      fetchRequests();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  async function fetchRequests() {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setRequests([
        { 
          id: '1', 
          company_name: 'Garage Al-Amine', 
          email: 'amine@garage.tn', 
          phone: '+216 98 123 456',
          category: 'Mécanique générale', 
          services_offered: ['Vidange & Révision', 'Freinage', 'Courroie de distribution'],
          address: 'Tunis', 
          status: 'pending', 
          created_at: new Date().toISOString() 
        },
        { 
          id: '2', 
          company_name: 'Electro-Auto Tunis', 
          email: 'contact@electroauto.tn', 
          phone: '+216 55 987 654',
          category: 'Électricité & Diagnostic', 
          services_offered: ['Diagnostic Électronique', 'Batterie & Alternateur', 'Climatisation'],
          address: 'Ariana', 
          status: 'pending', 
          created_at: new Date().toISOString() 
        }
      ]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('partner_requests').select('*').order('created_at', { ascending: false });
    console.log("Supabase partner_requests fetch result:", { data, error, count: data?.length });
    setRequests(data || []);
    setLoading(false);
  }

  function toggleExpand(id: string) {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function openConfirmModal(req: any, action: 'accepted' | 'denied') {
    setConfirmModal({
      isOpen: true,
      requestId: req.id,
      email: req.email,
      category: req.category || 'Général',
      companyName: req.company_name,
      action
    });
  }

  async function executeAction() {
    if (!confirmModal) return;
    const { requestId, email, category, action } = confirmModal;

    if (!isSupabaseConfigured || !supabase) {
      setRequests(requests.map((r) => r.id === requestId ? { ...r, status: action } : r));
      setConfirmModal(null);
      return;
    }

    await supabase.from('partner_requests').update({ status: action }).eq('id', requestId);
    if (action === 'accepted') {
      await supabase.from('profiles').update({ role: 'partner', category }).eq('email', email);
    }
    setConfirmModal(null);
    fetchRequests();
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--cardeal-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">Partnership Requests</h2>
        <p className="mt-1 text-sm text-muted-foreground font-['Manrope']">Examine, review, and action incoming workshop partnership applications.</p>
      </div>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card/60 p-12 text-center text-sm text-muted-foreground">
          No partnership requests available at the moment.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isExpanded = !!expandedIds[req.id];
            const services = Array.isArray(req.services_offered) 
              ? req.services_offered 
              : (typeof req.services_offered === 'string' ? JSON.parse(req.services_offered || '[]') : []);

            return (
              <div 
                key={req.id} 
                className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm transition-all"
              >
                {/* Card Header / Summary */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1 cursor-pointer flex-1" onClick={() => toggleExpand(req.id)}>
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-[var(--cardeal-primary)] shrink-0" />
                      <h3 className="text-base font-bold text-foreground font-['Space_Grotesk']">{req.company_name}</h3>
                      <span className={`ml-2 rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        req.status === 'denied' ? 'bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] border border-[var(--cardeal-primary)]/30' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {req.email} • <span className="text-[var(--cardeal-primary)] font-semibold">{req.category || 'General'}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                      {req.address && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {req.address}
                        </span>
                      )}
                      <span>•</span>
                      <span>Submitted on {new Date(req.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openConfirmModal(req, 'accepted')}
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30 transition"
                        >
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button
                          onClick={() => openConfirmModal(req, 'denied')}
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-secondary border border-border px-3.5 py-2 text-xs font-bold text-[var(--cardeal-primary)] hover:bg-accent transition"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}

                    <button 
                      onClick={() => toggleExpand(req.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg transition"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <span>{isExpanded ? 'Less' : 'Details'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-border bg-secondary/20 p-6 space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Submission Attributes & Details</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-card border border-border p-3.5 rounded-xl">
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Contact Email</span>
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Mail size={14} className="text-[var(--cardeal-primary)]" />
                          <a href={`mailto:${req.email}`} className="hover:underline">{req.email}</a>
                        </div>
                      </div>

                      <div className="bg-card border border-border p-3.5 rounded-xl">
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Phone Number</span>
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Phone size={14} className="text-[var(--cardeal-primary)]" />
                          <span>{req.phone || 'Not provided'}</span>
                        </div>
                      </div>

                      <div className="bg-card border border-border p-3.5 rounded-xl">
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Business Category</span>
                        <span className="text-sm font-bold text-foreground">{req.category || 'General'}</span>
                      </div>
                    </div>

                    {/* Services Offered Itemization */}
                    <div className="bg-card border border-border p-4 rounded-xl space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Services Offered ({services.length})
                      </span>
                      {services.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No specific services itemized in application.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {services.map((svc: string, idx: number) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] border border-[var(--cardeal-primary)]/20"
                            >
                              {svc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                confirmModal.action === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--cardeal-primary)]/20 text-[var(--cardeal-primary)]'
              }`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-['Space_Grotesk']">
                  Confirm Partnership {confirmModal.action === 'accepted' ? 'Acceptance' : 'Rejection'}
                </h3>
                <p className="text-xs text-muted-foreground">Action required for {confirmModal.companyName}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to <span className="font-bold text-foreground">{confirmModal.action === 'accepted' ? 'accept' : 'reject'}</span> this partnership request? 
              {confirmModal.action === 'accepted' ? ' This will upgrade the user profile to partner status.' : ' This will mark the application as rejected.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-accent text-xs font-bold text-foreground transition"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition ${
                  confirmModal.action === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[var(--cardeal-primary)] hover:bg-red-700'
                }`}
              >
                Confirm {confirmModal.action === 'accepted' ? 'Acceptance' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
