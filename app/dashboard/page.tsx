'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { data: userData, isLoading: userLoading } = trpc.auth.getUser.useQuery();
  const { data: slideshowsData, refetch } = trpc.slideshow.list.useQuery();
  const deleteMutation = trpc.slideshow.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!userLoading && !userData?.user) {
      router.push('/auth/sign-in');
    }
  }, [userData, userLoading, router]);

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

  if (!userData?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside className="w-64 border-r border-[#2a2a2a] flex flex-col">
        <div className="p-6 border-b border-[#2a2a2a]">
          <Link href="/dashboard" className="text-xl font-semibold text-white">
            InstaSlide
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-[#1a1a1a] rounded mb-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="px-3 py-2 text-xs text-[#666] mb-2">
            {userData.user.email}
          </div>
          <button
            onClick={() => {
              trpc.auth.signOut.useMutation().mutate();
              router.push('/auth/sign-in');
            }}
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
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create presentation
            </h1>
            <p className="text-[#a0a0a0] text-sm">
              Choose how you want to start
            </p>
          </div>
          
          <div className="mb-12">
            <Link
              href="/create/outline"
              className="block p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a] transition-colors max-w-md"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Create from outline
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                Type or paste your content outline to generate slides
              </p>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Recent presentations
            </h2>
            {slideshowsData?.slideshows && slideshowsData.slideshows.length > 0 ? (
              <div className="space-y-2">
                {slideshowsData.slideshows.map((slideshow: any) => (
                  <div
                    key={slideshow.id}
                    className="flex items-center justify-between p-4 border border-[#2a2a2a] rounded hover:border-[#3a3a3a] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link href={`/slideshow/${slideshow.id}`}>
                        <h3 className="text-sm font-medium text-white mb-1 hover:text-[#60a5fa] transition-colors">
                          {slideshow.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#666]">
                        {new Date(slideshow.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/slideshow/${slideshow.id}`}
                        className="px-3 py-1.5 text-xs text-[#a0a0a0] hover:text-white transition-colors"
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Delete this presentation?')) {
                            deleteMutation.mutate({ id: slideshow.id });
                          }
                        }}
                        className="px-3 py-1.5 text-xs text-[#a0a0a0] hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 border border-[#2a2a2a] rounded text-center">
                <p className="text-[#666] text-sm">
                  No presentations yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
