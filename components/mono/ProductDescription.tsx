'use client';

import { useState } from 'react';

type Props = {
  text: string;
  readMore: string;
  readLess: string;
};

export default function ProductDescription({ text, readMore, readLess }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="relative">
        <div
          className={`text-[#6B5B4E] leading-relaxed whitespace-pre-line text-sm md:text-base overflow-hidden transition-all duration-300 ${
            expanded ? 'max-h-[2000px]' : 'max-h-[12rem]'
          }`}
        >
          {text}
        </div>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#C4704F] hover:text-[#B05F40] transition-colors"
      >
        {expanded ? readLess : readMore}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
