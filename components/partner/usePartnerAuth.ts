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

        // Query profiles table
        const { data: profData, error: profErr } = await supabase
          .from("profiles")
          .select("*")
          .ilike("email", email.trim())
          .maybeSingle();

        if (profData) {
          setProfile(profData as PartnerProfile);
          if (profData.partner_id) {
            setPartnerId(profData.partner_id);
          } else {
            // Find partner by email in partners table
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
          // If profile doesn't exist yet, check if partner exists by email
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
