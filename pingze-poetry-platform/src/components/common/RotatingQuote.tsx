import { useState, useEffect, useCallback } from 'react';

export interface QuoteData {
  text: string;
  author: string;
  title: string;
}

interface RotatingQuoteProps {
  quotes: QuoteData[];
  interval?: number;
}

export default function RotatingQuote({ quotes, interval = 6000 }: RotatingQuoteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const nextQuote = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
      setIsFading(false);
    }, 600);
  }, [quotes.length]);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const timer = setInterval(nextQuote, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval, nextQuote]);

  if (quotes.length === 0) return null;

  const current = quotes[currentIndex];

  return (
    <div className="relative overflow-hidden min-h-[180px] flex items-center justify-center">
      <div
        className={`transition-opacity duration-600 ease-in-out ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="text-center px-8 max-w-3xl mx-auto">
          <div className="relative">
            <svg
              className="absolute -top-4 -left-4 w-8 h-8 text-cinnabar/20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-lg md:text-xl text-ink-black/70 leading-loose tracking-widest font-serif mb-4">
              {current.text}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-cinnabar/60 tracking-wider">{current.author}</span>
            <span className="text-ink-black/20">·</span>
            <span className="text-sm text-indigo-blue/60 tracking-wider">{current.title}</span>
          </div>
        </div>
      </div>

      {quotes.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsFading(true);
                setTimeout(() => {
                  setCurrentIndex(i);
                  setIsFading(false);
                }, 600);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-cinnabar w-6'
                  : 'bg-ink-black/20 hover:bg-ink-black/40'
              }`}
              aria-label={`切换到第${i + 1}条诗句`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
