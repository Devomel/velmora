'use client';

import { useState } from 'react';

type Props = {
  images: string[];
  alt: string;
  badge?: React.ReactNode;
};

export default function ProductGallery({ images, alt, badge }: Props) {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible md:w-20 flex-shrink-0">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIdx(i)}
              aria-label={`Bild ${i + 1}`}
              className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-lg overflow-hidden bg-white flex-shrink-0 transition-colors ${
                i === idx ? 'border-[#C4704F]' : 'border-[#E8DDD4] hover:border-[#C4704F]/50'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        className="relative bg-white border border-[#E8DDD4] rounded-xl overflow-hidden flex-1"
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          key={idx}
          src={images[idx]}
          alt={alt}
          className="w-full h-full object-contain p-4"
        />

        {badge}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Vorheriges Bild"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 hover:bg-white border border-[#E8DDD4] text-[#1A1410] transition-colors"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Nächstes Bild"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 hover:bg-white border border-[#E8DDD4] text-[#1A1410] transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
