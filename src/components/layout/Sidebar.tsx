"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LineChart, PieChart, Settings, LogOut, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { PremiumCard } from "@/components/features/PremiumCard";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Market", href: "/market", icon: LineChart },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface User {
  id: string;
  email: string;
  role: string;
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Demo: Get user from localStorage
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
    }

    // Listen for storage changes (for demo purposes)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('demo_user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSignOut = async () => {
    // Demo: Clear mock user data
    localStorage.removeItem('demo_user');
    setUser(null);
    router.push("/auth/signin");
  };

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-sidebar border-r border-card bg-background">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-10 flex items-center px-3">
          <span className="text-xl font-bold text-accent">TradePro</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-card text-accent"
                    : "text-text-secondary hover:bg-card hover:text-text-primary"
                )}
              >
                <item.icon
                  className={clsx(
                    "mr-3 h-5 w-5",
                    isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <PremiumCard />
          <div className="border-t border-card pt-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-text-secondary hover:bg-card hover:text-text-primary"
                >
                  <Image
                    src="https://picsum.photos/id/1/32/32"
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-sm font-medium text-text-primary">
                      {user.email}
                    </div>
                    <div className="text-xs text-text-secondary">Premium Member</div>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </button>

                {isMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg bg-card py-1 shadow-lg ring-1 ring-black/5">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex w-full items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
              >
                <LogOut className="h-4 w-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 