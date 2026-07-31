"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from '@/components/TranslationProvider';

export default function ResultsPage() {
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<any>(null);

  useEffect(() => {
    const savedVehicle = sessionStorage.getItem('selectedVehicle');
    if (savedVehicle) {
      setVehicle(JSON.parse(savedVehicle));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--muted)] p-4 sm:p-8 lg:p-12">
      <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-6 sm:text-4xl sm:mb-8">{t("auth.resultsTitle")}</h1>
      {vehicle ? (
        <div className="bg-[var(--background)] p-5 rounded-3xl shadow-sm border border-[var(--border)] sm:p-8">
          <p className="text-base break-words sm:text-lg">{t("auth.vehicle", { brand: vehicle.brand, model: vehicle.model, year: vehicle.year, engine: vehicle.engine })}</p>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)] sm:text-base">{t("auth.noVehicle")}</p>
      )}
    </div>
  );
}
