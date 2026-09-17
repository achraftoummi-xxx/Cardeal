"use client";

import React, { useState } from "react";
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";

const MOCK_KEYS = [
  { id: "key_1", name: "Production API Key", prefix: "cd_live_****", created: "2025-01-15", lastUsed: "2 hours ago" },
  { id: "key_2", name: "Staging API Key", prefix: "cd_test_****", created: "2025-03-20", lastUsed: "Never" },
];

export default function ApiSettingsPage() {
  const [showKey, setShowKey] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
              <Key size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
                API Access
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage API keys and webhook endpoints
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors">
            <Plus size={14} />
            Generate Key
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {MOCK_KEYS.map((k, i) => (
          <div
            key={k.id}
            className={`flex items-center gap-4 px-6 py-4 ${
              i < MOCK_KEYS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <Key size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{k.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{k.prefix}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                Created {k.created} · Last used {k.lastUsed}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" title="Copy key">
                <Copy size={14} />
              </button>
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" title="Delete key">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Webhooks */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Webhook Endpoints</h2>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Endpoint URL</label>
          <input type="url" placeholder="https://your-server.com/webhooks/cardeal" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Signing Secret</label>
          <input type="password" placeholder="whsec_..." className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
        </div>
      </div>
    </div>
  );
}
