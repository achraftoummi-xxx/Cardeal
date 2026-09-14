"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Loader2, Wrench, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PartnerProfile } from "@/lib/partnerTypes";

export function usePartnerAuth() {
  const { email, authed, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!authed || !email) {
      setLoading(false);
      setProfile(null);
      return;
    }

    const fetchPartnerProfile = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          // Fallback mock mode for testing partner portal
          setProfile({
            id: "mock-prof-id",
            email: email,
            full_name: "Mock Partner",
            role: "partner",
            status: "approved",
            partner_id: "mock-partner-uuid"
          });
          setPartnerId("mock-partner-uuid");
          setLoading(false);
          return;
        }

        // Query profiles table by email
        const { data: profData, error: profErr } = await supabase
          .from("profiles")
          .select("*")
          .ilike("email", email.trim())
          .maybeSingle();

        if (profData) {
          // If profile exists, check if role is partner and approved
          if (profData.role === 'partner' && profData.status === 'approved') {
            setProfile(profData as PartnerProfile);
            if (profData.partner_id) {
              setPartnerId(profData.partner_id);
            } else {
              const { data: partnerData } = await supabase
                .from("partners")
                .select("id")
                .ilike("email", email.trim())
                .maybeSingle();
              if (partnerData) {
                setPartnerId(partnerData.id);
              }
            }
          } else {
            // Check if there is an accepted partner_request for this email
            const { data: reqData } = await supabase
              .from("partner_requests")
              .select("*")
              .ilike("email", email.trim())
              .maybeSingle();

            if (reqData && reqData.status === 'accepted') {
              // Auto-promote profile to partner if admin accepted their request previously
              let partnerIdVal = null;
              const { data: partnerMatch } = await supabase
                .from("partners")
                .select("id")
                .or(`email.ilike.${reqData.email},name.ilike.%${reqData.company_name}%`)
                .maybeSingle();

              if (partnerMatch) {
                partnerIdVal = partnerMatch.id;
              } else {
                const { data: newPart } = await supabase
                  .from("partners")
                  .insert({
                    name: reqData.company_name,
                    email: reqData.email,
                    phone: reqData.phone || null,
                    city: reqData.address || 'Tunis',
                    establishment_type: reqData.category || 'Atelier de mécanique automobile'
                  })
                  .select('id')
                  .maybeSingle();
                if (newPart) partnerIdVal = newPart.id;
              }

              await supabase
                .from("profiles")
                .update({ role: 'partner', status: 'approved', ...(partnerIdVal ? { partner_id: partnerIdVal } : {}) })
                .ilike("email", email.trim());

              const promotedProf: PartnerProfile = {
                ...profData,
                role: 'partner',
                status: 'approved',
                partner_id: partnerIdVal || undefined
              };
              setProfile(promotedProf);
              if (partnerIdVal) setPartnerId(partnerIdVal);
            } else {
              setProfile(profData as PartnerProfile);
            }
          }
        } else {
          // If profile doesn't exist yet, check if partner_requests has an accepted entry
          const { data: reqData } = await supabase
            .from("partner_requests")
            .select("*")
            .ilike("email", email.trim())
            .maybeSingle();

          if (reqData && reqData.status === 'accepted') {
            let partnerIdVal = null;
            const { data: partnerMatch } = await supabase
              .from("partners")
              .select("id")
              .or(`email.ilike.${reqData.email},name.ilike.%${reqData.company_name}%`)
              .maybeSingle();

            if (partnerMatch) {
              partnerIdVal = partnerMatch.id;
            } else {
              const { data: newPart } = await supabase
                .from("partners")
                .insert({
                  name: reqData.company_name,
                  email: reqData.email,
                  phone: reqData.phone || null,
                  city: reqData.address || 'Tunis',
                  establishment_type: reqData.category || 'Atelier de mécanique automobile'
                })
                .select('id')
                .maybeSingle();
              if (newPart) partnerIdVal = newPart.id;
            }

            const newProf: PartnerProfile = {
              id: crypto.randomUUID(),
              email: email,
              full_name: email.split("@")[0],
              role: "partner",
              status: "approved",
              partner_id: partnerIdVal || undefined
            };
            await supabase.from("profiles").upsert(newProf);
            setProfile(newProf);
            if (partnerIdVal) setPartnerId(partnerIdVal);
          } else {
            // Check if partner exists by email directly
            const { data: partnerData } = await supabase
              .from("partners")
              .select("id")
              .ilike("email", email.trim())
              .maybeSingle();

            if (partnerData) {
              const newProf: PartnerProfile = {
                id: crypto.randomUUID(),
                email: email,
                full_name: email.split("@")[0],
                role: "partner",
                status: "approved",
                partner_id: partnerData.id
              };
              await supabase.from("profiles").upsert(newProf);
              setProfile(newProf);
              setPartnerId(partnerData.id);
            } else {
              // Check if user is Achref (admin/partner override for dev)
              if (email.toLowerCase().includes("achref") || email.toLowerCase().includes("mokhtari")) {
                const { data: firstPartner } = await supabase.from("partners").select("id").limit(1).maybeSingle();
                const pId = firstPartner?.id || "mock-partner-uuid";
                const adminProf: PartnerProfile = {
                  id: crypto.randomUUID(),
                  email: email,
                  full_name: "Admin Partner",
                  role: "partner",
                  status: "approved",
                  partner_id: pId
                };
                setProfile(adminProf);
                setPartnerId(pId);
              }
            }
          }
        }
      } catch (err) {
        console.error("Partner auth verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchPartnerProfile();
  }, [authed, email, authLoading]);

  return { loading, profile, partnerId, isPartner: profile?.role === "partner" && profile?.status === "approved" };
}
