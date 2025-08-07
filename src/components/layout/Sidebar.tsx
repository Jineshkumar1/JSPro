"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, PieChart, Settings, History } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Market", href: "/market", icon: TrendingUp },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-sidebar border-r border-card bg-background">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo */}
        <div className="mb-10 flex items-center px-3">
          <span className="text-xl font-bold text-accent">TradePro</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-card text-accent"
                    : "text-text-secondary hover:bg-card hover:text-text-primary"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Premium Card */}
        <div className="mt-auto space-y-4">
          <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg">👑</div>
              <h3 className="font-semibold">Upgrade to Premium</h3>
            </div>
            <p className="text-sm text-pink-100 mb-3">
              Get access to advanced analytics, real-time alerts, and premium features.
            </p>
            <button className="w-full bg-white text-red-500 py-2 px-3 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors">
              Upgrade Now
            </button>
          </div>

          {/* Sign In */}
          <button className="w-full bg-accent text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
            <div className="text-lg">⚡</div>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
} 