'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth-layout';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: userLoading } = useAuth();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (!userLoading && user) {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      toast.error('Email is required.');
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      toast.error('Enter a valid email address.');
      return;
    }

    if (!trimmedPassword) {
      toast.error('Password is required.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <AuthLayout
      title="Sign in to InstaSlide"
      subtitle="Transform ideas into polished decks in seconds."
      description="Enter your credentials to continue. Your workspace, presentations, and templates will be waiting on the other side."
      footer={
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#6b7280]">Don&apos;t have an account?</span>
          <Link href="/auth/sign-up" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Create one now
          </Link>
        </div>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {error ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : null}
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email-address" className="block text-sm font-medium text-[#d1d5db]">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border border-[#1f2937] bg-[#050505] px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#d1d5db]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border border-[#1f2937] bg-[#050505] px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
    </AuthLayout>
  );
}
