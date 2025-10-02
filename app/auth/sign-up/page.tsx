'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth-layout';
import { trpc } from '@/lib/trpc';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { data: userData, isLoading: userLoading } = trpc.auth.getUser.useQuery();

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    },
    onError: (signUpError) => {
      setError(signUpError.message);
    },
  });

  useEffect(() => {
    if (!userLoading && userData?.user) {
      router.push('/dashboard');
    }
  }, [userData, userLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
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

    if (trimmedPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setSuccess(false);
    signUpMutation.mutate({ email: trimmedEmail, password: trimmedPassword });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (userData?.user) {
    return null;
  }

  return (
    <AuthLayout
      title="Create your InstaSlide account"
      subtitle="Bring your storytelling to life with AI-assisted slides."
      description="Sign up in seconds and start designing presentations that impress. Choose a password with at least six characters to continue."
      footer={
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#6b7280]">Already with us?</span>
          <Link href="/auth/sign-in" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Sign in instead
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
        {success ? (
          <div className="rounded-md border border-emerald-400/40 bg-emerald-400/10 p-3">
            <p className="text-sm text-emerald-200">
              Account created successfully! Redirecting...
            </p>
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
              autoComplete="new-password"
              required
              minLength={6}
              className="block w-full rounded-md border border-[#1f2937] bg-[#050505] px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={signUpMutation.isPending}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signUpMutation.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
