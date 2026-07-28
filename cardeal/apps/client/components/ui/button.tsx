import React from 'react';
import { cn } from "@/lib/utils";

export const Button = ({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) => {
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--ring)]",
    secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)]",
    outline: "border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]",
  };
  return (
    <button
      className={cn("px-4 py-2 rounded-md font-medium transition-colors", variants[variant], className)}
      {...props}
    />
  );
};
