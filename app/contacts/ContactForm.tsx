'use client';

import { useState } from 'react';
import type { ContactsT } from '@/lib/i18n';

type Props = { t: ContactsT['form'] };

export default function ContactForm({ t }: Props) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-[#6B8F71]/10 border border-[#6B8F71]/30 p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="1.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p className="text-[#1A1410] font-medium">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-medium text-[#1A1410] mb-4">{t.title}</h2>

      <input
        type="text"
        placeholder={t.name}
        required
        className="w-full border border-[#E8DDD4] px-4 py-3 text-sm focus:border-[#C4704F] outline-none bg-white"
      />
      <input
        type="email"
        placeholder={t.email}
        required
        className="w-full border border-[#E8DDD4] px-4 py-3 text-sm focus:border-[#C4704F] outline-none bg-white"
      />
      <select className="w-full border border-[#E8DDD4] px-4 py-3 text-sm text-[#6B5B4E] focus:border-[#C4704F] outline-none bg-white">
        {t.subjects.map(s => <option key={s}>{s}</option>)}
      </select>
      <textarea
        placeholder={t.message}
        rows={5}
        required
        className="w-full border border-[#E8DDD4] px-4 py-3 text-sm focus:border-[#C4704F] outline-none bg-white resize-none"
      />
      <button
        type="submit"
        className="w-full bg-[#C4704F] hover:bg-[#A85A3A] text-white py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
      >
        {t.submit}
      </button>
    </form>
  );
}
