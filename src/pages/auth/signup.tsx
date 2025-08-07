"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store mock user data in localStorage for demo
      localStorage.setItem('demo_user', JSON.stringify({
        id: 'demo-user',
        email: email || 'demo@example.com',
        role: 'authenticated'
      }));

      // Redirect to dashboard
      router.push('/');
    } catch (error) {
      setError(`An error occurred during sign up: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign up to start trading
          </p>
          <p className="mt-2 text-xs text-accent">
            Demo Mode: Account creation is simulated
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-sm text-error">
              {error}
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg bg-card p-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-text-secondary"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg bg-card p-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
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
              'Sign up'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-text-secondary">Already have an account? </span>
            <Link
              href="/auth/signin"
              className="font-medium text-accent hover:text-accent/90"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 