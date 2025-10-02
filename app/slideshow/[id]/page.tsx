'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { SlideshowViewer } from '@/components/slideshow-viewer';

export default function SlideshowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const { data, isLoading, error } = trpc.slideshow.get.useQuery({ id });
  const togglePublicMutation = trpc.slideshow.togglePublic.useMutation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/share/${id}`);
    }
  }, [id]);

  const handleTogglePublic = async () => {
    if (!data?.slideshow) return;

    try {
      await togglePublicMutation.mutateAsync({
        id,
        isPublic: !data.slideshow.is_public,
      });
      setShowShareModal(true);
    } catch (error) {
      alert('Error updating sharing settings');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa] mx-auto"></div>
          <p className="mt-4 text-[#a0a0a0]">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.slideshow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading presentation</p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-[#60a5fa] text-white rounded-md hover:bg-[#3b82f6] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-white">
                InstaSlide
              </Link>
              <span className="ml-4 text-[#666]">|</span>
              <h1 className="ml-4 text-lg font-medium text-white">
                {data.slideshow.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTogglePublic}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  data.slideshow.is_public
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#a0a0a0]'
                }`}
              >
                {data.slideshow.is_public ? 'Public' : 'Private'}
              </button>
              {data.slideshow.is_public && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 bg-[#60a5fa] text-white text-sm font-medium rounded-md hover:bg-[#3b82f6] transition-colors"
                >
                  Share
                </button>
              )}
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <SlideshowViewer markdown={data.slideshow.markdown} />

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Share Your Presentation
            </h2>
            <p className="text-[#a0a0a0] mb-4">
              Anyone with this link can view your presentation:
            </p>
            <div className="flex items-center space-x-2 mb-6">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-4 py-2 border border-[#2a2a2a] rounded-md bg-[#121212] text-white text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-[#60a5fa] text-white text-sm font-medium rounded-md hover:bg-[#3b82f6] transition-colors"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white font-medium rounded-md hover:bg-[#3a3a3a] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
