"use client";

import React, { useEffect, useState } from "react";
import { Package, Plus, Trash2, Edit2, Search, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";
import type { InventoryPart } from "@/lib/partnerTypes";

export default function PartnerInventoryPage() {
  const { partnerId } = usePartnerAuth();
  const [parts, setParts] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<InventoryPart | null>(null);

  const [form, setForm] = useState({
    sku: "",
    part_name: "",
    category: "Filtres & Vidange",
    unit_price: 50,
    stock_quantity: 10
  });

  const loadInventory = async () => {
    setLoading(true);
    const pId = partnerId || "mock-partner-uuid";
    try {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from("inventory_parts")
          .select("*")
          .eq("partner_id", pId)
          .order("part_name", { ascending: true });
        if (data) setParts(data as InventoryPart[]);
      } else {
        setParts([
          { id: "1", partner_id: pId, sku: "FLT-01", part_name: "Filtre à Huile Universel", category: "Filtres", unit_price: 25.00, stock_quantity: 15 },
          { id: "2", partner_id: pId, sku: "BRK-09", part_name: "Plaquettes de Frein Avant", category: "Freinage", unit_price: 120.00, stock_quantity: 8 }
        ]);
      }
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInventory();
  }, [partnerId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const pId = partnerId || "mock-partner-uuid";

    try {
      if (editingPart) {
        if (isSupabaseConfigured && supabase) {
          await supabase
            .from("inventory_parts")
            .update({ ...form })
            .eq("id", editingPart.id);
        }
        setParts(prev => prev.map(p => p.id === editingPart.id ? { ...p, ...form } : p));
      } else {
        const newPart: InventoryPart = {
          id: crypto.randomUUID(),
          partner_id: pId,
          ...form
        };
        if (isSupabaseConfigured && supabase) {
          await supabase.from("inventory_parts").insert(newPart);
        }
        setParts(prev => [newPart, ...prev]);
      }
      setModalOpen(false);
      setEditingPart(null);
      setForm({ sku: "", part_name: "", category: "Filtres & Vidange", unit_price: 50, stock_quantity: 10 });
    } catch (err) {
      console.error("Error saving inventory part:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette pièce de l'inventaire ?")) return;
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("inventory_parts").delete().eq("id", id);
      }
      setParts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting part:", err);
    }
  };

  const filtered = parts.filter(p =>
    p.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">Gestion des Pièces & Inventaire</h1>
          <p className="text-sm text-muted-foreground">Suivi des stocks, références SKUs et prix unitaires pour vos quotations</p>
        </div>
        <button
          onClick={() => {
            setEditingPart(null);
            setForm({ sku: "", part_name: "", category: "Filtres & Vidange", unit_price: 50, stock_quantity: 10 });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-[--radius] bg-[var(--cardeal-primary)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#9E1F23] transition"
        >
          <Plus size={16} /> Ajouter une Pièce
        </button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher par nom ou SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
        />
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--cardeal-primary)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Package size={40} className="mx-auto text-muted-foreground mb-3" />
          <h2 className="text-base font-bold text-foreground">Aucune pièce en inventaire</h2>
          <p className="text-sm text-muted-foreground mt-1">Ajoutez vos pièces de rechange pour synchroniser votre stock.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">SKU / Réf</th>
                  <th className="p-4">Désignation</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix Unitaire</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition">
                    <td className="p-4 font-mono font-semibold text-foreground">{p.sku}</td>
                    <td className="p-4 font-semibold text-foreground">{p.part_name}</td>
                    <td className="p-4 text-muted-foreground">{p.category || "—"}</td>
                    <td className="p-4 font-semibold text-foreground">{p.unit_price} TND</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        p.stock_quantity > 5 ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-600'
                      }`}>
                        {p.stock_quantity} en stock
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingPart(p);
                          setForm({ sku: p.sku, part_name: p.part_name, category: p.category || "", unit_price: p.unit_price, stock_quantity: p.stock_quantity });
                          setModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-secondary text-foreground hover:bg-accent transition"
                        title="Modifier"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id!)}
                        className="p-2 rounded-lg bg-red-500/15 text-red-600 hover:bg-red-500/25 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">
              {editingPart ? "Modifier la Pièce" : "Ajouter une Pièce"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">SKU / Réf</label>
                <input
                  type="text"
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                  placeholder="EX: FLT-001"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Désignation de la pièce</label>
                <input
                  type="text"
                  required
                  value={form.part_name}
                  onChange={(e) => setForm({ ...form, part_name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                  placeholder="EX: Plaquettes de frein avant"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Prix Unitaire (TND)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.unit_price}
                    onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Quantité Stock</label>
                  <input
                    type="number"
                    required
                    value={form.stock_quantity}
                    onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
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
