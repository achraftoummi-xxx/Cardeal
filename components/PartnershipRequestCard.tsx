"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface PartnershipRequest {
  id: string;
  company_name: string;
  email: string;
  phone?: string | null;
  category?: string | null;
  services_offered?: string[] | string | null;
  address?: string | null;
  status: 'pending' | 'accepted' | 'denied';
  created_at?: string;
  establishment_type?: string | null;
}

export interface PartnershipPartner {
  name: string;
  initials?: string;
  verified?: boolean;
  location?: string;
}

export interface PartnershipStat {
  id: string;
  label: string;
  value: string;
}

export type PartnershipStatus = 'pending' | 'accepted' | 'declined' | 'denied';

export interface PartnershipRequestCardProps {
  title?: string;
  eyebrow?: string;
  partner?: PartnershipPartner;
  request?: PartnershipRequest;
  message?: string;
  status?: PartnershipStatus;
  statusLabel?: string;
  stats?: PartnershipStat[];
  servicesList?: { category: string; items: string[] };
  onAccept?: ((request: PartnershipRequest) => void) | (() => void | Promise<void>);
  onReject?: ((request: PartnershipRequest) => void) | (() => void | Promise<void>);
  onDecline?: (() => void | Promise<void>);
  onMessage?: () => void | Promise<void>;
  isBusy?: boolean;
  className?: string;
}

