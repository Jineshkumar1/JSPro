"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    // Demo: Clear mock user data
    localStorage.removeItem('demo_user');
    // Simulate logout process
    setTimeout(() => {
      router.push("/auth/signin");
    }, 1000);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg bg-card p-internal">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Sign Out</h2>
          <p className="mt-2 text-text-secondary">
            Are you sure you want to sign out of your account?
          </p>
          <p className="mt-2 text-xs text-accent">
            Demo Mode: Your session will be cleared
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg bg-background px-4 py-2 text-sm font-medium text-text-primary hover:bg-background/80"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:bg-error/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Sign Out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 