"use client";

import { Bell, Key, Lock, User } from "lucide-react";
import clsx from "clsx";

const navigation = [
  { name: "Profile", icon: User, href: "#profile" },
  { name: "Security", icon: Lock, href: "#security" },
  { name: "API Keys", icon: Key, href: "#api-keys" },
  { name: "Notifications", icon: Bell, href: "#notifications" },
];

interface SettingsNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SettingsNav({ activeSection, onSectionChange }: SettingsNavProps) {
  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = activeSection === item.href.slice(1);

        return (
          <button
            key={item.name}
            onClick={() => onSectionChange(item.href.slice(1))}
            className={clsx(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              isActive
                ? "bg-card text-text-primary"
                : "text-text-secondary hover:bg-card hover:text-text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </button>
        );
      })}
    </nav>
  );
} 