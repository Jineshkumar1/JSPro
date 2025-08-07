"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo mode - always succeed
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your email address and we&apos;ll send you a link to reset your
            password
          </p>
          <p className="mt-2 text-xs text-accent">
            Demo Mode: Reset password functionality is simulated
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-sm text-error">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
              Demo Mode: Password reset simulation successful
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-secondary"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg bg-card p-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Send reset link'
            )}
          </button>

          <div className="text-center text-sm">
            <Link
              href="/auth/signin"
              className="font-medium text-accent hover:text-accent/90"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 