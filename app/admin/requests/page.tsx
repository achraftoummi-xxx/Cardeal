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

    console.log("[AdminRequests] executeAction started for request:", requestId, "action:", action);

    if (!isSupabaseConfigured || !supabase) {
      console.log("[AdminRequests] Supabase not configured, mocking action locally.");
      setRequests(requests.map((r) => r.id === requestId ? { ...r, status: action } : r));
      setConfirmModal(null);
      return;
    }

    try {
      // 1. Update partner_request status
      console.log("[AdminRequests] Step 1: Updating partner_request status to:", action);
      const { error: reqUpdateErr } = await supabase
        .from('partner_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (reqUpdateErr) {
        console.error("[AdminRequests] Error updating partner_request status:", reqUpdateErr);
        alert(`Erreur de mise à jour de la requête: ${reqUpdateErr.message}`);
      } else {
        console.log("[AdminRequests] Step 1 success: partner_request updated.");
      }

      if (action === 'accepted') {
        const reqObj = requests.find(r => r.id === requestId);
        let partnerId = null;

        console.log("[AdminRequests] Step 2: Finding or creating partner record for:", reqObj?.company_name || email);

        if (reqObj) {
          // Find matching partner in partners table by email or company name
          const { data: partnerMatch, error: partnerMatchErr } = await supabase
            .from('partners')
            .select('id')
            .or(`email.ilike.${reqObj.email},name.ilike.%${reqObj.company_name}%`)
            .maybeSingle();

          if (partnerMatchErr) {
            console.warn("[AdminRequests] Partner match query warning:", partnerMatchErr);
          }

          if (partnerMatch) {
            partnerId = partnerMatch.id;
            console.log("[AdminRequests] Found existing partner ID:", partnerId);
          } else {
            console.log("[AdminRequests] Partner not found in partners table. Creating new partner record...");
            // If partner record doesn't exist in partners table yet, create one
            const { data: newPartner, error: newPartnerErr } = await supabase
              .from('partners')
              .insert({
                name: reqObj.company_name,
                email: reqObj.email,
                phone: reqObj.phone || null,
                city: reqObj.address || 'Tunis',
                establishment_type: reqObj.category || 'Atelier de mécanique automobile',
                services_offered: Array.isArray(reqObj.services_offered) ? reqObj.services_offered.join('\n') : reqObj.services_offered
              })
              .select('id')
              .maybeSingle();

            if (newPartnerErr) {
              console.error("[AdminRequests] Error creating partner record:", newPartnerErr);
              alert(`Erreur de création du partenaire: ${newPartnerErr.message}`);
            } else if (newPartner) {
              partnerId = newPartner.id;
              console.log("[AdminRequests] Created new partner record with ID:", partnerId);
            }
          }
        }

        // 3. Check if profile exists in profiles table
        console.log("[AdminRequests] Step 3: Checking profile for email:", email);
        const { data: existingProf, error: profLookupErr } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', email.trim())
          .maybeSingle();

        if (profLookupErr) {
          console.warn("[AdminRequests] Profile lookup warning:", profLookupErr);
        }

        if (existingProf) {
          console.log("[AdminRequests] Existing profile found. Upgrading role to 'partner'...");
          const { error: profUpdateErr } = await supabase
            .from('profiles')
            .update({
              role: 'partner',
              status: 'approved',
              category: category || 'Général',
              ...(partnerId ? { partner_id: partnerId } : {})
            })
            .ilike('email', email.trim());

          if (profUpdateErr) {
            console.error("[AdminRequests] Error updating existing profile:", profUpdateErr);
            alert(`Erreur de mise à jour du profil: ${profUpdateErr.message}`);
          } else {
            console.log("[AdminRequests] Profile successfully upgraded to partner.");
          }
        } else {
          console.log("[AdminRequests] No profile found for email. Provisioning new profile...");
          // Fallback edge case: user hasn't created a profile yet; provision one instantly
          const { error: profInsertErr } = await supabase
            .from('profiles')
            .insert({
              email: email.trim(),
              full_name: email.split('@')[0],
              role: 'partner',
              status: 'approved',
              category: category || 'Général',
              ...(partnerId ? { partner_id: partnerId } : {})
            });

          if (profInsertErr) {
            console.error("[AdminRequests] Error inserting new profile:", profInsertErr);
            alert(`Erreur de création du profil: ${profInsertErr.message}`);
          } else {
            console.log("[AdminRequests] New profile successfully provisioned with partner role.");
          }
        }
      }
    } catch (err: any) {
      console.error("[AdminRequests] Exception in executeAction:", err);
      alert(`Erreur critique lors de l'acceptation: ${err?.message || err}`);
    }

    console.log("[AdminRequests] executeAction completed. Closing modal and refreshing requests...");
    setConfirmModal(null);
    await fetchRequests();
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
