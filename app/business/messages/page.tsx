"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { MessageSquare } from "lucide-react";
export default function MessagesPage() {
  return (
    <FeatureGate featureId="messages">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500"><MessageSquare size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">Messages</h1>
            <p className="text-xs text-muted-foreground">Customer conversations and notifications</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Messaging system coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
