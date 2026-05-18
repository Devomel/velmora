'use client';

import { useEffect, useState } from 'react';
import { useL1Cart } from './L1CartProvider';

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

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getDeadline() {
  if (typeof window === 'undefined') return Date.now() + 47 * 3600 * 1000 + 59 * 60 * 1000;
  const key = 'l1_deadline';
  const stored = localStorage.getItem(key);
  if (stored) return Number(stored);
  const deadline = Date.now() + 47 * 3600 * 1000 + 59 * 60 * 1000 + 59 * 1000;
  localStorage.setItem(key, String(deadline));
  return deadline;
}

export default function L1Hero({ t }: { t: HeroT }) {
  const { openCart } = useL1Cart();
  const [timeLeft, setTimeLeft] = useState({ h: 47, m: 59, s: 59 });

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => {
      const diff = Math.max(0, deadline - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0E2318] flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#1A3D2B] opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#2D6A4F] opacity-20 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Badge */}
        <span className="inline-block bg-[#C9A84C]/20 text-[#C9A84C] text-xs uppercase tracking-widest px-4 py-1.5 mb-8 border border-[#C9A84C]/30">
          {t.badge}
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#E8F5EE] leading-tight mb-6">
          {t.title}{' '}
          <span className="text-[#52B788] italic">{t.titleHighlight}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#8FB89F] text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1.5 mb-10">
          {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A84C">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="text-[#8FB89F] text-sm ml-1">{t.ratingText}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <button
            onClick={openCart}
            className="bg-[#52B788] hover:bg-[#2D6A4F] text-white px-10 py-4 text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <span>{t.saleBadge}</span>
            <span>{t.cta}</span>
          </button>
          <a
            href="#catalog"
            className="border border-[#E8F5EE]/30 text-[#E8F5EE] hover:bg-[#E8F5EE]/10 px-10 py-4 text-sm uppercase tracking-wider transition-colors"
          >
            {t.ctaSecondary}
          </a>
        </div>

        {/* Timer */}
        <div>
          <p className="text-[#8FB89F] text-xs uppercase tracking-widest mb-4">{t.timerLabel}</p>
          <div className="flex items-center justify-center gap-2">
            {[
              { val: timeLeft.h, label: t.timerHours },
              { val: timeLeft.m, label: t.timerMinutes },
              { val: timeLeft.s, label: t.timerSeconds },
            ].map(({ val, label }, i) => (
              <div key={i} className="flex items-center">
                <div className="bg-[#1A3D2B] border border-[#2D5040] px-4 py-2 text-center min-w-[64px]">
                  <div className="text-3xl font-light text-[#E8F5EE] tabular-nums">{pad(val)}</div>
                  <div className="text-[10px] text-[#8FB89F] uppercase tracking-wider mt-1">{label}</div>
                </div>
                {i < 2 && <span className="text-[#52B788] text-2xl font-light mx-1 leading-none mt-[-12px]">:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8FB89F]">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#52B788]" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
