"use client";

import React from "react";
import { Bell, Save, Mail, MessageSquare, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

const EVENTS = [
  { id: "new_booking", label: "New Booking" },
  { id: "quote_request", label: "Quote Request" },
  { id: "message_received", label: "Message Received" },
  { id: "payment_received", label: "Payment Received" },
  { id: "review_posted", label: "Review Posted" },
  { id: "team_joined", label: "Team Member Joined" },
];

const CHANNELS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "push", label: "Push", icon: BellRing },
];

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Notifications
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure event-by-channel notification preferences
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="flex items-center gap-4 border-b border-border px-6 py-3 bg-secondary/30">
          <span className="w-40 text-xs font-bold uppercase tracking-wider text-muted-foreground">Event</span>
          <div className="flex gap-6 ml-auto">
            {CHANNELS.map((ch) => (
              <span key={ch.id} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-16 justify-center">
                <ch.icon size={12} />
                {ch.label}
              </span>
            ))}
          </div>
        </div>

        {/* Event rows */}
        {EVENTS.map((ev, i) => (
          <div
            key={ev.id}
            className={`flex items-center gap-4 px-6 py-3 ${
              i < EVENTS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="w-40 text-sm font-medium text-foreground">{ev.label}</span>
            <div className="flex gap-6 ml-auto">
              {CHANNELS.map((ch) => (
                <label key={ch.id} className="flex w-16 justify-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={ch.id === "email"}
                    className="h-4 w-4 rounded border-border accent-emerald-500"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Digest & Quiet Hours */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Digest & Quiet Hours</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Digest Frequency
            </label>
            <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20">
              <option value="realtime">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quiet Hours (Do Not Disturb)
            </label>
            <div className="flex items-center gap-2">
              <input type="time" defaultValue="22:00" className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
              <span className="text-xs text-muted-foreground">to</span>
              <input type="time" defaultValue="07:00" className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
