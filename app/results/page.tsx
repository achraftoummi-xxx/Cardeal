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
    <div className="min-h-screen bg-[var(--muted)] p-12">
      <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-8">{t("auth.resultsTitle")}</h1>
      {vehicle ? (
        <div className="bg-[var(--background)] p-8 rounded-3xl shadow-sm border border-[var(--border)]">
          <p className="text-lg">{t("auth.vehicle", { brand: vehicle.brand, model: vehicle.model, year: vehicle.year, engine: vehicle.engine })}</p>
        </div>
      ) : (
        <p>{t("auth.noVehicle")}</p>
      )}
    </div>
  );
}
