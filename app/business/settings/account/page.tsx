"use client";

import React, { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  Download,
  ArrowRightLeft,
  RotateCcw,
  Layers,
} from "lucide-react";

export default function AccountManagementPage() {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === "DELETE MY ACCOUNT";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-500">
            <Trash2 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Account Management
            </h1>
            <p className="text-xs text-muted-foreground">
              High-impact actions that affect your business account, data, and team access.
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

      {/* Export Data */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Download size={16} className="text-blue-500" />
          <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Export Data</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Download a copy of all your business data including clients, bookings,
          invoices, and financial records in CSV format.
        </p>
        <button className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors">
          Export All Data
        </button>
      </div>

      {/* Transfer Ownership */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={16} className="text-purple-500" />
          <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Transfer Ownership</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Transfer this business account to another team member. The new owner
          will have full administrative control and you will become a regular team member.
        </p>
        <div className="max-w-sm">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            New Owner Email
          </label>
          <input
            type="email"
            placeholder="new-owner@example.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <button className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors">
          Transfer Ownership
        </button>
      </div>

      {/* Remove Vertical */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-orange-500" />
          <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Remove Business Vertical</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Remove a registered business vertical from your account. Associated
          services, pricing, and job history for that vertical will be archived.
        </p>
        <div className="max-w-sm">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Select Vertical
          </label>
          <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20">
            <option value="">Choose a vertical…</option>
            <option value="car-rental">Car Rental</option>
            <option value="mechanic">Mechanic Workshop</option>
            <option value="tire-shop">Tire Shop</option>
            <option value="parts">Parts Reseller</option>
          </select>
        </div>
        <button className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 transition-colors">
          Remove Vertical
        </button>
      </div>

      {/* Reset Features */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-teal-500" />
          <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Reset Features to Defaults</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Reset all feature toggles to their default state for your account type.
          Custom overrides and manual adjustments will be lost.
        </p>
        <button className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-colors">
          Reset All Features
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
          disabled={!canDelete}
          className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Account Permanently
        </button>
      </div>
    </div>
  );
}
