import type { HomeT } from '@/lib/i18n';

type Props = { t: HomeT['reviews'] };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? '#C8A86B' : '#E8DDD4'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsSection({ t }: Props) {
  return (
    <section className="py-20 md:py-24 bg-[#F5F0EB]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-3">{t.title}</h2>
          <p className="text-[#6B5B4E]">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.items.map(r => (
            <div key={r.name + r.date} className="bg-white border border-[#E8DDD4] p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#C4704F]/10 border border-[#C4704F]/20 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#C4704F]">{r.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-medium text-[#1A1410] text-sm">{r.name}</span>
                      <span className="text-[#9C8A7E] text-xs ml-2">{r.city}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#9C8A7E] border border-[#E8DDD4] px-2 py-0.5 flex-shrink-0">
                      {r.source}
                    </span>
                  </div>
                  <Stars rating={r.rating} />
                </div>
              </div>

              <p className="text-[#6B5B4E] text-sm leading-relaxed">"{r.text}"</p>

              <div className="flex items-center justify-between text-xs text-[#9C8A7E] pt-2 border-t border-[#E8DDD4]">
                <span>{r.product}</span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#" className="inline-flex items-center gap-2 text-sm text-[#C4704F] border border-[#C4704F] px-5 py-2.5 hover:bg-[#C4704F] hover:text-white transition-colors">
            {t.rozetkaLink}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
          <a href="#" className="inline-flex items-center gap-2 text-sm text-[#6B5B4E] border border-[#E8DDD4] px-5 py-2.5 hover:border-[#C4704F] hover:text-[#C4704F] transition-colors">
            {t.googleLink}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
