"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardProps {
  children: React.ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="ml-sidebar pt-16">
        <div className="mx-auto max-w-container p-section">
          {children}
        </div>
      </main>
    </div>
  );
} 