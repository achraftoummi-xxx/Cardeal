"use client";

import React from "react";
import { Bell, Save, Mail, MessageSquare, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

const EVENT_KEYS = [
  { id: "new_booking", key: "business.settings.notifications.events.newBooking" },
  { id: "quote_request", key: "business.settings.notifications.events.quoteRequest" },
  { id: "message_received", key: "business.settings.notifications.events.messageReceived" },
  { id: "payment_received", key: "business.settings.notifications.events.paymentReceived" },
  { id: "review_posted", key: "business.settings.notifications.events.reviewPosted" },
  { id: "team_joined", key: "business.settings.notifications.events.teamJoined" },
];

const CHANNEL_KEYS = [
  { id: "email", key: "business.settings.notifications.channels.email", icon: Mail },
  { id: "sms", key: "business.settings.notifications.channels.sms", icon: MessageSquare },
  { id: "push", key: "business.settings.notifications.channels.push", icon: BellRing },
];

export default function NotificationsSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.notifications.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.notifications.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="flex items-center gap-4 border-b border-border px-6 py-3 bg-secondary/30">
          <span className="w-40 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("business.settings.notifications.eventHeader")}</span>
          <div className="flex gap-6 ml-auto">
            {CHANNEL_KEYS.map((ch) => (
              <span key={ch.id} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-16 justify-center">
                <ch.icon size={12} />
                {t(ch.key)}
              </span>
            ))}
          </div>
        </div>

        {/* Event rows */}
        {EVENT_KEYS.map((ev, i) => (
          <div
            key={ev.id}
            className={`flex items-center gap-4 px-6 py-3 ${
              i < EVENT_KEYS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="w-40 text-sm font-medium text-foreground">{t(ev.key)}</span>
            <div className="flex gap-6 ml-auto">
              {CHANNEL_KEYS.map((ch) => (
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
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">{t("business.settings.notifications.digest")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("business.settings.notifications.digestFrequency")}
            </label>
            <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20">
              <option value="realtime">{t("business.settings.notifications.frequencyOptions.realtime")}</option>
              <option value="hourly">{t("business.settings.notifications.frequencyOptions.hourly")}</option>
              <option value="daily">{t("business.settings.notifications.frequencyOptions.daily")}</option>
              <option value="weekly">{t("business.settings.notifications.frequencyOptions.weekly")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("business.settings.notifications.quietHours")}
            </label>
            <div className="flex items-center gap-2">
              <input type="time" defaultValue="22:00" className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
              <span className="text-xs text-muted-foreground">{t("business.settings.hours.to")}</span>
              <input type="time" defaultValue="07:00" className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          {t("business.settings.notifications.save")}
        </Button>
      </div>
    </div>
  );
}
