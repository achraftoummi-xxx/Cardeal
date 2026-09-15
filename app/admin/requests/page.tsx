"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Building2, MapPin, Mail, Phone, ChevronDown, ChevronUp, AlertTriangle, Wrench, Calendar as CalendarIcon, Tag } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import PartnershipRequestCard from "@/components/PartnershipRequestCard";

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
    try {
      const { data, error } = await supabase.from('partner_requests').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching partner_requests:", error);
      }
      setRequests(data && data.length > 0 ? data : [
        { 
          id: 'fallback-1', 
          company_name: 'Garage Al-Amine (Fallback)', 
          email: 'amine@garage.tn', 
          phone: '+216 98 123 456',
          category: 'Mécanique générale', 
          services_offered: ['Vidange & Révision', 'Freinage'],
          address: 'Tunis', 
          status: 'pending', 
          created_at: new Date().toISOString() 
        }
      ]);
    } catch (err) {
      console.error("Exception fetching partner_requests:", err);
    } finally {
      setLoading(false);
    }
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

    try {
      const { data: authData } = await supabase.auth.getUser();
      const normalizedEmail = email.trim();

      const { data: reqUpdateData, error: reqUpdateErr } = await supabase
        .from('partner_requests')
        .update({ status: action })
        .eq('id', requestId)
        .select();

      if (reqUpdateErr) {
        console.error("partner_requests update failed:", reqUpdateErr);
        alert(`ACCEPT FAILED (partner_requests update):\n\n${JSON.stringify(reqUpdateErr, null, 2)}`);
        return;
      }

      if (action === 'accepted') {
        const reqObj = requests.find(r => r.id === requestId) ?? (reqUpdateData && reqUpdateData[0]);
        let partnerId = null;

        if (reqObj) {
          const { data: partnerMatch, error: partnerMatchErr } = await supabase
            .from('partners')
            .select('id')
            .ilike('email', normalizedEmail)
            .maybeSingle();

          if (partnerMatchErr) {
            throw partnerMatchErr;
          }

          if (partnerMatch) {
            partnerId = partnerMatch.id;
          } else {
            const { data: newPartner, error: newPartnerErr } = await supabase
              .from('partners')
              .insert({
                name: reqObj.company_name,
                email: normalizedEmail,
                phone: reqObj.phone || null,
                city: reqObj.address || 'Tunis',
                establishment_type: reqObj.category || 'Atelier de mécanique automobile',
                services_offered: Array.isArray(reqObj.services_offered) ? reqObj.services_offered.join('\n') : reqObj.services_offered
              })
              .select('id')
              .maybeSingle();

            if (newPartnerErr) {
              console.error("partners insert failed:", newPartnerErr);
              alert(`ACCEPT FAILED (partners insert):\n\n${JSON.stringify(newPartnerErr, null, 2)}`);
              return;
            }

            if (newPartner) {
              partnerId = newPartner.id;
            }
          }
        }

        const profileLookup = await supabase
          .from('profiles')
          .select('*')
          .or(
            authData?.user?.id && authData.user.email?.toLowerCase() === normalizedEmail.toLowerCase()
              ? `id.eq.${authData.user.id},email.eq.${normalizedEmail}`
              : `email.eq.${normalizedEmail}`
          )
          .limit(1)
          .maybeSingle();

        if (profileLookup.error) {
          throw profileLookup.error;
        }

        const existingProf = profileLookup.data;

        if (existingProf) {
          const { error: profUpdateErr } = await supabase
            .from('profiles')
            .update({
              role: 'partner',
              status: 'approved',
              ...(partnerId ? { partner_id: partnerId } : {})
            })
            .eq('id', existingProf.id);

          if (profUpdateErr) {
            console.error("profiles update failed:", profUpdateErr);
            alert(`ACCEPT FAILED (profiles update):\n\n${JSON.stringify(profUpdateErr, null, 2)}`);
            return;
          }
        } else {
          const { error: profInsertErr } = await supabase
            .from('profiles')
            .insert({
              email: normalizedEmail,
              full_name: email.split('@')[0],
              role: 'partner',
              status: 'approved',
              ...(partnerId ? { partner_id: partnerId } : {})
            });

          if (profInsertErr) {
            console.error("profiles insert failed:", profInsertErr);
            alert(`ACCEPT FAILED (profiles insert):\n\n${JSON.stringify(profInsertErr, null, 2)}`);
            return;
          }
        }
      }
    } catch (err: any) {
      console.error("executeAction fatal error:", err);
      alert(`ACCEPT FAILED (exception):\n\n${err?.message || JSON.stringify(err, null, 2)}`);
    } finally {
      setConfirmModal(null);
      await fetchRequests();
    }
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
      <div className="border-b border-border pb-5">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">Partnership Requests</h2>
        <p className="mt-1.5 text-base text-muted-foreground font-['Manrope']">Examine, review, and action incoming workshop partnership applications with full administrative privileges.</p>
      </div>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card/60 p-12 text-center text-base text-muted-foreground">
          No partnership requests available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="w-full max-w-none">
              <PartnershipRequestCard
                request={req}
                onAccept={(r) => openConfirmModal(r, 'accepted')}
                onReject={(r) => openConfirmModal(r, 'denied')}
              />
            </div>
          ))}
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
                onClick={() => {
                  console.log("[ACCEPT-DEBUG-3] CONFIRM BUTTON CLICKED");
                  executeAction();
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition ${
                  confirmModal.action === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[var(--cardeal-primary)] hover:bg-red-700'
                }`}
              >
                CONFIRM ACCEPTANCE — DEBUG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
