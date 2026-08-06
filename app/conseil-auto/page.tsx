"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import LoginModal from "@/components/LoginModal";
import PartnerModal from "@/components/PartnerModal";
import { useTranslation } from "@/components/TranslationProvider";

type Article = {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
};

export default function ConseilAutoPage() {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showPartner, setShowPartner] = useState(false);

  const articles = t("advice.articles") as unknown as Article[];

  return (
    <div className="min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground antialiased">
      <SiteHeader onLogin={() => setShowLogin(true)} onPartner={() => setShowPartner(true)} />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BA2529] via-[#BA2529]/80 to-[#7A1418]/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("advice.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              {t("advice.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <article
              key={`${article.title}-${i}`}
              className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/30 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock size={14} />
                  {article.readTime}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold leading-snug text-foreground sm:text-xl">
                {article.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{article.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <PartnerModal open={showPartner} onClose={() => setShowPartner(false)} />
    </div>
  );
}
