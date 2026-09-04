"use client";

import React from "react";
import { Activity, TrendingUp, Users, Car, ShieldCheck } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">Analyses & Statistiques Opérationnelles</h2>
        <p className="mt-1 text-sm text-muted-foreground font-['Manrope']">Métriques de performance des garages partenaires et suivi de la demande utilisateurs.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2 font-['Space_Grotesk']">
            <Activity size={18} className="text-[var(--cardeal-primary)]" /> Flux des Rendez-vous & Devis
          </h3>
          <p className="text-xs text-muted-foreground mb-6">Évolution hebdomadaire des demandes de réparation à travers la Tunisie.</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-foreground">
                <span>Tunis & Grand Tunis (64%)</span>
                <span className="text-emerald-500">240 demandes</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-[var(--cardeal-primary)] rounded-full" style={{ width: "64%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-foreground">
                <span>Sousse & Sahel (22%)</span>
                <span className="text-emerald-500">82 demandes</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-foreground">
                <span>Sfax & Autres Régions (14%)</span>
                <span className="text-emerald-500">52 demandes</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2 font-['Space_Grotesk']">
            <TrendingUp size={18} className="text-emerald-500" /> Taux de Satisfaction (NPS & Avis)
          </h3>
          <p className="text-xs text-muted-foreground mb-6">Évaluation globale des garages partenaires basée sur les notes Google Maps.</p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-background border border-border p-6 shrink-0">
              <span className="text-4xl font-extrabold text-emerald-500 font-['Space_Grotesk']">4.8</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">/ 5.0 Note Moyenne</span>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground flex-1">
              <p>• Plus de <strong className="text-foreground">1,450</strong> avis clients vérifiés sur l'ensemble des partenaires.</p>
              <p>• <strong className="text-foreground">98%</strong> des utilisateurs recommandent les garages labellisés CarDeal.</p>
              <p>• Temps de réponse moyen des garages : <strong className="text-foreground">14 minutes</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
