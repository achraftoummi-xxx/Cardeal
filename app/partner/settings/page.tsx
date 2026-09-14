"use client";

import React, { useEffect, useState } from "react";
import { Settings, Clock, Check, Loader2, Save } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";
import { SERVICE_CATEGORY_GROUPS } from "@/data/serviceCategories";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function PartnerSettingsPage() {
  const { partnerId } = usePartnerAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Operating hours state
  const [hours, setHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>({
    Lundi: { open: "08:00", close: "18:00", closed: false },
    Mardi: { open: "08:00", close: "18:00", closed: false },
    Mercredi: { open: "08:00", close: "18:00", closed: false },
    Jeudi: { open: "08:00", close: "18:00", closed: false },
    Vendredi: { open: "08:00", close: "18:00", closed: false },
    Samedi: { open: "08:00", close: "14:00", closed: false },
    Dimanche: { open: "08:00", close: "18:00", closed: true },
  });

  // Services offered state (synced with partnership registration)
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const pId = partnerId || "mock-partner-uuid";
      try {
        if (isSupabaseConfigured && supabase) {
          // Load partner record for services_offered
          const { data: pData } = await supabase
            .from("partners")
            .select("services_offered")
            .eq("id", pId)
            .maybeSingle();

          if (pData?.services_offered) {
            if (Array.isArray(pData.services_offered)) {
              setSelectedServices(pData.services_offered);
            } else if (typeof pData.services_offered === 'string') {
              setSelectedServices(pData.services_offered.split('\n').filter(Boolean));
            }
          }

          // Load partner hours
          const { data: hData } = await supabase
            .from("partner_hours")
            .select("*")
            .eq("partner_id", pId);

          if (hData && hData.length > 0) {
            const newHours: any = { ...hours };
            for (const row of hData) {
              newHours[row.day_of_week] = {
                open: row.open_time,
                close: row.close_time,
                closed: row.is_closed
              };
            }
            setHours(newHours);
          }
        } else {
          setSelectedServices(["Révisions et Vidange", "Plaquettes de freins Avant (Remplacement)"]);
        }
      } catch (err) {
        console.error("Error loading partner settings:", err);
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, [partnerId]);

  const toggleService = (sub: string) => {
    setSelectedServices(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    const pId = partnerId || "mock-partner-uuid";

    try {
      if (isSupabaseConfigured && supabase) {
        // Update services_offered in partners table
        await supabase
          .from("partners")
          .update({ services_offered: selectedServices })
          .eq("id", pId);

        // Upsert partner hours
        for (const day of DAYS) {
          const h = hours[day];
          await supabase.from("partner_hours").upsert({
            partner_id: pId,
            day_of_week: day,
            open_time: h.open,
            close_time: h.close,
            is_closed: h.closed
          }, { onConflict: 'partner_id,day_of_week' });
        }
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("Error saving partner settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--cardeal-primary)]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">Paramètres de l'Atelier & Horaires</h1>
          <p className="text-sm text-muted-foreground">Mettez à jour vos prestations offertes et votre grille horaire hebdomadaire</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-[--radius] bg-[var(--cardeal-primary)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#9E1F23] transition disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Enregistrer les Modifications
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <Check size={18} /> Vos paramètres et services ont été mis à jour avec succès.
        </div>
      )}

      {/* Operating Hours Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Clock size={18} className="text-[var(--cardeal-primary)]" /> Horaires d'Ouverture Hebdomadaires
        </h2>
        <div className="divide-y divide-border">
          {DAYS.map((day) => {
            const h = hours[day];
            return (
              <div key={day} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="w-32 font-semibold text-sm text-foreground">{day}</div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={h.closed}
                      onChange={(e) => setHours({ ...hours, [day]: { ...h, closed: e.target.checked } })}
                      className="rounded border-border"
                    />
                    Fermé
                  </label>
                  {!h.closed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={h.open}
                        onChange={(e) => setHours({ ...hours, [day]: { ...h, open: e.target.value } })}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                      />
                      <span className="text-muted-foreground">à</span>
                      <input
                        type="time"
                        value={h.close}
                        onChange={(e) => setHours({ ...hours, [day]: { ...h, close: e.target.value } })}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services Catalog Sync Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold font-['Space_Grotesk'] text-foreground">Prestations & Services Offerts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Cochez les services disponibles dans votre garage (synchronisé en temps réel avec le formulaire de partenariat).</p>
        </div>

        <div className="space-y-6">
          {SERVICE_CATEGORY_GROUPS.map((group) => (
            <div key={group.category} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--cardeal-primary)]">{group.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.subCategories.map((sub) => {
                  const checked = selectedServices.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleService(sub)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                        checked
                          ? "border-[var(--cardeal-primary)] bg-[var(--cardeal-primary)]/10 text-foreground"
                          : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        checked ? "bg-[var(--cardeal-primary)] border-[var(--cardeal-primary)] text-white" : "border-border bg-background"
                      }`}>
                        {checked && <Check size={12} />}
                      </div>
                      <span className="text-xs font-semibold leading-relaxed">{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-[--radius] bg-[var(--cardeal-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#9E1F23] transition disabled:opacity-50 shadow-lg"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Enregistrer les Modifications
        </button>
      </div>
    </form>
  );
}
