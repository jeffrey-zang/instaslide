'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseSlides } from '@/lib/parse-slides';

interface SlideViewerProps {
  markdown: string;
}

export function SlideViewer({ markdown }: SlideViewerProps) {
  const slides = parseSlides(markdown);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection('forward');
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length]);

  const goToPrevious = useCallback(() => {
    if (currentSlide > 0) {
      setDirection('backward');
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setDirection(index > currentSlide ? 'forward' : 'backward');
      setCurrentSlide(index);
    }
  }, [currentSlide, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
      } else if (e.key >= '0' && e.key <= '9') {
        const num = parseInt(e.key);
        if (num <= slides.length) {
          goToSlide(num === 0 ? 9 : num - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, goToSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-400">No slides to display</p>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const layout = slide.frontmatter.layout || 'default';
  const theme = slide.frontmatter.theme || 'default';
  const slideClass = slide.frontmatter.class || '';

  const getLayoutClasses = () => {
    if (slideClass.includes('text-center') || layout === 'center' || layout === 'cover') {
      return 'flex flex-col items-center justify-center text-center';
    }
    if (slideClass.includes('text-left')) {
      return 'flex flex-col justify-center text-left';
    }
    if (slideClass.includes('text-right')) {
      return 'flex flex-col justify-center text-right';
    }
    return 'flex flex-col justify-center';
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0a0a0a]">
      <div 
        className={`slide-content h-full w-full flex items-center justify-center p-12 transition-transform duration-300 ${
          direction === 'forward' ? 'slide-in-right' : 'slide-in-left'
        }`}
        key={currentSlide}
      >
        <div className={`slide-inner w-full h-full max-w-6xl ${getLayoutClasses()}`}>
          <div className="markdown-slide text-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-6xl font-bold mb-8 text-white">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-5xl font-bold mb-6 text-white">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-4xl font-semibold mb-4 text-white">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-2xl mb-4 text-gray-200 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="text-2xl space-y-3 mb-6 list-disc list-inside text-gray-200">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-2xl space-y-3 mb-6 list-decimal list-inside text-gray-200">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-200">{children}</li>
                ),
                code: ({ children, ...props }) => {
                  const isInline = !props.className?.includes('language-');
                  return isInline ? (
                    <code className="bg-gray-800 px-2 py-1 rounded text-green-400 font-mono text-xl">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-900 p-6 rounded-lg text-green-400 font-mono text-lg mb-4 overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-900 p-6 rounded-lg mb-6 overflow-x-auto">{children}</pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-300 text-2xl mb-6">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-blue-400">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-blue-300">{children}</em>
                ),
              }}
            >
              {slide.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-12">
        <button
          onClick={goToPrevious}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          aria-label="Previous slide"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
          <div className="flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={goToNext}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        .slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }

        .markdown-slide img {
          max-width: 100%;
          height: auto;
          margin: 2rem auto;
          border-radius: 0.5rem;
        }

        .markdown-slide table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }

        .markdown-slide th,
        .markdown-slide td {
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem;
          text-align: left;
        }

        .markdown-slide th {
          background: rgba(255, 255, 255, 0.1);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
