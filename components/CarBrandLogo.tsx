"use client";

import { cn } from "@/lib/utils";
import { getCarBrandLogo } from "@/data/carBrandLogos";

export default function CarBrandLogo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { src } = getCarBrandLogo(name);
  return (
    <img
      src={src}
      alt={name}
      title={name}
      draggable={false}
      className={cn("object-contain", className)}
    />
  );
}

/** Renders a brand option (logo + name) for the shared BrandSelect dropdown. */
export function carBrandOption(brand: string) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex h-6 w-12 shrink-0 items-center justify-center">
        <CarBrandLogo name={brand} className="h-5 w-auto max-w-[44px]" />
      </span>
      <span className="truncate">{brand}</span>
    </span>
  );
}
