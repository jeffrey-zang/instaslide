'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: userLoading } = useAuth();
  const { data: slideshowsData } = trpc.slideshow.list.useQuery();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateEmailMutation = trpc.auth.updateEmail.useMutation({
    onSuccess: () => {
      setMessage('Email updated successfully. Please check your new email for confirmation.');
      setError('');
      setEmail('');
    },
    onError: (error) => {
      setError(error.message);
      setMessage('');
    },
  });

  const updatePasswordMutation = trpc.auth.updatePassword.useMutation({
    onSuccess: () => {
      setMessage('Password updated successfully');
      setError('');
      setPassword('');
      setConfirmPassword('');
    },
    onError: (error) => {
      setError(error.message);
      setMessage('');
    },
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa] mx-auto"></div>
          <p className="mt-4 text-[#a0a0a0]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    updateEmailMutation.mutate({ email });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    updatePasswordMutation.mutate({ password });
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/sign-in');
      router.refresh();
    } catch {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside className="w-64 border-r border-[#2a2a2a] flex flex-col">
        <div className="p-6 border-b border-[#2a2a2a]">
          <Link href="/dashboard" className="text-xl font-semibold text-white">
            InstaSlide
          </Link>
        </div>
        
        <nav className="flex-1 p-4 overflow-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] rounded mb-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] rounded mb-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
          </div>

          {slideshowsData?.slideshows && slideshowsData.slideshows.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-[#666] uppercase tracking-wide">
                Recent
              </div>
              <div className="space-y-1">
                {slideshowsData.slideshows.slice(0, 5).map((slideshow: { id: string; title: string }) => (
                  <Link
                    key={slideshow.id}
                    href={`/slideshow/${slideshow.id}`}
                    className="block px-3 py-2 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] rounded truncate transition-colors"
                    title={slideshow.title}
                  >
                    {slideshow.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-[#1a1a1a] rounded mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
          <div className="px-3 py-2 text-xs text-[#666] mb-2">
            {user.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] rounded w-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div className="border border-[#2a2a2a] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
              <div className="mb-4">
                <label className="block text-sm text-[#a0a0a0] mb-2">
                  Current email
                </label>
                <div className="text-white">{user.email}</div>
              </div>
            </div>

            <form onSubmit={handleUpdateEmail} className="border border-[#2a2a2a] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Change email</h2>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-[#ededed] mb-2">
                  New email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={updateEmailMutation.isPending || !email}
                className="px-4 py-2 bg-[#60a5fa] text-white text-sm font-medium rounded hover:bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updateEmailMutation.isPending ? 'Updating...' : 'Update email'}
              </button>
            </form>

            <form onSubmit={handleUpdatePassword} className="border border-[#2a2a2a] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Change password</h2>
              <div className="space-y-4 mb-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#ededed] mb-2">
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#ededed] mb-2">
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={updatePasswordMutation.isPending || !password || !confirmPassword}
                className="px-4 py-2 bg-[#60a5fa] text-white text-sm font-medium rounded hover:bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updatePasswordMutation.isPending ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
