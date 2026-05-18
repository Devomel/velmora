'use client';

import { useState } from 'react';
import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['faq'] };

export default function FaqSection({ t }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-24 bg-[#FDFAF7]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-3">{t.title}</h2>
          <p className="text-[#6B5B4E]">{t.subtitle}</p>
        </div>

        <div className="divide-y divide-[#E8DDD4] border-y border-[#E8DDD4]">
          {t.items.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4 group"
              >
                <span className={`text-sm font-medium transition-colors ${open === i ? 'text-[#C4704F]' : 'text-[#1A1410] group-hover:text-[#C4704F]'}`}>
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-6 h-6 border flex items-center justify-center transition-all duration-200 ${open === i ? 'border-[#C4704F] bg-[#C4704F] text-white rotate-45' : 'border-[#E8DDD4] text-[#9C8A7E]'}`}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${open === i ? 'max-h-60 pb-5' : 'max-h-0'}`}>
                <p className="text-sm text-[#6B5B4E] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
