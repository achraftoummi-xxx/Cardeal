"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

export default function DangerSettingsPage() {
  const [confirmText, setConfirmText] = useState("");
  const canDeactivate = confirmText === "DELETE MY ACCOUNT";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-500">
            <Trash2 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Danger Zone
            </h1>
            <p className="text-xs text-muted-foreground">
              Account deactivation and deletion — these actions are irreversible
            </p>
          </div>
        </div>
      </div>

      {/* Deactivation */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Deactivate Account</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Deactivating your account will hide your profile from customers and pause all
          active bookings. You can reactivate at any time by logging back in.
        </p>
        <button className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors">
          Deactivate Account
        </button>
      </div>

      {/* Deletion */}
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-red-500" />
          <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Delete Account Permanently</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          This will permanently delete your account, all associated data, booking history,
          and financial records. This action cannot be undone.
        </p>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Type <span className="font-bold text-red-500">DELETE MY ACCOUNT</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE MY ACCOUNT"
            className="w-full max-w-sm rounded-xl border border-red-500/30 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
        <button
          disabled={!canDeactivate}
          className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Account Permanently
        </button>
      </div>
    </div>
  );
}
