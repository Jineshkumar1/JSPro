"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Demo: Accept any email/password combination
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store mock user data in localStorage for demo
      localStorage.setItem('demo_user', JSON.stringify({
        id: 'demo-user',
        email: email || 'demo@example.com',
        role: 'authenticated'
      }));

      router.push('/');
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to your account to continue
          </p>
          <p className="mt-2 text-xs text-accent">
            Demo Mode: Use any email/password
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-card bg-card text-accent focus:ring-accent"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-text-secondary"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/reset-password"
              className="text-sm text-accent hover:text-accent/90"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-text-secondary">Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="font-medium text-accent hover:text-accent/90"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 