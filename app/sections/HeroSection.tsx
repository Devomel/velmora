'use client';

import { useState, useEffect } from 'react';
import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['hero'] };

const ADVANTAGE_ICONS = [
  <svg key="shield" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  <svg key="truck" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>,
  <svg key="home" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>,
  <svg key="heart" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>,
];

function useCountdown(seconds: number) {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setTime(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = Math.floor(time / 3600).toString().padStart(2, '0');
  const mm = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
  const ss = (time % 60).toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export default function HeroSection({ t }: Props) {
  const timer = useCountdown(3 * 3600 + 47 * 60);

  return (
    <section className="relative bg-[#F5F0EB] overflow-hidden">
      <div className="absolute inset-0 opacity-5" aria-hidden>
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#C4704F" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#C4704F]/10 border border-[#C4704F]/30 text-[#A85A3A] text-sm px-4 py-2 mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{t.timerLabel}</span>
            <span className="font-mono font-bold">{timer}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A1410] tracking-tight mb-5 leading-tight">
            {t.title}<br />
            <span className="text-[#C4704F]">{t.titleHighlight}</span>
          </h1>

          <p className="text-lg text-[#6B5B4E] mb-8 max-w-lg mx-auto lg:mx-0">{t.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <a
              href="#catalog"
              className="inline-block bg-[#C4704F] hover:bg-[#A85A3A] text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              {t.cta}
            </a>
            <a
              href="#guarantees"
              className="inline-block border border-[#C4704F] text-[#C4704F] hover:bg-[#C4704F] hover:text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              {t.ctaSecondary}
            </a>
          </div>

          <div className="flex items-center gap-1 mt-6 justify-center lg:justify-start">
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C8A86B">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="text-sm text-[#6B5B4E] ml-2">{t.ratingText}</span>
          </div>
        </div>

        <div className="flex-shrink-0 relative w-72 h-72 md:w-96 md:h-96">
          <div className="absolute inset-0 bg-[#E8DDD4] rounded-full" />
          <div className="absolute inset-6 bg-[#F5F0EB] rounded-full flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="110" r="72" fill="#fff" stroke="#E8DDD4" strokeWidth="2" />
              <circle cx="100" cy="110" r="54" stroke="#E8DDD4" strokeWidth="1.5" />
              <circle cx="100" cy="110" r="30" stroke="#C4704F" strokeWidth="1" strokeDasharray="4 3" />
              <rect x="74" y="38" width="52" height="42" rx="4" fill="#fff" stroke="#C4704F" strokeWidth="1.5" />
              <path d="M126 50 Q140 50 140 59 Q140 68 126 68" stroke="#C4704F" strokeWidth="1.5" fill="none" />
              <line x1="74" y1="62" x2="126" y2="62" stroke="#E8DDD4" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute top-4 right-0 bg-[#C4704F] text-white text-xs font-bold px-3 py-1.5 shadow-lg">
            {t.saleBadge}
          </div>
        </div>
      </div>

      <div className="relative bg-white border-t border-[#E8DDD4]">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {t.advantages.map(({ title, desc }, i) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <span className="text-[#C4704F]">{ADVANTAGE_ICONS[i]}</span>
              <h3 className="text-sm font-semibold text-[#1A1410]">{title}</h3>
              <p className="text-xs text-[#9C8A7E] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
