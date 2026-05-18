'use client';

import { useState } from 'react';
import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['leadCapture'] };

export default function LeadCaptureSection({ t }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="py-20 md:py-24 bg-[#1A1410] relative overflow-hidden">
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full border border-[#C4704F]/20" aria-hidden />
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border border-[#C4704F]/10" aria-hidden />

      <div className="relative max-w-xl mx-auto px-4 text-center">
        <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.badge}</span>
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4">{t.title}</h2>
        <p className="text-[#9C8A7E] mb-8 leading-relaxed">{t.subtitle}</p>

        {submitted ? (
          <div className="bg-[#6B8F71]/20 border border-[#6B8F71]/40 px-6 py-4 text-[#6B8F71] text-sm">
            <svg className="inline-block mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t.success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-[#2D2420] border border-[#3D3430] text-white px-4 py-3 text-sm focus:border-[#C4704F] outline-none placeholder:text-[#6B5B4E]"
            />
            <button
              type="submit"
              className="bg-[#C4704F] hover:bg-[#A85A3A] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
            >
              {t.cta}
            </button>
          </form>
        )}

        <p className="text-[#6B5B4E] text-xs mt-4">
          {t.legalBefore}{' '}
          <a href="#" className="underline underline-offset-2 hover:text-[#9C8A7E] transition-colors">
            {t.legalLink}
          </a>
          {' '}{t.legalAfter}
        </p>

        <div className="mt-10 pt-8 border-t border-[#2D2420]">
          <p className="text-[#6B5B4E] text-sm mb-4">{t.socialLabel}</p>
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="flex items-center gap-2 text-[#9C8A7E] hover:text-[#C4704F] transition-colors text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a href="#" className="flex items-center gap-2 text-[#9C8A7E] hover:text-[#C4704F] transition-colors text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
              Telegram
            </a>
            <a href="#" className="flex items-center gap-2 text-[#9C8A7E] hover:text-[#C4704F] transition-colors text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
