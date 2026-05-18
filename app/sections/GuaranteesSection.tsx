import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['guarantees'] };

const ICONS = [
  <svg key="return" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>,
  <svg key="payment" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>,
  <svg key="delivery" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>,
  <svg key="cert" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>,
];

export default function GuaranteesSection({ t }: Props) {
  return (
    <section id="guarantees" className="py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-3">{t.title}</h2>
          <p className="text-[#6B5B4E] max-w-md mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.items.map(({ title, desc }, i) => (
            <div
              key={title}
              className="border border-[#E8DDD4] p-6 flex flex-col gap-4 hover:border-[#C4704F] hover:shadow-sm transition-all duration-200 group"
            >
              <span className="text-[#C4704F] group-hover:scale-110 transition-transform duration-200 inline-block">
                {ICONS[i]}
              </span>
              <h3 className="font-semibold text-[#1A1410]">{title}</h3>
              <p className="text-sm text-[#6B5B4E] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#FDFAF7] border border-[#E8DDD4] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3 text-[#6B5B4E]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.72 13.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.63 2.84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l.79-.79a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            <span><strong className="text-[#1A1410]">{t.phone}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#6B5B4E]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t.workingHours}
          </div>
        </div>
      </div>
    </section>
  );
}
