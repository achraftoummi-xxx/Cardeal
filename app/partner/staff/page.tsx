"use client";

import React, { useEffect, useState } from "react";
import { Users, Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";
import type { PartnerStaffMember } from "@/lib/partnerTypes";

export default function PartnerStaffPage() {
  const { partnerId } = usePartnerAuth();
  const [staff, setStaff] = useState<PartnerStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<PartnerStaffMember | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "Mécanicien Principal",
    hourly_rate: 50,
    email: "",
    phone: "",
    is_active: true
  });

  const loadStaff = async () => {
    setLoading(true);
    const pId = partnerId || "mock-partner-uuid";
    try {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from("partner_staff")
          .select("*")
          .eq("partner_id", pId)
          .order("name", { ascending: true });
        if (data) setStaff(data as PartnerStaffMember[]);
      } else {
        setStaff([
          { id: "1", partner_id: pId, name: "Anis Meddeb", role: "Master Mechanic", hourly_rate: 65, email: "anis@garage.tn", phone: "98111222", is_active: true },
          { id: "2", partner_id: pId, name: "Walid Khemiri", role: "Alignment Specialist", hourly_rate: 55, email: "walid@garage.tn", phone: "22333444", is_active: true }
        ]);
      }
    } catch (err) {
      console.error("Error loading staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, [partnerId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const pId = partnerId || "mock-partner-uuid";

    try {
      if (editingStaff) {
        if (isSupabaseConfigured && supabase) {
          await supabase.from("partner_staff").update(form).eq("id", editingStaff.id);
        }
        setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...form } : s));
      } else {
        const newMember: PartnerStaffMember = {
          id: crypto.randomUUID(),
          partner_id: pId,
          ...form
        };
        if (isSupabaseConfigured && supabase) {
          await supabase.from("partner_staff").insert(newMember);
        }
        setStaff(prev => [newMember, ...prev]);
      }
      setModalOpen(false);
      setEditingStaff(null);
      setForm({ name: "", role: "Mécanicien Principal", hourly_rate: 50, email: "", phone: "", is_active: true });
    } catch (err) {
      console.error("Error saving staff:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce membre du personnel ?")) return;
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("partner_staff").delete().eq("id", id);
      }
      setStaff(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">Gestion du Personnel (Staff)</h1>
          <p className="text-sm text-muted-foreground">Roster de vos techniciens, mécaniciens et spécialistes atelier</p>
        </div>
        <button
          onClick={() => {
            setEditingStaff(null);
            setForm({ name: "", role: "Mécanicien Principal", hourly_rate: 50, email: "", phone: "", is_active: true });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-[--radius] bg-[var(--cardeal-primary)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#9E1F23] transition"
        >
          <Plus size={16} /> Ajouter un Membre
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--cardeal-primary)]" />
        </div>
      ) : staff.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Users size={40} className="mx-auto text-muted-foreground mb-3" />
          <h2 className="text-base font-bold text-foreground">Aucun personnel enregistré</h2>
          <p className="text-sm text-muted-foreground mt-1">Ajoutez vos mécaniciens pour organiser les interventions atelier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((m) => (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--cardeal-primary)]/15 text-[var(--cardeal-primary)] flex items-center justify-center font-bold text-sm">
                    {m.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    {m.hourly_rate} TND / h
                  </span>
                </div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-foreground">{m.name}</h3>
                <p className="text-xs text-[var(--cardeal-primary)] font-semibold mt-0.5">{m.role}</p>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {m.phone && <p>Tél: {m.phone}</p>}
                  {m.email && <p>Email: {m.email}</p>}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-border">
                <button
                  onClick={() => {
                    setEditingStaff(m);
                    setForm({ name: m.name, role: m.role, hourly_rate: m.hourly_rate, email: m.email || "", phone: m.phone || "", is_active: m.is_active });
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-secondary text-foreground hover:bg-accent transition"
                  title="Modifier"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(m.id!)}
                  className="p-2 rounded-lg bg-red-500/15 text-red-600 hover:bg-red-500/25 transition"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">
              {editingStaff ? "Modifier le Personnel" : "Ajouter un Technicien"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Nom & Prénom</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Rôle / Spécialité</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Taux Horaire (TND / h)</label>
                <input
                  type="number"
                  required
                  value={form.hourly_rate}
                  onChange={(e) => setForm({ ...form, hourly_rate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Téléphone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-[--radius] bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-[--radius] bg-[var(--cardeal-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9E1F23] transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
