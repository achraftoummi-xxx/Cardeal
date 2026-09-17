"use client";

import React from "react";
import { ShieldCheck, Key, Smartphone, Monitor, LogOut } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Security
            </h1>
            <p className="text-xs text-muted-foreground">
              Password, two-factor authentication, and active sessions
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Key size={16} className="text-muted-foreground" />
          Change Password
        </h2>
        <div className="space-y-3 max-w-sm">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Password</label>
            <input type="password" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">New Password</label>
            <input type="password" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
            <input type="password" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <button className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Auth */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Smartphone size={16} className="text-muted-foreground" />
          Two-Factor Authentication
        </h2>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 px-4 py-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">2FA is not enabled</p>
            <p className="text-[11px] text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <button className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Monitor size={16} className="text-muted-foreground" />
          Active Sessions
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 px-4 py-3">
            <Monitor size={18} className="text-emerald-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Chrome on Windows — Current Session</p>
              <p className="text-[11px] text-muted-foreground">Tunis, Tunisia · Last active just now</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
