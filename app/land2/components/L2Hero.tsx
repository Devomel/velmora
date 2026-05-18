'use client';

import { useEffect, useState } from 'react';
import { useL2Cart } from './L2CartProvider';

type HeroT = {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  ctaSecondary: string;
  ratingText: string;
  saleBadge: string;
  timerLabel: string;
  timerHours: string;
  timerMinutes: string;
  timerSeconds: string;
};

function pad(n: number) { return String(n).padStart(2, '0'); }

function getDeadline() {
  if (typeof window === 'undefined') return Date.now() + 23 * 3600 * 1000;
  const key = 'l2_deadline';
  const stored = localStorage.getItem(key);
  if (stored) return Number(stored);
  const deadline = Date.now() + 23 * 3600 * 1000 + 59 * 60 * 1000 + 59 * 1000;
  localStorage.setItem(key, String(deadline));
  return deadline;
}

export default function L2Hero({ t }: { t: HeroT }) {
  const { openCart } = useL2Cart();
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => {
      const diff = Math.max(0, deadline - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Urgency bar */}
      <div className="bg-[#DC2626] text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            <span>{t.timerLabel}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold tabular-nums">
            <span>{pad(timeLeft.h)}{t.timerHours}</span>
            <span className="opacity-60 mx-0.5">:</span>
            <span>{pad(timeLeft.m)}{t.timerMinutes}</span>
            <span className="opacity-60 mx-0.5">:</span>
            <span>{pad(timeLeft.s)}{t.timerSeconds}</span>
          </div>
          <span className="text-xs bg-white/20 px-3 py-0.5 font-bold tracking-wide">{t.badge}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div>
            <span className="inline-block bg-[#FEF2F2] text-[#DC2626] text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-6 border border-[#FECACA]">
              {t.saleBadge} · {t.badge.split('·')[0].trim()}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#111827] leading-tight mb-6">
              {t.title}{' '}
              <span className="text-[#DC2626] relative">
                {t.titleHighlight}
                {/* Red underline accent */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626] opacity-30" />
              </span>
            </h1>
            <p className="text-[#6B7280] text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
              {t.subtitle}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-8">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#D97706">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-sm text-[#6B7280] ml-1">{t.ratingText}</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={openCart}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-10 py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
              >
                {t.cta}
              </button>
              <a
                href="#catalog"
                className="border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-colors text-center"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex items-center justify-center">
            {/* Big decorative red circle */}
            <div className="absolute w-72 h-72 rounded-full bg-[#FEF2F2] border border-[#FECACA]" />
            <div className="absolute w-56 h-56 rounded-full border-2 border-dashed border-[#FECACA]" />

            {/* Product SVG */}
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="relative z-10">
              <circle cx="110" cy="130" r="78" fill="white" stroke="#FECACA" strokeWidth="1.5" />
              <circle cx="110" cy="130" r="55" stroke="#FECACA" strokeWidth="1" strokeDasharray="5 4" />
              <rect x="80" y="44" width="60" height="48" rx="5" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.5" />
              <path d="M140 58 Q158 58 158 70 Q158 82 140 82" stroke="#DC2626" strokeWidth="1.5" fill="none" />
              <line x1="80" y1="70" x2="140" y2="70" stroke="#FECACA" strokeWidth="1" />
              <text x="110" y="178" textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="Inter, sans-serif">Premium Porzellan</text>
            </svg>

            {/* Floating badge */}
            <div className="absolute top-0 right-4 bg-[#DC2626] text-white px-4 py-2 text-center shadow-lg">
              <div className="text-2xl font-light">−20%</div>
              <div className="text-[10px] uppercase tracking-wider">Sale</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
