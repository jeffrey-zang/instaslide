'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateFromOutlinePage() {
  const [title, setTitle] = useState('');
  const [outline, setOutline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const generateMutation = trpc.slideshow.generateFromOutline.useMutation();
  const saveMutation = trpc.slideshow.save.useMutation();

  const handleGenerate = async () => {
    if (!outline.trim()) {
      toast.error('Please enter an outline');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMutation.mutateAsync({
        outline,
        title: title || undefined,
      });

      const savedResult = await saveMutation.mutateAsync({
        title: title || 'Untitled Presentation',
        markdown: result.markdown,
      });

      toast.success('Presentation generated successfully!');
      router.push(`/slideshow/${savedResult.slideshow.id}`);
    } catch (error) {
      toast.error('Error generating slideshow: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-white">
                InstaSlide
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Create Presentation from Outline
          </h1>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[#ededed] mb-2"
              >
                Presentation Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-[#121212] border border-[#2a2a2a] rounded-md text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                placeholder="My Amazing Presentation"
              />
            </div>

            <div>
              <label
                htmlFor="outline"
                className="block text-sm font-medium text-[#ededed] mb-2"
              >
                Outline
              </label>
              <textarea
                id="outline"
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                rows={15}
                className="w-full px-4 py-2 bg-[#121212] border border-[#2a2a2a] rounded-md text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent font-mono text-sm"
                placeholder="Enter your outline here...&#10;&#10;Example:&#10;Introduction&#10;- Topic overview&#10;- Key objectives&#10;&#10;Main Points&#10;- Point 1&#10;- Point 2&#10;- Point 3&#10;&#10;Conclusion&#10;- Summary&#10;- Call to action"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !outline.trim()}
              className="w-full px-6 py-3 bg-[#60a5fa] text-white font-medium rounded-md hover:bg-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60a5fa] focus:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating presentation...
                </span>
              ) : (
                'Generate Presentation'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
