'use client';

import { useState } from 'react';
import type { MonoT } from '@/lib/i18n';

type Props = { t: MonoT['order']; price: number };

export default function OrderForm({ t, price }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-[#6B8F71]/10 border border-[#6B8F71]/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-[#1A1410] mb-3">{t.successTitle}</h3>
        <p className="text-[#6B5B4E] max-w-sm mx-auto leading-relaxed">{t.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-[#9C8A7E] block mb-1.5">{t.nameLabel}</label>
        <input
          type="text"
          placeholder={t.namePlaceholder}
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border border-[#E8DDD4] px-4 py-3 text-[#1A1410] placeholder-[#C4B4A8] focus:border-[#C4704F] focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-[#9C8A7E] block mb-1.5">{t.phoneLabel}</label>
        <input
          type="tel"
          placeholder={t.phonePlaceholder}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full border border-[#E8DDD4] px-4 py-3 text-[#1A1410] placeholder-[#C4B4A8] focus:border-[#C4704F] focus:outline-none transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-wider text-[#9C8A7E]">{t.qtyLabel}</span>
        <div className="flex items-center border border-[#E8DDD4]">
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-[#C4704F] hover:bg-[#C4704F]/5 transition-colors text-lg">−</button>
          <span className="w-10 text-center text-[#1A1410] font-medium">{qty}</span>
          <button type="button" onClick={() => setQty(q => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-[#C4704F] hover:bg-[#C4704F]/5 transition-colors text-lg">+</button>
        </div>
        <span className="text-sm text-[#6B5B4E]">
          {t.totalLabel}: <strong className="text-[#1A1410]">{price * qty} €</strong>
        </span>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#C4704F] text-white py-4 px-8 text-base font-semibold tracking-wide hover:bg-[#B05F40] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            {t.processing}
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {t.btnBuy}
          </>
        )}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#9C8A7E]">
        {t.trust.map((item) => (
          <span key={item} className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            {item}
          </span>
        ))}
      </div>
    </form>
  );
}
