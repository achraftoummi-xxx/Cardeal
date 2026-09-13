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
  ExternalLink
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
  const [showMoreServices, setShowMoreServices] = useState(false);

  const services = Array.isArray(request.services_offered)
    ? request.services_offered
    : typeof request.services_offered === 'string'
    ? JSON.parse(request.services_offered || '[]')
    : [];

  const mainServices = services.slice(0, 3);
  const extraServices = services.slice(3);

  // Helper to generate initials for monogram avatar
  const getInitials = (name: string) => {
    if (!name) return "CD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto space-y-3", className)}>
      {/* Context Label / Breadcrumb Hint */}
      <div className="flex items-center justify-between px-2 text-xs font-medium text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--cardeal-primary)]/10 border border-[var(--cardeal-primary)]/30 text-red-400 text-[11px] font-mono font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cardeal-primary)] animate-pulse"></span>
            {request.status === 'pending' ? 'NOUVELLE DEMANDE' : request.status.toUpperCase()}
          </span>
          <span className="text-neutral-500 font-mono">ID #{request.id ? request.id.slice(0, 8).toUpperCase() : 'REQ-2023'}</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Clock size={13} className="text-neutral-500" /> 
            {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'Récemment'}
          </span>
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1 text-[11px] text-neutral-400">
            <Building2 size={13} className="text-neutral-500" /> Réseau Tunisie
          </span>
        </div>
      </div>

      {/* MAIN REDESIGNED CARD */}
      <article
        id={`partnership-request-${request.id}`}
        className="group relative rounded-2xl bg-[#14161b]/95 border border-white/[0.08] hover:border-[var(--cardeal-primary)]/40 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.45)] hover:shadow-[0_12px_40px_rgba(186,37,41,0.12)] overflow-hidden"
      >
        {/* Subtle top glowing brand gradient line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cardeal-primary)]/80 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>

        <div className="p-5 md:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          
          {/* LEFT SECTION: Applicant Profile & Identity */}
          <div className="flex items-start gap-4 sm:gap-4.5 min-w-[280px] shrink-0">
            {/* Monogram Avatar */}
            <div className="relative shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#232731] to-[#16181f] border border-white/10 flex items-center justify-center font-mono font-bold text-base sm:text-lg text-white shadow-inner tracking-wider">
                {getInitials(request.company_name)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#14161b] flex items-center justify-center border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              </span>
            </div>

            {/* Name & Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono font-bold text-lg text-white tracking-tight leading-tight group-hover:text-red-100 transition-colors">
                  {request.company_name}
                </h3>
                {/* Badge: Type de partenariat */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-950/50 border border-red-800/40 text-red-300">
                  <Tag size={12} className="text-red-400" />
                  Partenariat
                </span>
              </div>

              {/* Email address with copy/link styling */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
                <Mail size={14} className="text-neutral-500" />
                <a href={`mailto:${request.email}`} className="hover:underline font-mono">{request.email}</a>
              </div>

              {/* Business Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-neutral-300 text-[11px]">
                  <Wrench size={13} className="text-red-400" />
                  {request.category || 'Atelier de Mécanique'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                  <ShieldCheck size={13} className="text-neutral-500" /> Garage Certifié
                </span>
              </div>
            </div>
          </div>

          {/* CENTER SECTION: Proposed Services (Structured Tags) */}
          <div className="flex-1 lg:px-6 lg:border-l lg:border-r border-white/[0.06] flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Wrench size={16} className="text-[var(--cardeal-primary)]" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-neutral-400">
                  Services Proposés ({services.length})
                </span>
              </div>
              {request.address && (
                <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin size={12} className="text-neutral-500 shrink-0" />
                  <span className="truncate">{request.address}</span>
                </span>
              )}
            </div>

            {/* Chips Grid / Wrap */}
            <div className="flex flex-wrap gap-2 items-center">
              {mainServices.map((svc: string, idx: number) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1d24] border border-white/[0.08] hover:border-red-500/30 text-xs text-neutral-200 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--cardeal-primary)]"></span>
                  {svc}
                </span>
              ))}

              {extraServices.length > 0 && (
                <div className="relative group/more">
                  <button 
                    type="button" 
                    onClick={() => setShowMoreServices(!showMoreServices)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#20242e] border border-white/10 hover:border-white/20 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-red-400 font-semibold">+{extraServices.length} autres</span>
                    <ChevronDown size={15} className={cn("text-neutral-400 transition-transform", showMoreServices && "rotate-180")} />
                  </button>
                  
                  {/* Popover preview of hidden services */}
                  {(showMoreServices || false) && (
                    <div className="absolute left-0 bottom-full mb-2 flex flex-col gap-1.5 p-2.5 bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl z-20 min-w-[260px]">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1 pb-1 border-b border-white/5">Autres prestations demandées</div>
                      {extraServices.map((svc: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 px-1 py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cardeal-primary)]"></span>
                          {svc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {services.length === 0 && (
                <span className="text-xs text-neutral-500 italic">Aucun service spécifique détaillé.</span>
              )}
            </div>
          </div>

          {/* RIGHT SECTION: Distinct Actions (Accept / Refuse) */}
          <div className="flex items-center sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
            {request.status === 'pending' ? (
              <>
                {/* Refuse Button */}
                <button 
                  type="button" 
                  onClick={() => onReject?.(request)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 hover:border-red-700/60 text-red-300 hover:text-red-200 text-xs font-mono font-medium tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <XCircle size={16} className="text-red-400" />
                  Refuser
                </button>

                {/* Accept Button */}
                <button 
                  type="button" 
                  onClick={() => onAccept?.(request)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400/60 text-emerald-300 hover:text-emerald-100 text-xs font-mono font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Accepter
                </button>
              </>
            ) : (
              <span className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider",
                request.status === 'accepted' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"
              )}>
                {request.status === 'accepted' ? 'Accepté' : 'Refusé'}
              </span>
            )}
          </div>

        </div>

        {/* Quick footer metadata strip inside card */}
        <div className="px-5 py-2 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-neutral-600" />
            Conforme charte qualité CarDeal 2024
          </span>
          {request.phone && (
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Phone size={12} className="text-neutral-500" />
              {request.phone}
            </span>
          )}
        </div>

      </article>
    </div>
  );
}
