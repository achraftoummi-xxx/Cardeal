"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, Database, Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    autoApprovePartners: false,
    emailAlerts: true,
    rlsStrict: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">Paramètres Système & Sécurité</h2>
        <p className="mt-1 text-sm text-muted-foreground font-['Manrope']">Configurez les règles globales de la plateforme et les options de sécurité Supabase.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-['Space_Grotesk']">
              <Shield size={16} className="text-[var(--cardeal-primary)]" /> Mode Maintenance
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Suspend temporairement l'accès au public pour mise à jour.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="h-5 w-5 rounded border-border bg-background text-[var(--cardeal-primary)] focus:ring-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-['Space_Grotesk']">
              <Bell size={16} className="text-amber-500" /> Alertes Email Administrateur
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Envoie une notification immédiate lors d'une nouvelle demande de partenariat.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailAlerts}
            onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
            className="h-5 w-5 rounded border-border bg-background text-[var(--cardeal-primary)] focus:ring-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pb-2">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-['Space_Grotesk']">
              <Database size={16} className="text-emerald-500" /> Isolation RLS Supabase Stricte
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Force l'isolation complète des données véhicules et devis par utilisateur.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.rlsStrict}
            onChange={(e) => setSettings({ ...settings, rlsStrict: e.target.checked })}
            className="h-5 w-5 rounded border-border bg-background text-[var(--cardeal-primary)] focus:ring-0 cursor-pointer"
          />
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <Check size={16} /> Paramètres enregistrés avec succès
            </span>
          )}
          <button type="submit" className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[var(--cardeal-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#9E1F23] transition">
            <Save size={16} /> Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
