"use client";

import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="fixed left-sidebar right-0 top-0 z-30 flex h-16 items-center border-b border-card bg-background px-4">
      <div className="flex flex-1 items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search stocks, news, or settings..."
            className="h-10 w-full rounded-lg bg-card pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex items-center">
        <button className="relative rounded-full p-2 text-text-secondary hover:bg-card hover:text-text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
        </button>
      </div>
    </header>
  );
} 