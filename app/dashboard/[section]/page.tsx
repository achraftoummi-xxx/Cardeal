"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import {
  AdviceView,
  AppointmentsView,
  DealsView,
  DocumentsView,
  ExpensesView,
  FavoritesView,
  GarageSearchView,
  HistoryView,
  MessagesView,
  PartsView,
  QuotesView,
  SettingsView,
  TiresView,
  VehiclesView,
} from "@/components/dashboard/DashboardViews";

/* Every sidebar item must resolve to one of these slugs
   (next segment is decoded, so accented characters survive routing). */
const SECTION_VIEWS: Record<string, () => React.ReactNode> = {
  recherche: GarageSearchView,
  vehicules: VehiclesView,
  devis: QuotesView,
  pieces: PartsView,
  pneus: TiresView,
  "rendez-vous": AppointmentsView,
  historique: HistoryView,
  messages: MessagesView,
  favoris: FavoritesView,
  documents: DocumentsView,
  depenses: ExpensesView,
  "bons-plans": DealsView,
  conseils: AdviceView,
  parametres: SettingsView,
};

export default function DashboardSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = use(params);
  const View = SECTION_VIEWS[section];
  if (!View) notFound();

  return <View />;
}