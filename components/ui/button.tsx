import React from 'react';
import { cn } from "@/lib/utils";

export const Button = ({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) => {
  const variants = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95",
    secondary:
      "bg-zinc-800/50 text-zinc-100 border border-zinc-700/50 shadow-sm hover:bg-zinc-700/50 hover:text-zinc-100 active:scale-95",
    outline:
      "border border-zinc-700/50 text-zinc-400 shadow-sm hover:border-zinc-600/50 hover:bg-zinc-800/50 hover:text-zinc-200 active:scale-95",
  };
  return (
    <button
      className={cn("rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 max-sm:min-h-12", variants[variant], className)}
      {...props}
    />
  );
};
