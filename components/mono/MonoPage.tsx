import type { MonoT } from '@/lib/i18n';
import OrderForm from './OrderForm';
import MonoFaq from './MonoFaq';
import ProductDescription from './ProductDescription';
import ProductSpecs from './ProductSpecs';

type Props = {
  t: MonoT;
  newPrice: number;
  oldPrice: number;
  image: string;
};

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= n ? '#C8A86B' : '#E8DDD4'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

const UTP_ICONS = [
  <svg key="return" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>,
  <svg key="payment" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>,
  <svg key="delivery" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>,
  <svg key="cert" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>,
];

export default function MonoPage({ t, newPrice, oldPrice, image }: Props) {
  const discount = Math.round((1 - newPrice / oldPrice) * 100);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* ─── UTP HEADER STRIP ─── */}
      <div className="bg-[#1A1410] text-white py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 md:gap-x-24 gap-y-1.5 text-xs md:text-base font-medium">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
            </svg>
            {t.header.guarantee}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            {t.header.delivery}
          </span>
          <span className="flex items-center gap-1.5 font-bold text-[#C8A86B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
            −{discount}% {t.header.discount}
          </span>
        </div>
      </div>

      {/* ─── HERO IMAGE ─── */}
      <section className="bg-[#FDFAF7] border-b border-[#E8DDD4]">
        <div className="max-w-4xl mx-auto md:px-4 md:py-10">
          <img
            src={image}
            alt={t.product.name}
            className="w-full h-auto block"
          />
        </div>
      </section>

      {/* ─── PRODUCT INFO ─── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">

          {t.product.badge && (
            <span className="inline-block bg-[#C4704F] text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-5">
              {t.product.badge}
            </span>
          )}

          <h1 className="text-2xl md:text-4xl font-semibold text-[#1A1410] mb-4 leading-tight">
            {t.product.name}
          </h1>

          {/* rating */}
          <div className="flex items-center gap-2 mb-6">
            <Stars n={5} />
            <span className="text-sm text-[#6B5B4E]">{t.reviews.items.length} {t.reviews.badge.toLowerCase()}</span>
          </div>

          {/* price */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-[#E8DDD4]">
            <span className="text-5xl md:text-6xl font-bold text-[#1A1410]">{newPrice} €</span>
            <div className="flex flex-col gap-1">
              <span className="text-xl text-[#9C8A7E] line-through">{oldPrice} €</span>
              <span className="text-sm font-semibold text-white bg-[#C4704F] px-2 py-0.5 inline-block w-fit">
                −{discount}%
              </span>
            </div>
            <a
              href="#order"
              className="ml-auto inline-flex items-center gap-2 bg-[#C4704F] text-white px-6 py-3 font-semibold hover:bg-[#B05F40] transition-colors text-sm uppercase tracking-wide"
            >
              {t.heroBtn}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>

          {/* tagline */}
          <p className="text-lg text-[#6B5B4E] mb-8 font-medium">{t.product.tagline}</p>

          {/* full description */}
          <ProductDescription text={t.product.fullDesc} />

          <ProductSpecs
            table1Title={t.specs.table1Title}
            table1={t.specs.table1}
            table2Title={t.specs.table2Title}
            table2={t.specs.table2}
          />

          {/* scroll to order */}
          <a
            href="#order"
            className="mt-10 inline-flex items-center gap-2 bg-[#C4704F] text-white px-8 py-4 font-semibold hover:bg-[#B05F40] transition-colors text-sm uppercase tracking-wide"
          >
            {t.heroBtn}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ─── ORDER FORM ─── */}
      <section id="order" className="py-14 md:py-20 bg-[#F5F0EB]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.order.badge}</span>
            <h2 className="text-3xl font-light text-[#1A1410] mb-2">{t.order.title}</h2>
            <p className="text-sm text-[#6B5B4E]">{t.order.subtitle}</p>
          </div>

          <div className="bg-white border border-[#E8DDD4] p-6 md:p-10">
            {/* price reminder */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E8DDD4]">
              <span className="text-sm text-[#6B5B4E] max-w-[60%]">{t.product.name}</span>
              <div className="text-right">
                <div className="font-bold text-[#1A1410] text-xl">{newPrice} €</div>
                <div className="text-xs text-[#9C8A7E] line-through">{oldPrice} €</div>
              </div>
            </div>
            <OrderForm t={t.order} price={newPrice} />
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.reviews.badge}</span>
            <h2 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-3">{t.reviews.title}</h2>
            <p className="text-[#6B5B4E] text-sm">{t.reviews.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.reviews.items.map((r, i) => (
              <div key={i} className="border border-[#E8DDD4] p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-[#C4704F]/10 border border-[#C4704F]/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#C4704F]">{r.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#1A1410] text-sm">{r.name}</span>
                      <span className="text-[#9C8A7E] text-xs">{r.city}</span>
                    </div>
                    <Stars n={r.rating} />
                  </div>
                </div>
                <p className="text-[#6B5B4E] text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
                <div className="text-xs text-[#9C8A7E] pt-3 border-t border-[#E8DDD4]">{r.date}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#6B5B4E]">
            <div className="flex items-center gap-2">
              <Stars n={5} />
              <span className="font-semibold text-[#1A1410]">4.9</span>
              <span>— Trustpilot</span>
            </div>
            <div className="w-px h-5 bg-[#E8DDD4] hidden sm:block" />
            <div className="flex items-center gap-2">
              <Stars n={5} />
              <span className="font-semibold text-[#1A1410]">4.8</span>
              <span>— Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <MonoFaq t={t.faq} />

      {/* ─── UTP ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.utp.badge}</span>
            <h2 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-3">{t.utp.title}</h2>
            <p className="text-[#6B5B4E] text-sm max-w-sm mx-auto">{t.utp.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.utp.items.map(({ title, desc }, i) => (
              <div key={title} className="border border-[#E8DDD4] p-6 flex flex-col gap-4 hover:border-[#C4704F] hover:shadow-sm transition-all duration-200 group">
                <span className="text-[#C4704F] group-hover:scale-110 transition-transform duration-200 inline-block">
                  {UTP_ICONS[i]}
                </span>
                <h3 className="font-semibold text-[#1A1410] text-sm">{title}</h3>
                <p className="text-sm text-[#6B5B4E] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#1A1410] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">{t.utp.ctaTitle}</p>
              <p className="text-[#9C8A7E] text-sm">{t.utp.ctaSubtitle}</p>
            </div>
            <a href="#order" className="flex-shrink-0 bg-[#C4704F] text-white px-6 py-3 text-sm font-semibold hover:bg-[#B05F40] transition-colors uppercase tracking-wide">
              {t.utp.ctaBtn}
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#1A1410] text-[#9C8A7E] py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#C4704F" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="8" stroke="#C4704F" strokeWidth="1" />
              <circle cx="16" cy="16" r="3" fill="#C4704F" />
            </svg>
            <span className="text-white font-semibold">cookware market</span>
          </div>
          <p>© {new Date().getFullYear()} cookware market. {t.footer.rights}</p>
          <div className="flex items-center gap-3">
            {['Visa', 'MC', 'PayPal'].map(p => (
              <span key={p} className="border border-[#2D2420] px-2 py-1 text-[10px] tracking-wider">{p}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
