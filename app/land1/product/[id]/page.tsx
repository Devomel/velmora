import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMessages, fmtPrice, IS_RO } from '@/lib/i18n';
import { getProductById, PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import { getProductReviews, type Review } from '@/lib/reviews';
import L1AddToCartButton from './L1AddToCartButton';
import L1Footer from '../../components/L1Footer';
import ProductImageSlider from '@/components/ProductImageSlider';
import ProductSpecsTables from '@/app/product/[id]/ProductSpecsTables';

const LOGO_TEXT = 'Emerald Craft';

export async function generateStaticParams() {
  return PRODUCT_DATA.map(p => ({ id: String(p.id) }));
}

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  const uid = `s${Math.round(rating * 10)}`;
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        const partial = fill > 0 && fill < 1;
        const clipId = `cp-${uid}-${i}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            {partial && (
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width={24 * fill} height="24" />
                </clipPath>
              </defs>
            )}
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FEE2E2" />
            {fill > 0 && (
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill="#DC2626"
                clipPath={partial ? `url(#${clipId})` : undefined}
              />
            )}
          </svg>
        );
      })}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="bg-white border border-[#FECACA] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FEE2E2] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-[#DC2626]">{initials}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#111827]">{review.author}</p>
            <Stars rating={review.rating} size={12} />
          </div>
        </div>
        <span className="text-xs text-[#6B7280] whitespace-nowrap">{review.date}</span>
      </div>
      <p className="text-sm text-[#374151] leading-relaxed">{review.text}</p>
    </div>
  );
}

export default async function L1ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { land1, common } = await getMessages();
  const data = getProductById(Number(id));
  if (!data) notFound();

  const idx = data.id - 1;
  type SpecRow = [string, string];
  const locale = land1.catalog.products[idx] as {
    name: string; material: string; desc?: string; features?: string[];
    specs?: {
      detailsLabel: string; materialsLabel: string; highlightsLabel: string;
      details: SpecRow[]; materials: SpecRow[]; highlights: SpecRow[];
    };
  };
  const name = locale?.name ?? '';
  const material = locale?.material ?? '';
  const desc = locale?.desc ?? '';
  const features = locale?.features ?? [];

  const reviews = getProductReviews(data.articleKey);
  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : data.rating;

  const images = getProductImages(data.articleKey, data.categoryKey);
  const discountPct = data.oldPrice ? Math.round((1 - data.price / data.oldPrice) * 100) : null;

  const related = PRODUCT_DATA
    .filter(p => p.id !== data.id && p.categoryKey === data.categoryKey)
    .slice(0, 3)
    .map(p => ({ ...p, locale: land1.catalog.products[p.id - 1] }));

  const badge = (
    <>
      {data.badge && (
        <span className="absolute top-4 left-4 z-10 bg-[#D97706] text-white text-xs font-bold px-3 py-1 uppercase">
          {land1.catalog.badges[data.badge]}
        </span>
      )}
      {discountPct && (
        <span className="absolute top-4 right-4 z-10 bg-white text-[#DC2626] text-sm font-bold px-3 py-1">
          −{discountPct}%
        </span>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#FEF2F2] border-b border-[#FECACA]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="text-xs text-[#6B7280] flex items-center gap-2 flex-wrap">
            <Link href="/land1" className="hover:text-[#DC2626] transition-colors">{LOGO_TEXT}</Link>
            <span>›</span>
            <Link href="/land1#catalog" className="hover:text-[#DC2626] transition-colors">{land1.catalog.title}</Link>
            <span>›</span>
            <span className="text-[#111827]">{name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">

          <ProductImageSlider images={images} alt={name} badge={badge} />

          <div className="py-2">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3">{material}</p>
            <h1 className="text-2xl md:text-3xl font-light text-[#111827] mb-5 leading-snug">{name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <Stars rating={avgRating} />
              <span className="text-base font-semibold text-[#111827]">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-[#6B7280]">({data.reviews})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#FECACA]">
              <span className="text-4xl font-light text-[#111827]">{fmtPrice(data.price, data.priceLei)}</span>
              {data.oldPrice && (
                <>
                  <span className="text-lg text-[#6B7280] line-through">{fmtPrice(data.oldPrice, data.oldPriceLei)}</span>
                  <span className="text-sm font-bold text-[#DC2626]">−{discountPct}%</span>
                </>
              )}
            </div>

            {desc && <p className="text-[#374151] leading-relaxed mb-6">{desc}</p>}

            {features.length > 0 && (
              <ul className="mb-8 space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <L1AddToCartButton item={{ id: data.id, name, price: IS_RO ? data.priceLei : data.price, image: images[0] ?? '' }} label={land1.catalog.addToCart} />

            <div className="mt-8 grid grid-cols-2 gap-3">
              {land1.usp.items.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs text-[#374151] leading-snug">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs tables */}
        {locale?.specs && <ProductSpecsTables specs={locale.specs} />}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end gap-4 mb-8">
              <h2 className="text-xl font-light text-[#111827]">{common.reviews.title}</h2>
              <span className="text-sm text-[#6B7280] mb-0.5">
                {common.reviews.basedOn.replace('{count}', String(reviews.length))}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8 p-5 bg-white border border-[#FECACA] w-fit">
              <span className="text-4xl font-light text-[#111827]">{avgRating.toFixed(1)}</span>
              <div>
                <Stars rating={avgRating} size={20} />
                <p className="text-xs text-[#6B7280] mt-1">{common.reviews.average}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="border-t border-[#FECACA] pt-14">
            <h2 className="text-xl font-light text-[#111827] mb-6">
              {(land1.catalog.categories as Record<string, string>)[data.categoryKey] ?? ''}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(p => (
                <Link
                  key={p.id}
                  href={`/land1/product/${p.id}`}
                  className="bg-white border border-[#FECACA] hover:border-[#DC2626] hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  <div className="h-48 bg-white overflow-hidden">
                    <img src={getProductImages(p.articleKey)[0]} alt={p.locale?.name ?? ''} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">{p.locale?.material}</p>
                    <p className="text-sm font-medium text-[#111827] mb-2 leading-tight">{p.locale?.name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-[#111827]">{fmtPrice(p.price, p.priceLei)}</span>
                      {p.oldPrice && <span className="text-xs text-[#6B7280] line-through">{fmtPrice(p.oldPrice, p.oldPriceLei)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            href="/land1#catalog"
            className="inline-flex items-center gap-2 text-sm text-[#DC2626] border-2 border-[#DC2626] px-6 py-3 hover:bg-[#DC2626] hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {land1.catalog.title}
          </Link>
        </div>
      </main>

      <L1Footer t={land1.footer} logoText={LOGO_TEXT} />
    </div>
  );
}
