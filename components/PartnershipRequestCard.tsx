"use client";

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Wrench, 
  ShieldCheck,
  Clock,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface PartnershipRequestCardProps {
  request: PartnershipRequest;
  onAccept?: (request: PartnershipRequest) => void;
  onReject?: (request: PartnershipRequest) => void;
  className?: string;
}

export default function PartnershipRequestCard({
  request,
  onAccept,
  onReject,
  className,
}: PartnershipRequestCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(true);

  const services = Array.isArray(request.services_offered)
    ? request.services_offered
    : typeof request.services_offered === 'string'
    ? JSON.parse(request.services_offered || '[]')
    : [];

  const getInitials = (name: string) => {
    if (!name) return "AM";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={cn("w-full max-w-sm mx-auto", className)}>
      <details
        open={isOpen}
        onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)}
        className="group/card relative w-full overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b]/95 backdrop-blur-xl transition-colors duration-300 hover:border-[#3a3a3f]"
      >
        {/* Top accent */}
        <div aria-hidden="true" className="h-0.5 w-full bg-gradient-to-r from-[#4A0A0C] via-[#BA2529] to-[#932024]"></div>

        {/* SUMMARY */}
        <summary
          className="cursor-pointer select-none focus-visible:outline-none list-none [&::-webkit-details-marker]:hidden"
          aria-label="Toggle partnership request details"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 pt-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded bg-[#4A0A0C] text-[#ffdad7] ring-1 ring-inset ring-[#BA2529]/30">
                <Wrench size={16} className="text-[#ffdad7]" />
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] text-[17px] font-semibold text-[#fafafa] leading-none">
                  Partnership Request
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a]">
                  B2B · #{request.id ? request.id.slice(0, 7).toUpperCase() : 'CA-2418'}
                  <span aria-hidden="true" className="size-1 rounded-full bg-amber-500"></span>
                  <span className="text-amber-500">{request.status}</span>
                </p>
              </div>
            </div>

            {/* Collapse chevron */}
            <span
              aria-hidden="true"
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded border border-[#1f1f22] bg-[#131313]/60 text-[#71717a] transition-transform duration-300 group-hover/card:text-[#BA2529]",
                isOpen && "rotate-180"
              )}
            >
              <ChevronDown size={16} />
            </span>
          </div>

          {/* Sender */}
          <div className="mt-5 flex items-center gap-3 border-y border-[#1f1f22] bg-[#131313]/50 px-5 py-4">
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-md bg-gradient-to-br from-[#932024] to-[#4A0A0C] font-['Space_Grotesk'] text-[13px] font-semibold text-[#ffdad7] ring-1 ring-inset ring-white/5"
              >
                {getInitials(request.company_name)}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#131313] bg-emerald-500"></span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="truncate font-['Space_Grotesk'] text-[13px] font-semibold text-[#fafafa]">
                  {request.company_name}
                </h4>
                <ShieldCheck size={12} className="text-[#BA2529] shrink-0" aria-hidden="true" />
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#71717a]">
                <MapPin size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{request.address || 'Tunis, Tunisie'}</span>
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a]">Email</p>
              <p className="mt-0.5 font-['Space_Grotesk'] text-[11px] text-[#a1a1aa] truncate max-w-[100px]">{request.email}</p>
            </div>
          </div>
        </summary>

        {/* COLLAPSIBLE BODY */}
        <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            {/* Message */}
            <p className="px-5 pt-4 pb-3 text-[13px] text-[#a1a1aa] leading-relaxed">
              Nous souhaitons intégrer votre catalogue et établir un partenariat de distribution à long terme ({request.category || 'Atelier de Mécanique'}).
            </p>

            {/* Mini stats */}
            <div className="mx-5 mb-4 grid grid-cols-3 divide-x divide-[#1f1f22] overflow-hidden rounded border border-[#1f1f22] bg-[#131313]/40">
              <div className="px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a]">Phone</p>
                <p className="mt-1 font-['Space_Grotesk'] text-[12px] font-semibold text-[#fafafa] truncate">{request.phone || 'N/A'}</p>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a]">Category</p>
                <p className="mt-1 font-['Space_Grotesk'] text-[12px] font-semibold text-[#fafafa] truncate">{request.category || 'Général'}</p>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a]">Status</p>
                <p className="mt-1 font-['Space_Grotesk'] text-[12px] font-semibold text-amber-500 capitalize">
                  {request.status}
                </p>
              </div>
            </div>

            {/* SERVICE CATALOG */}
            <div className="mx-5 mb-4 overflow-hidden rounded border border-[#1f1f22] bg-[#131313]/40">
              <button
                type="button"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="w-full flex items-center justify-between gap-2 border-b border-[#1f1f22] bg-[#131313]/70 px-3.5 py-2.5 transition-colors duration-150 hover:bg-[#131313] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Wrench size={13} className="text-[#BA2529]" aria-hidden="true" />
                  <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a]">Services Offered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-sm border border-[#932024]/40 bg-[#4A0A0C]/60 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] font-bold text-[#ffdad7]">
                    {services.length}
                  </span>
                  <span className={cn("grid size-5 place-items-center rounded text-[#71717a] transition-transform duration-200", isServicesOpen && "rotate-180")} aria-hidden="true">
                    <ChevronDown size={14} />
                  </span>
                </div>
              </button>

              <div className="px-3.5 pt-3 pb-1.5">
                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a]">{request.category || 'Atelier de Mécanique & Entretien'}</p>
              </div>

              {isServicesOpen && (
                <ul className="divide-y divide-[#1f1f22]" role="list">
                  {services.length === 0 ? (
                    <li className="px-3.5 py-3 text-xs text-[#71717a] italic">Aucun service spécifique itemisé.</li>
                  ) : (
                    services.map((svc: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors duration-150 hover:bg-white/[0.02]">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm bg-[#4A0A0C] text-[#ffdad7] ring-1 ring-inset ring-[#932024]/40" aria-hidden="true">
                          <Check size={10} />
                        </span>
                        <p className="text-[13px] text-[#fafafa]">{svc}</p>
                      </li>
                    ))
                  )}
                </ul>
              )}

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="group/svc flex items-center justify-between border-t border-[#1f1f22] px-3.5 py-2.5 text-[10px] uppercase tracking-[0.14em] font-bold text-[#71717a] transition-colors duration-150 hover:bg-white/[0.02] hover:text-[#BA2529]"
              >
                View full catalog
                <span className="material-symbols-outlined text-[13px] transition-transform duration-200 group-hover/svc:translate-x-0.5" aria-hidden="true">arrow_forward</span>
              </a>
            </div>

            {/* ACTIONS */}
            <footer className="flex items-center gap-2 border-t border-[#27272a] bg-[#131313]/60 px-5 py-3.5">
              <button
                type="button"
                onClick={() => onReject?.(request)}
                className="inline-flex items-center justify-center gap-1.5 rounded px-2.5 py-2 text-[11px] uppercase tracking-[0.12em] font-bold text-[#71717a] transition-colors duration-150 hover:bg-white/[0.04] hover:text-[#a1a1aa] cursor-pointer"
              >
                <XCircle size={15} aria-hidden="true" />
                Decline
              </button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Contacting partner at ${request.email}`)}
                  className="inline-flex size-9 items-center justify-center rounded border border-[#27272a] text-[#fafafa] transition-colors duration-150 hover:border-[#3a3a3f] hover:bg-white/[0.04] cursor-pointer"
                  aria-label="Message partner"
                >
                  <Mail size={16} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onAccept?.(request)}
                  className="inline-flex items-center justify-center gap-1.5 rounded bg-[#BA2529] px-3.5 py-2 text-[11px] uppercase tracking-[0.12em] font-bold text-white shadow-[inset_0_-2px_0_0_#4A0A0C] transition-all duration-200 hover:bg-[#d94448] hover:shadow-[inset_0_-2px_0_0_#4A0A0C,0_6px_20px_-6px_rgba(186,37,41,0.7)] active:translate-y-px cursor-pointer"
                >
                  <CheckCircle2 size={15} aria-hidden="true" />
                  Accept
                </button>
              </div>
            </footer>
          </div>
        </div>
      </details>
    </div>
  );
}
