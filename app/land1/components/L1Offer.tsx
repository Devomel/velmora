'use client';

import { useL1Cart } from './L1CartProvider';

type OfferT = { badge: string; title: string; desc: string; cta: string; sub: string };

export default function L1Offer({ t }: { t: OfferT }) {
  const { openCart } = useL1Cart();

  return (
    <section className="bg-[#B91C1C] py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#991B1B] rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#DC2626] rounded-full translate-y-1/2 -translate-x-1/3 opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <span className="inline-block bg-[#D97706] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-8">
          {t.badge}
        </span>
        <h2 className="text-3xl md:text-5xl font-light text-white mb-6">{t.title}</h2>
        <p className="text-[#FECACA] text-base leading-relaxed mb-10 max-w-lg mx-auto">{t.desc}</p>
        <button
          onClick={openCart}
          className="bg-white text-[#DC2626] hover:bg-[#FEF2F2] px-12 py-4 text-sm font-bold uppercase tracking-wider transition-colors mb-4"
        >
          {t.cta}
        </button>
        <p className="text-[#FECACA] text-xs mt-4">{t.sub}</p>
      </div>
    </section>
  );
}
