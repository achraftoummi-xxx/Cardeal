"use client";

import React from "react";
import { CreditCard, Check } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    features: ["5 bookings/month", "Basic analytics", "Email support", "1 team member"],
    current: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: "49 TND/mo",
    features: ["Unlimited bookings", "Advanced analytics", "Priority support", "10 team members", "Invoicing", "API access"],
    current: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "149 TND/mo",
    features: ["Everything in Pro", "Unlimited team", "Custom integrations", "Dedicated account manager", "SLA guarantee"],
    current: false,
  },
];

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Subscription & Billing
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your plan and usage metrics
            </p>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">Current Usage</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <UsageStat label="Bookings" value="23" limit="Unlimited" />
          <UsageStat label="Team Members" value="2" limit="10" />
          <UsageStat label="API Calls" value="1,247" limit="10,000/mo" />
          <UsageStat label="Storage" value="180 MB" limit="1 GB" />
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border bg-card p-6 shadow-sm ${
              plan.current
                ? "border-emerald-500/50 ring-2 ring-emerald-500/20"
                : "border-border"
            }`}
          >
            {plan.current && (
              <span className="mb-3 inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Current Plan
              </span>
            )}
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-foreground">{plan.name}</h3>
            <p className="mt-1 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check size={14} className="shrink-0 text-emerald-500 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {!plan.current && (
              <button className="mt-6 w-full rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
                {plan.id === "enterprise" ? "Contact Sales" : "Upgrade"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageStat({
  label,
  value,
  limit,
}: {
  label: string;
  value: string;
  limit: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-extrabold font-['Space_Grotesk'] text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground/70">{limit}</p>
    </div>
  );
}
