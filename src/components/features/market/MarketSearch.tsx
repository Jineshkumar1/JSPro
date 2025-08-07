"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export function MarketSearch() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search by symbol, name, or market cap..."
          className="h-10 w-full rounded-lg bg-card pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <button className="flex h-10 items-center gap-2 rounded-lg bg-card px-4 text-sm text-text-secondary hover:text-text-primary">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters</span>
      </button>
    </div>
  );
} 