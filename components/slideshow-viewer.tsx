'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SlideshowViewerProps {
  markdown: string;
}

export function SlideshowViewer({ markdown }: SlideshowViewerProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideArray = markdown
      .split(/^---$/m)
      .map((slide) => slide.trim())
      .filter((slide) => slide.length > 0);
    setSlides(slideArray);
    setCurrentSlide(0);
  }, [markdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-[#a0a0a0]">
        <p>No slides to display</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="max-w-5xl w-full bg-white rounded-lg shadow-2xl p-12 min-h-[600px] flex items-center justify-center">
          <div className="prose prose-lg max-w-none w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {slides[currentSlide]}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-[#60a5fa] text-white rounded-md hover:bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-[#a0a0a0] text-sm">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="flex space-x-1 ml-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-[#60a5fa]' : 'bg-[#666] hover:bg-[#888]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 bg-[#60a5fa] text-white rounded-md hover:bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-[#666] text-xs">
        Use arrow keys or space to navigate
      </div>
    </div>
  );
}
