"use client";

import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const [vehicle, setVehicle] = useState<any>(null);

  useEffect(() => {
    const savedVehicle = sessionStorage.getItem('selectedVehicle');
    if (savedVehicle) {
      setVehicle(JSON.parse(savedVehicle));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--muted)] p-12">
      <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-8">Your Search Results</h1>
      {vehicle ? (
        <div className="bg-[var(--background)] p-8 rounded-3xl shadow-sm border border-[var(--border)]">
          <p className="text-lg">Vehicle: {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.engine}</p>
        </div>
      ) : (
        <p>No vehicle found.</p>
      )}
    </div>
  );
}
