'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface SlideshowViewerProps {
  id: string;
  markdown: string;
}

interface BuildState {
  status: 'idle' | 'building' | 'ready' | 'error';
  error?: string;
}

export function SlideshowViewer({ id, markdown }: SlideshowViewerProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [buildState, setBuildState] = useState<BuildState>({ status: 'idle' });

  const iframeSrc = useMemo(() => {
    if (buildState.status !== 'ready') return '';
    const cacheBuster = Date.now();
    return `/slidev-built/${encodeURIComponent(id)}/index.html?cb=${cacheBuster}`;
  }, [buildState.status, id]);

  const requestBuild = useCallback(async () => {
    if (!markdown.trim()) {
      setBuildState({ status: 'error', error: 'Presentation has no content to render.' });
      return;
    }

    setBuildState({ status: 'building' });
    setIframeLoaded(false);

    try {
      const response = await fetch('/api/slidev/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, markdown }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to render presentation with Slidev.');
      }

      setBuildState({ status: 'ready' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to render presentation with Slidev.';
      setBuildState({ status: 'error', error: message });
    }
  }, [id, markdown]);

  useEffect(() => {
    requestBuild();
  }, [requestBuild]);

  if (buildState.status === 'error') {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
        <p className="text-red-400">{buildState.error ?? 'Unable to load presentation.'}</p>
        <button
          onClick={requestBuild}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Retry Rendering
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">
      {(buildState.status === 'building' || !iframeLoaded) && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 bg-gray-900">
          <div className="text-center text-gray-200">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
            <p className="text-sm font-medium text-gray-300">Preparing Slidev presentation…</p>
          </div>
        </div>
      )}

      {buildState.status === 'ready' && (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          onLoad={() => setIframeLoaded(true)}
          title="Slidev presentation"
          className="h-full w-full flex-1 border-0 bg-black"
          allowFullScreen
        />
      )}
    </div>
  );
}
