"use client";

import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { SettingsNav } from "@/components/features/settings/SettingsNav";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <Dashboard>
      <div className="grid grid-cols-1 gap-section tablet:grid-cols-[240px_1fr]">
        <div className="rounded-lg bg-card p-internal">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        <div className="space-y-section">
          {activeSection === "profile" && (
            <div className="rounded-lg bg-card p-internal">
              <h2 className="text-lg font-semibold">Profile Information</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-lg bg-background p-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-lg bg-background p-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Time Zone
                  </label>
                  <select className="mt-1 block w-full rounded-lg bg-background p-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (London)</option>
                    <option>UTC+1 (Paris)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="rounded-lg bg-card p-internal">
              <h2 className="text-lg font-semibold">Security Settings</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-lg bg-background p-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-lg bg-background p-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-lg bg-background p-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "api-keys" && (
            <div className="rounded-lg bg-card p-internal">
              <h2 className="text-lg font-semibold">API Key Management</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Create and manage API keys for external applications.
              </p>
              <button className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
                Generate New API Key
              </button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="rounded-lg bg-card p-internal">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Price Alerts</div>
                    <div className="text-sm text-text-secondary">
                      Get notified when prices change significantly
                    </div>
                  </div>
                  <button className="h-6 w-11 rounded-full bg-background">
                    <div className="h-5 w-5 translate-x-[2px] rounded-full bg-text-secondary transition-all"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Trade Confirmations</div>
                    <div className="text-sm text-text-secondary">
                      Receive notifications for completed trades
                    </div>
                  </div>
                  <button className="h-6 w-11 rounded-full bg-accent">
                    <div className="h-5 w-5 translate-x-[22px] rounded-full bg-white transition-all"></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
} 