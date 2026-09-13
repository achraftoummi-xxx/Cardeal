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
  Clock
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
  const [isExpanded, setIsExpanded] = useState(false);

  const services = Array.isArray(request.services_offered)
    ? request.services_offered
    : typeof request.services_offered === 'string'
    ? JSON.parse(request.services_offered || '[]')
    : [];

  return (
    <article
      id={`partnership-request-${request.id}`}
      onClick={() => setIsExpanded((prev) => !prev)}
      className={cn(
        "group cursor-pointer rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-500/30",
        className
      )}
    >
      {/* Compact Main Card Row */}
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
            <Building2 size={20} />
          </div>
          <div className="min-w-0 flex-1 flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <h3 className="text-base font-bold text-foreground font-['Space_Grotesk'] truncate">
              {request.company_name}
            </h3>
            <span
              className={cn(
                "rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0",
                request.status === 'accepted'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : request.status === 'denied'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
              )}
            >
              {request.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          {request.status === 'pending' && (
            <div className="flex items-center gap-2">
              {onAccept && (
                <button
                  type="button"
                  onClick={() => onAccept(request)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30 transition shadow-sm"
                  aria-label={`Accept ${request.company_name}`}
                >
                  <CheckCircle2 size={14} />
                  <span className="hidden sm:inline">Accept</span>
                </button>
              )}
              {onReject && (
                <button
                  type="button"
                  onClick={() => onReject(request)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-secondary border border-border px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-accent transition shadow-sm"
                  aria-label={`Reject ${request.company_name}`}
                >
                  <XCircle size={14} />
                  <span className="hidden sm:inline">Reject</span>
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-9 h-9 rounded-xl border border-border bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expandable Detailed View */}
      {isExpanded && (
        <div 
          className="border-t border-border bg-secondary/30 p-6 space-y-6 animate-fadeIn" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header metadata */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-['Space_Grotesk']">
              <Tag size={14} className="text-blue-500" />
              Automotive Service Partnership Application Details
            </h4>
            {request.created_at && (
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock size={12} className="text-blue-500" />
                Submitted on {new Date(request.created_at).toLocaleString()}
              </span>
            )}
          </div>

          {/* Core Structured Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Partner Name & Establishment */}
            <div className="bg-card border border-border p-4 rounded-xl space-y-1.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-['Space_Grotesk']">
                <Building2 size={13} className="text-blue-500" /> Partner Name
              </span>
              <div className="text-sm font-bold text-foreground">
                {request.company_name}
              </div>
              {request.establishment_type && (
                <span className="inline-block text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                  {request.establishment_type}
                </span>
              )}
            </div>

            {/* Contact Email */}
            <div className="bg-card border border-border p-4 rounded-xl space-y-1.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-['Space_Grotesk']">
                <Mail size={13} className="text-blue-500" /> Email Address
              </span>
              <a
                href={`mailto:${request.email}`}
                className="text-sm font-semibold text-blue-500 hover:underline block truncate"
              >
                {request.email}
              </a>
            </div>

            {/* Phone Number */}
            <div className="bg-card border border-border p-4 rounded-xl space-y-1.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-['Space_Grotesk']">
                <Phone size={13} className="text-blue-500" /> Phone Number
              </span>
              <a
                href={request.phone ? `tel:${request.phone}` : undefined}
                className={cn(
                  "text-sm font-semibold block truncate",
                  request.phone ? "text-foreground hover:text-blue-500" : "text-muted-foreground italic"
                )}
              >
                {request.phone || 'Not provided'}
              </a>
            </div>

            {/* Business Category */}
            <div className="bg-card border border-border p-4 rounded-xl space-y-1.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-['Space_Grotesk']">
                <ShieldCheck size={13} className="text-blue-500" /> Service Category
              </span>
              <span className="text-sm font-bold text-foreground block truncate">
                {request.category || 'General Automotive Service'}
              </span>
            </div>

            {/* Workshop Address */}
            <div className="bg-card border border-border p-4 rounded-xl space-y-1.5 shadow-sm sm:col-span-2 lg:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-['Space_Grotesk']">
                <MapPin size={13} className="text-blue-500" /> Workshop Location & Address
              </span>
              <div className="text-sm font-medium text-foreground flex items-start gap-1.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-blue-500" />
                <span>{request.address || 'Address details pending verification'}</span>
              </div>
            </div>
          </div>

          {/* Itemized Services Offered Array */}
          <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-['Space_Grotesk']">
                <Wrench size={14} className="text-blue-500" />
                Services Offered & Workshop Capabilities
              </span>
              <span className="rounded-full bg-blue-500/10 text-blue-500 px-2 py-0.5 text-xs font-semibold">
                {services.length} {services.length === 1 ? 'service' : 'services'}
              </span>
            </div>

            {services.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-1">
                No specific maintenance services itemized in this partnership application.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {services.map((svc: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/25 shadow-sm transition hover:bg-blue-500/20"
                  >
                    <Wrench size={12} className="shrink-0" />
                    <span>{svc}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
