"use client";

import { Crown } from "lucide-react";

export function PremiumCard() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-accent to-accent/60 p-internal">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />

      <Crown className="h-8 w-8 text-white" />

      <h2 className="mt-4 text-lg font-semibold text-white">
        Upgrade to Premium
      </h2>
      <p className="mt-2 text-sm text-white/80">
        Get access to advanced analytics, real-time alerts, and premium features
      </p>

      <button className="mt-6 w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-white/90">
        Upgrade Now
      </button>
    </div>
  );
} 