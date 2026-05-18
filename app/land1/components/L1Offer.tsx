'use client';

import { useL1Cart } from './L1CartProvider';

type OfferT = {
  badge: string;
  title: string;
  desc: string;
  cta: string;
  sub: string;
};

export default function L1Offer({ t }: { t: OfferT }) {
  const { openCart } = useL1Cart();

  return (
    <section className="bg-[#1A3D2B] py-24 px-4 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D6A4F] opacity-30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-48 h-48 bg-[#52B788] opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <span className="inline-block bg-[#C9A84C]/20 text-[#C9A84C] text-xs uppercase tracking-widest px-4 py-1.5 border border-[#C9A84C]/30 mb-8">
          {t.badge}
        </span>
        <h2 className="text-3xl md:text-5xl font-light text-[#E8F5EE] mb-6">{t.title}</h2>
        <p className="text-[#8FB89F] text-base leading-relaxed mb-10 max-w-lg mx-auto">{t.desc}</p>
        <button
          onClick={openCart}
          className="bg-[#52B788] hover:bg-[#2D6A4F] text-white px-12 py-4 text-sm font-semibold uppercase tracking-wider transition-colors mb-4"
        >
          {t.cta}
        </button>
        <p className="text-[#8FB89F] text-xs">{t.sub}</p>
      </div>
    </section>
  );
}
