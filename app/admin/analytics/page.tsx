"use client";

import React from "react";
import { Activity, TrendingUp, Users, Car, ShieldCheck } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Analyses & Statistiques Opérationnelles</h2>
        <p className="mt-1 text-sm text-neutral-400">Métriques de performance des garages partenaires et suivi de la demande utilisateurs.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-sm">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Activity size={18} className="text-red-500" /> Flux des Rendez-vous & Devis
          </h3>
          <p className="text-xs text-neutral-400 mb-6">Évolution hebdomadaire des demandes de réparation à travers la Tunisie.</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Tunis & Grand Tunis (64%)</span>
                <span className="text-emerald-400">240 demandes</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: "64%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Sousse & Sahel (22%)</span>
                <span className="text-emerald-400">82 demandes</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Sfax & Autres Régions (14%)</span>
                <span className="text-emerald-400">52 demandes</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-sm">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" /> Taux de Satisfaction (NPS & Avis)
          </h3>
          <p className="text-xs text-neutral-400 mb-6">Évaluation globale des garages partenaires basée sur les notes Google Maps.</p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-950 border border-neutral-800 p-6 shrink-0">
              <span className="text-4xl font-extrabold text-emerald-400">4.8</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">/ 5.0 Note Moyenne</span>
            </div>
            <div className="space-y-2 text-xs text-neutral-300 flex-1">
              <p>• Plus de <strong>1,450</strong> avis clients vérifiés sur l'ensemble des partenaires.</p>
              <p>• <strong>98%</strong> des utilisateurs recommandent les garages labellisés CarDeal.</p>
              <p>• Temps de réponse moyen des garages : <strong>14 minutes</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
