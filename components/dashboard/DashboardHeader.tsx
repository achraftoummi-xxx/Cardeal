"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  MapPin,
  ChevronDown,
  Menu,
  MessageCircle,
  LogOut,
  Settings,
  User,
  Check,
  ShieldAlert,
} from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { cn } from "@/lib/utils";
import { useDashboard } from "./DashboardContext";
import { CITY_OPTIONS, DASHBOARD_MESSAGES, DASHBOARD_NOTIFICATIONS, getUserName } from "@/data/dashboard";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { setAuthenticated } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import { useAdminRole } from "@/components/admin/useAdminRole";
import { AdminPortal } from "@/components/admin/AdminPortal";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];

export default function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  const { t } = useTranslation();
  const { location, setLocation } = useDashboard();
  const { email, avatarUrl } = useAuth();
  const [cityOpen, setCityOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { isAdmin } = useAdminRole(undefined, email);
  const isUserAdmin = isAdmin || (email && ADMIN_EMAILS.includes(email.toLowerCase()));

  const unreadMessages = DASHBOARD_MESSAGES.filter((m) => m.unread).length;
  const userName = getUserName();

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!cityRef.current?.contains(e.target as Node)) setCityOpen(false);
      if (!notifRef.current?.contains(e.target as Node)) setNotifOpen(false);
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:gap-3 sm:px-6">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMenu}
        aria-label={t("dashboard.header.openMenu")}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Location selector */}
      <div ref={cityRef} className="relative min-w-0">
        <button
          type="button"
          onClick={() => {
            setCityOpen((o) => !o);
            setNotifOpen(false);
            setProfileOpen(false);
          }}
          aria-expanded={cityOpen}
          className="flex min-h-10 max-w-full items-center gap-1.5 rounded-lg border border-border px-2.5 text-sm text-foreground transition-colors hover:bg-accent sm:px-3"
        >
          <MapPin size={15} className="shrink-0 text-[var(--cardeal-primary)]" />
          <span className="truncate">{location.label}</span>
          <ChevronDown size={14} className={cn("shrink-0 text-muted-foreground transition-transform", cityOpen && "rotate-180")} />
        </button>
        {cityOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20">
            <p className="border-b border-border px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t("dashboard.header.location")}
            </p>
            <ul className="max-h-64 overflow-y-auto p-1">
              {CITY_OPTIONS.map((c) => (
                <li key={c.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocation(c);
                      setCityOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      c.label === location.label
                        ? "bg-[var(--cardeal-primary)]/10 font-medium text-[var(--cardeal-primary)]"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    <span>{c.label}</span>
                    {c.label === location.label && <Check size={14} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <LanguageSelector />

        {/* Conditional Admin Portal Trigger */}
        {isUserAdmin && (
          <button
            type="button"
            onClick={() => setAdminOpen(true)}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-red-500/50 bg-red-600/20 px-3 text-xs font-semibold text-red-400 shadow-sm transition-colors hover:bg-red-600/30 hover:text-red-300"
          >
            <ShieldAlert size={16} /> Admin Portal
          </button>
        )}

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setCityOpen(false);
              setProfileOpen(false);
            }}
            aria-expanded={notifOpen}
            aria-label={t("dashboard.header.notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Bell size={18} />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--cardeal-primary)] px-1 text-[10px] font-bold text-white ring-2 ring-background">
              {DASHBOARD_NOTIFICATIONS.length}
            </span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20">
              <p className="border-b border-border px-4 py-2.5 text-sm font-semibold">
                {t("dashboard.header.notifications")}
              </p>
              <ul className="max-h-72 overflow-y-auto">
                {DASHBOARD_NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="border-b border-border/60 last:border-0">
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--cardeal-primary)]" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">{n.title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{n.detail}</span>
                        <span className="mt-1 block text-[11px] text-muted-foreground/70">{n.time}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Messages */}
        <Link
          href="/dashboard/messages"
          aria-label={t("dashboard.header.messages")}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <MessageCircle size={18} />
          {unreadMessages > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
              {unreadMessages}
            </span>
          )}
        </Link>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((o) => !o);
              setCityOpen(false);
              setNotifOpen(false);
            }}
            aria-expanded={profileOpen}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2 transition-colors hover:bg-accent"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cardeal-primary)] text-sm font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="hidden max-w-24 truncate text-sm font-medium text-foreground md:block">
              {userName}
            </span>
            <ChevronDown size={14} className={cn("shrink-0 text-muted-foreground transition-transform", profileOpen && "rotate-180")} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20">
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">{email || userName}</p>
              </div>
              <ul className="p-1.5">
                <li>
                  <Link
                    href="/dashboard/parametres"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    <Settings size={15} className="text-muted-foreground" />
                    {t("dashboard.nav.settings")}
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setAuthenticated(false);
                      if (isSupabaseConfigured) void supabase!.auth.signOut();
                      window.location.href = "/";
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={15} />
                    {t("dashboard.header.logout")}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User avatar link (mobile) */}
        <Link
          href="/dashboard/parametres"
          aria-label={t("dashboard.header.profile")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        >
          <User size={18} />
        </Link>
      </div>
      </header>
      {isUserAdmin && <AdminPortal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />}
    </>
  );
}