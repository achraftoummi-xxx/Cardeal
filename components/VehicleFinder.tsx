"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

export function VehicleFinder() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState({ brand: '', model: '', year: '', engine: '' });

  const steps = [
    { label: 'Brand', options: ['Toyota', 'Honda', 'Ford', 'BMW'] },
    { label: 'Model', options: ['Camry', 'Civic', 'F-150', '3 Series'] },
    { label: 'Year', options: ['2024', '2023', '2022', '2021'] },
    { label: 'Engine', options: ['2.0L', '2.5L', '3.5L', 'Hybrid'] },
  ];

  const handleSelect = (option: string) => {
    const key = steps[step].label.toLowerCase();
    setVehicle({ ...vehicle, [key]: option });
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
        // Find Garages logic
        sessionStorage.setItem('selectedVehicle', JSON.stringify({...vehicle, [key]: option}));
        window.location.href = '/auth'; // Redirect to auth
    }
  };

  return (
    <div className="bg-[var(--background)] p-8 rounded-3xl shadow-xl border border-[var(--border)] mt-10">
      <h3 className="text-2xl font-bold mb-6 text-[var(--foreground)]">{t("vehicleFinder.title")}</h3>
      <div className="grid grid-cols-2 gap-4">
        {steps[step].options.map((option) => (
          <Button key={option} onClick={() => handleSelect(option)} variant="outline" className="text-lg py-6 rounded-xl border-[var(--border)] hover:border-[var(--ring)] hover:text-[var(--primary-foreground)]">
            {option}
          </Button>
        ))}
      </div>
      <p className="mt-6 text-[var(--muted-foreground)]">{t("vehicleFinder.stepInfo", { current: step + 1, total: steps.length, label: steps[step].label })}</p>
    </div>
  );
}
