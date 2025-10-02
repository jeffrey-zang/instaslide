'use client';

import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { SlideViewer } from '@/components/slide-viewer';

export default function SharedSlideshowPage() {
  const params = useParams() as { id: string };
  const id = params.id;

  const { data, isLoading, error } = trpc.slideshow.getShared.useQuery({ id });

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
          <p className="text-red-400 mb-4">
            This presentation is not available or is set to private
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-[#60a5fa] text-white rounded-md hover:bg-[#3b82f6] transition-colors"
          >
            Go to Home
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
              <Link href="/" className="text-xl font-bold text-white">
                InstaSlide
              </Link>
              <span className="ml-4 text-[#666]">|</span>
              <h1 className="ml-4 text-lg font-medium text-white">
                {data.slideshow.title}
              </h1>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors"
              >
                Create Your Own
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <SlideViewer markdown={data.slideshow.markdown} />
    </div>
  );
}
