"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";

const RANDOM_TOPICS = [
  "The Future of Artificial Intelligence",
  "Climate Change Solutions",
  "The History of Space Exploration",
  "Mindfulness and Mental Health",
  "The Evolution of the Internet",
  "Renewable Energy Technologies",
  "The Science of Sleep",
  "Cryptocurrency and Blockchain",
  "The Art of Public Speaking",
  "Urban Farming and Sustainability",
  "The Impact of Social Media",
  "Quantum Computing Basics",
  "The Human Brain",
  "Remote Work Best Practices",
  "Ancient Civilizations",
  "The Future of Transportation",
  "Nutrition and Longevity",
  "Machine Learning Applications",
  "The Music Industry Evolution",
  "Space Tourism and Colonization",
  "A Porter Robinson Introspective",
  "The Costco Guys' effect on pop culture",
  "A deep-dive into Italian brainrot history"
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: userLoading } = useAuth();
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  const { data: slideshowsData, refetch } = trpc.slideshow.list.useQuery();
  const deleteMutation = trpc.slideshow.delete.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const generateMutation = trpc.slideshow.generateFromOutline.useMutation();
  const saveMutation = trpc.slideshow.save.useMutation();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, userLoading, router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth/sign-in");
      router.refresh();
    } catch {
      toast.error("Error signing out");
    }
  };

  const handleRandomTopic = async () => {
    const randomTopic =
      RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    setIsGeneratingRandom(true);

    try {
      const result = await generateMutation.mutateAsync({
        outline: `Create a presentation about: ${randomTopic}\n\nInclude:\n- Introduction\n- Key concepts\n- Examples\n- Conclusion`,
        title: randomTopic
      });

      const savedResult = await saveMutation.mutateAsync({
        title: randomTopic,
        markdown: result.markdown
      });

      router.push(`/slideshow/${savedResult.slideshow.id}`);
    } catch (error) {
      toast.error("Error generating slideshow: " + (error as Error).message);
    } finally {
      setIsGeneratingRandom(false);
    }
  };

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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-[#1a1a1a] rounded mb-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Dashboard
            </Link>
          </div>

          {slideshowsData?.slideshows &&
            slideshowsData.slideshows.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-[#666] uppercase tracking-wide">
                  Recent
                </div>
                <div className="space-y-1">
                  {slideshowsData.slideshows
                    .slice(0, 5)
                    .map((slideshow: { id: string; title: string; created_at: string }) => (
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
            className="flex items-center gap-3 px-3 py-2 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] rounded mb-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
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
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <Link
                href="/create/outline"
                className="block p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a] transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  Create from outline
                </h3>
                <p className="text-[#a0a0a0] text-sm">
                  Type or paste your content outline to generate slides
                </p>
              </Link>

              <button
                onClick={handleRandomTopic}
                disabled={isGeneratingRandom}
                className="block p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a] transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isGeneratingRandom ? "Generating..." : "Random topic"}
                </h3>
                <p className="text-[#a0a0a0] text-sm">
                  {isGeneratingRandom
                    ? "Creating your presentation..."
                    : "Generate slides from a surprise topic"}
                </p>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Recent presentations
            </h2>
            {slideshowsData?.slideshows &&
            slideshowsData.slideshows.length > 0 ? (
              <div className="space-y-2">
                {slideshowsData.slideshows.map((slideshow: { id: string; title: string; created_at: string }) => (
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
                          if (confirm("Delete this presentation?")) {
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
                <p className="text-[#666] text-sm">No presentations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
