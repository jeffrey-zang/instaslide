import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-white">
                InstaSlide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="px-3 py-1.5 text-sm text-[#a0a0a0] hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-3 py-1.5 bg-[#60a5fa] text-white text-sm rounded hover:bg-[#3b82f6] transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-24 max-w-3xl">
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Turn outlines into presentations
          </h1>
          <p className="text-lg text-[#a0a0a0] mb-8 leading-relaxed">
            Paste your content outline and get a presentation in seconds.
          </p>
          <div className="flex gap-3">
            <Link
              href="/auth/sign-up"
              className="px-5 py-2.5 bg-[#60a5fa] text-white text-sm font-medium rounded hover:bg-[#3b82f6] transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/auth/sign-in"
              className="px-5 py-2.5 border border-[#2a2a2a] text-white text-sm font-medium rounded hover:border-[#3a3a3a] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="py-16 border-t border-[#2a2a2a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-powered</h3>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                Automatically generate slides from your content outline.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Share anywhere</h3>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                Get a shareable link to present from any device.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">No design needed</h3>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                Focus on content. Formatting and layout handled automatically.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast workflow</h3>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                Create complete presentations in seconds, not hours.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#2a2a2a] mt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <p className="text-sm text-[#666]">
            © 2025 InstaSlide
          </p>
        </div>
      </footer>
    </div>
  );
}
