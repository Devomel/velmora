type ReviewItem = {
  name: string;
  city: string;
  rating: number;
  initials: string;
  text: string;
  product: string;
  date: string;
  source: string;
};

type ReviewsT = {
  badge: string;
  title: string;
  subtitle: string;
  items: ReviewItem[];
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= count ? '#C9A84C' : 'none'} stroke="#C9A84C" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const SOURCE_ICON: Record<string, React.ReactNode> = {
  Google: (
    <span className="text-[10px] font-semibold text-[#6B8070] bg-[#F3EFE5] px-2 py-0.5">Google</span>
  ),
  Trustpilot: (
    <span className="text-[10px] font-semibold text-[#6B8070] bg-[#F3EFE5] px-2 py-0.5">Trustpilot</span>
  ),
};

export default function L1Reviews({ t }: { t: ReviewsT }) {
  return (
    <section className="bg-[#FDFCF8] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#52B788] text-xs uppercase tracking-widest">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A2520] mt-3 mb-2">{t.title}</h2>
          <p className="text-[#6B8070] text-sm">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.items.map((review, i) => (
            <div
              key={i}
              className="bg-white border border-[#D8E8DC] p-6 flex flex-col gap-3 hover:border-[#52B788] transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A3D2B] to-[#52B788] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A2520]">{review.name}</div>
                    <div className="text-xs text-[#6B8070]">{review.city}</div>
                  </div>
                </div>
                {SOURCE_ICON[review.source] ?? null}
              </div>

              {/* Stars */}
              <Stars count={review.rating} />

              {/* Text */}
              <p className="text-sm text-[#3D5448] leading-relaxed flex-1">{review.text}</p>

              {/* Footer */}
              <div className="pt-3 border-t border-[#D8E8DC] flex items-center justify-between">
                <span className="text-xs text-[#52B788] truncate mr-2">{review.product}</span>
                <span className="text-xs text-[#6B8070] flex-shrink-0">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A84C">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-[#1A2520]">4,9</span>
            <span className="text-sm text-[#6B8070]">Google</span>
          </div>
          <div className="w-px h-8 bg-[#D8E8DC] hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A84C">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-[#1A2520]">4,8</span>
            <span className="text-sm text-[#6B8070]">Trustpilot</span>
          </div>
        </div>
      </div>
    </section>
  );
}
