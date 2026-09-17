"use client";

import React from "react";
import { Users, Plus, Shield, UserCheck, Eye } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";

const MOCK_MEMBERS = [
  { name: "Achref Mokhtari", email: "achref@cardeal.tn", role: "owner", status: "active" },
  { name: "Mohamed Toumi", email: "toumi@cardeal.tn", role: "manager", status: "active" },
];

const ROLE_BADGES: Record<string, string> = {
  owner: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  manager: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  staff: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  viewer: "bg-muted text-muted-foreground",
};

export default function TeamSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
                {t("business.settings.team.title")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("business.settings.team.description")}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors">
            <Plus size={14} />
            {t("business.settings.team.inviteMember")}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {MOCK_MEMBERS.map((m, i) => (
          <div
            key={m.email}
            className={`flex items-center gap-4 px-6 py-4 ${
              i < MOCK_MEMBERS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
              {m.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">{m.email}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${ROLE_BADGES[m.role] || ROLE_BADGES.viewer}`}>
              {m.role}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