export default function PartnershipRequestCard({
  title = 'Partnership Request',
  eyebrow = 'B2B · #CA-2418',
  partner: partnerProp,
  request,
  message: messageProp,
  status: statusProp,
  statusLabel: statusLabelProp,
  stats = [
    { id: 'fleet', label: 'Fleet', value: '240+' },
    { id: 'since', label: 'Since', value: '2009' },
    { id: 'reply', label: 'Reply', value: '~2d' },
  ],
  servicesList: servicesListProp,
  onAccept,
  onReject,
  onDecline,
  onMessage,
  isBusy = false,
  className,
}: PartnershipRequestCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const partner = partnerProp || {
    name: request?.company_name || 'AutoMaroc Group',
    initials: request?.company_name ? request.company_name.slice(0, 2).toUpperCase() : 'AM',
    verified: true,
    location: request?.address || 'Casablanca, Maroc',
  };

  const services = request?.services_offered
    ? (Array.isArray(request.services_offered) ? request.services_offered : JSON.parse(request.services_offered || '[]'))
    : [
        'Révisions et Vidange',
        'Plaquettes de freins Avant (Remplacement)',
        'Courroie de distribution - Kit complet (Remplacement)',
        'Amortisseurs Avants (Remplacement)',
        'Embrayage - Kit complet (Remplacement)',
      ];

  const servicesList = servicesListProp || {
    category: request?.category || 'Atelier de Mécanique & Entretien',
    items: services,
  };

  const message = messageProp || (request?.email ? `Demande de partenariat reçue de ${request.email}. Nous souhaitons intégrer votre catalogue et établir un partenariat de distribution à long terme.` : 'Nous souhaitons intégrer votre catalogue et établir un partenariat de distribution à long terme.');

  const rawStatus = request?.status || statusProp || 'pending';
  const status = rawStatus === 'denied' ? 'declined' : rawStatus;
  const statusLabel = statusLabelProp || (status === 'accepted' ? 'Accepted' : status === 'declined' ? 'Declined' : 'Pending');

  const handleAccept = () => {
    if (request && onAccept) {
      (onAccept as (r: PartnershipRequest) => void)(request);
    } else if (onAccept) {
      (onAccept as () => void)();
    }
  };

  const handleDecline = () => {
    if (request && onReject) {
      (onReject as (r: PartnershipRequest) => void)(request);
    } else if (request && onDecline) {
      (onDecline as () => void)();
    } else if (onDecline) {
      onDecline();
    }
  };

  return (
    <details
      className={cn(
        'animate-fade-up group/card relative w-full max-w-sm overflow-hidden rounded-lg border border-[var(--border-default,#27272a)] bg-[var(--surface-2,#18181b)]/95 backdrop-blur-xl transition-colors duration-300 hover:border-[var(--border-strong,#3a3a3f)]',
        className
      )}
      open={isOpen}
      onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      {/* Top accent */}
      <div aria-hidden="true" className="h-0.5 w-full bg-gradient-to-r from-[var(--brand-700,#4A0A0C)] via-[var(--brand-400,#BA2529)] to-[var(--brand-500,#932024)]" />

      {/* SUMMARY */}
      <summary
        className="cursor-pointer select-none focus-visible:outline-none list-none [&::-webkit-details-marker]:hidden"
        aria-label="Toggle partnership request details"
      >
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded bg-[var(--brand-700,#4A0A0C)] text-[var(--brand-100,#ffdad7)] ring-1 ring-inset ring-[var(--brand-400,#BA2529)]/30">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">handshake</span>
            </div>
            <div>
              <h3 className="font-display text-[17px] font-semibold text-[var(--fg-primary,#fafafa)] leading-none">
                {title}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fg-tertiary,#71717a)]">
                {eyebrow}
                <span aria-hidden="true" className="size-1 rounded-full bg-[var(--warning,#f59e0b)]" />
                <span className="text-[var(--warning,#f59e0b)]">{statusLabel}</span>
              </p>
            </div>
          </div>

          <span
            aria-hidden="true"
            className={cn(
              'chevron grid size-7 shrink-0 place-items-center rounded border border-[var(--border-subtle,#1f1f22)] bg-[var(--surface-1,#131313)]/60 text-[var(--fg-tertiary,#71717a)] transition-transform duration-300',
              isOpen && 'rotate-180'
            )}
          >
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </span>
        </div>

        {/* Sender block */}
        <div className="mt-5 flex items-center gap-3 border-y border-[var(--border-subtle,#1f1f22)] bg-[var(--surface-1,#131313)]/50 px-5 py-4">
          <div className="relative shrink-0">
            <div
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-md bg-gradient-to-br from-[var(--brand-500,#932024)] to-[var(--brand-700,#4A0A0C)] font-display text-[13px] font-semibold text-[var(--brand-100,#ffdad7)] ring-1 ring-inset ring-white/5"
            >
              {partner.initials || 'AM'}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[var(--surface-2,#18181b)] bg-[var(--success,#22c55e)]"></span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="truncate font-display text-[13px] font-semibold text-[var(--fg-primary,#fafafa)]">
                {partner.name}
              </h4>
              {partner.verified && (
                <span className="material-symbols-outlined text-[12px] text-[var(--brand-400,#BA2529)]" aria-hidden="true">verified</span>
              )}
            </div>
            {partner.location && (
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--fg-tertiary,#71717a)]">
                <span className="material-symbols-outlined text-[12px]" aria-hidden="true">location_on</span>
                {partner.location}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fg-tertiary,#71717a)]">{stats[0]?.label || 'Fleet'}</p>
            <p className="mt-0.5 font-display text-[13px] font-semibold text-[var(--fg-primary,#fafafa)]">{stats[0]?.value || '240+'}</p>
          </div>
        </div>
      </summary>

      {/* COLLAPSIBLE BODY (Grid Template Rows animation) */}
      <div className={cn("collapse-grid", isOpen && "is-open")}>
        <div className="collapse-inner">
          {/* Message */}
          <p className="px-5 pt-4 pb-3 text-[13px] leading-[1.55] text-[var(--fg-secondary,#a1a1aa)]">
            {message}
          </p>

          {/* Mini stats */}
          {stats.length > 0 && (
            <div className="mx-5 mb-4 grid grid-cols-3 divide-x divide-[var(--border-subtle,#1f1f22)] overflow-hidden rounded border border-[var(--border-subtle,#1f1f22)] bg-[var(--surface-1,#131313)]/40">
              {stats.map((stat) => (
                <div key={stat.id} className="px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fg-tertiary,#71717a)]">{stat.label}</p>
                  <p className="mt-1 font-display text-[13px] font-semibold text-[var(--fg-primary,#fafafa)]">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* SERVICE CATALOG (nested collapsible) */}
          {servicesList && (
            <details className="mx-5 mb-4 overflow-hidden rounded border border-[var(--border-subtle,#1f1f22)] bg-[var(--surface-1,#131313)]/40 group/catalog">
              <summary className="flex cursor-pointer select-none items-center justify-between gap-2 border-b border-[var(--border-subtle,#1f1f22)] bg-[var(--surface-1,#131313)]/70 px-3.5 py-2.5 transition-colors duration-150 hover:bg-[var(--surface-1,#131313)] list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[13px] text-[var(--brand-400,#BA2529)]" aria-hidden="true">build</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fg-tertiary,#71717a)]">Services Offered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-sm border border-[var(--brand-500,#932024)]/40 bg-[var(--brand-700,#4A0A0C)]/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-100,#ffdad7)]">
                    {servicesList.items.length}
                  </span>
                  <span className="chevron grid size-5 place-items-center rounded text-[var(--fg-tertiary,#71717a)]" aria-hidden="true">
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </span>
                </div>
              </summary>

              <div className="px-3.5 pt-3 pb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fg-tertiary,#71717a)]">{servicesList.category}</p>
              </div>

              <ul className="divide-y divide-[var(--border-subtle,#1f1f22)]" role="list">
                {servicesList.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors duration-150 hover:bg-white/[0.02]">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm bg-[var(--brand-700,#4A0A0C)] text-[var(--brand-100,#ffdad7)] ring-1 ring-inset ring-[var(--brand-500,#932024)]/40" aria-hidden="true">
                      <span className="material-symbols-outlined text-[10px]">check</span>
                    </span>
                    <p className="text-[13px] text-[var(--fg-primary,#fafafa)]">{item}</p>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="group/svc flex items-center justify-between border-t border-[var(--border-subtle,#1f1f22)] px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fg-tertiary,#71717a)] transition-colors duration-150 hover:bg-white/[0.02] hover:text-[var(--brand-400,#BA2529)]"
              >
                View full catalog
                <span className="material-symbols-outlined text-[13px] transition-transform duration-200 group-hover/svc:translate-x-0.5" aria-hidden="true">arrow_forward</span>
              </a>
            </details>
          )}

          {/* ACTIONS FOOTER */}
          <footer className="flex items-center gap-2 border-t border-[var(--border-default,#27272a)] bg-[var(--surface-1,#131313)]/60 px-5 py-3.5">
            <button
              type="button"
              disabled={isBusy}
              onClick={handleDecline}
              className="inline-flex items-center justify-center gap-1.5 rounded px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-tertiary,#71717a)] transition-colors duration-150 hover:bg-white/[0.04] hover:text-[var(--fg-secondary,#a1a1aa)] disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">block</span>
              Decline
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                disabled={isBusy}
                onClick={onMessage}
                className="inline-flex size-9 items-center justify-center rounded border border-[var(--border-default,#27272a)] text-[var(--fg-primary,#fafafa)] transition-colors duration-150 hover:border-[var(--border-strong,#3a3a3f)] hover:bg-white/[0.04] disabled:opacity-50 cursor-pointer"
                aria-label="Message partner"
              >
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">chat_bubble</span>
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={handleAccept}
                className="group/btn inline-flex items-center justify-center gap-1.5 rounded bg-[var(--brand-400,#BA2529)] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[inset_0_-2px_0_0_#4A0A0C] transition-all duration-200 hover:bg-[var(--brand-300,#d94448)] hover:shadow-[inset_0_-2px_0_0_#4A0A0C,0_6px_20px_-6px_rgba(186,37,41,0.7)] active:translate-y-px disabled:opacity-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">check_circle</span>
                Accept
              </button>
            </div>
          </footer>
        </div>
      </div>
    </details>
  );
}

PartnershipRequestCard.displayName = 'PartnershipRequestCard';
