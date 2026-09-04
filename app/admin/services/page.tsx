"use client";

import React, { useEffect, useState } from "react";
import { Wrench, Plus, Trash2, Edit2, Search } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setServices([
        { id: '1', name: 'Vidange & Filtres Complet', price: '120 DT', category: 'Entretien' },
        { id: '2', name: 'Remplacement Plaquettes de Frein', price: '180 DT', category: 'Freinage' },
        { id: '3', name: 'Diagnostic Électronique Complet', price: '90 DT', category: 'Électronique' },
        { id: '4', name: 'Recharge Climatisation', price: '110 DT', category: 'Climatisation' },
        { id: '5', name: 'Parallélisme & Géométrie', price: '70 DT', category: 'Pneumatique' },
      ]);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('services_catalog').select('*').order('name');
    setServices(data || []);
    setLoading(false);
  }

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const item = {
      id: Date.now().toString(),
      name: newServiceName.trim(),
      price: newServicePrice.trim() || '100 DT',
      category: 'Général',
    };
    setServices([item, ...services]);
    setNewServiceName("");
    setNewServicePrice("");
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const filtered = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">Gestion des Services & Catalogue</h2>
          <p className="mt-1 text-sm text-muted-foreground font-['Manrope']">Configurez les prestations proposées par les garages partenaires sur la plateforme.</p>
        </div>
      </div>

      {/* Add Service Form */}
      <form onSubmit={handleAddService} className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Nom du service (ex. Remplacement courroie)"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
          required
        />
        <input
          type="text"
          placeholder="Prix indicatif (ex. 250 DT)"
          value={newServicePrice}
          onChange={(e) => setNewServicePrice(e.target.value)}
          className="w-full sm:w-44 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
        />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cardeal-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-[#9E1F23] transition">
          <Plus size={16} /> Ajouter
        </button>
      </form>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Rechercher un service par nom ou catégorie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card/40 pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
        />
      </div>

      {/* Services Table */}
      <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs bg-secondary/60">
              <th className="p-4">Prestation</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Tarif Indicatif</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-accent/30 transition">
                <td className="p-4 font-semibold text-foreground flex items-center gap-2.5">
                  <Wrench size={16} className="text-[var(--cardeal-primary)] shrink-0" />
                  {s.name}
                </td>
                <td className="p-4">
                  <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-foreground font-medium">{s.category || 'Général'}</span>
                </td>
                <td className="p-4 font-bold text-emerald-500">{s.price}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-muted-foreground hover:text-[var(--cardeal-primary)] rounded-lg hover:bg-accent transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
