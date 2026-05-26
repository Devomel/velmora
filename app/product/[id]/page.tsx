import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMessages } from '@/lib/i18n';
import { getProductById, PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import { getProductReviews, type Review } from '@/lib/reviews';
import SiteHeader from '@/app/sections/SiteHeader';
import SiteFooter from '@/app/sections/SiteFooter';
import AddToCartButton from './AddToCartButton';
import ProductImageSlider from '@/components/ProductImageSlider';
import ProductSpecsTables from './ProductSpecsTables';

export async function generateStaticParams() {
  return PRODUCT_DATA.map(p => ({ id: String(p.id) }));
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
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
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill="#E8DDD4"
            />
            {fill > 0 && (
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill="#C8A86B"
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
    <div className="bg-white border border-[#E8DDD4] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C8A86B]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-[#C8A86B]">{initials}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1A1410]">{review.author}</p>
            <Stars rating={review.rating} size={12} />
          </div>
        </div>
        <span className="text-xs text-[#9C8A7E] whitespace-nowrap">{review.date}</span>
      </div>
      <p className="text-sm text-[#6B5B4E] leading-relaxed">{review.text}</p>
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { home, common } = await getMessages();
  const data = getProductById(Number(id));
  if (!data) notFound();

  const idx = data.id - 1;
  type SpecRow = [string, string];
  const locale = home.catalog.products[idx] as {
    name: string; material: string; description?: string; features?: string[];
    specs?: {
      detailsLabel: string; materialsLabel: string; highlightsLabel: string;
      details: SpecRow[]; materials: SpecRow[]; highlights: SpecRow[];
    };
  };
  const name = locale?.name ?? '';
  const material = locale?.material ?? '';
  const description = locale?.description ?? '';
  const features = locale?.features ?? [];

  const images = getProductImages(data.articleKey);
  const discountPct = data.oldPrice ? Math.round((1 - data.price / data.oldPrice) * 100) : null;

  const reviews = getProductReviews(data.articleKey);
  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : data.rating;

  const badge = (
    <>
      {data.badge && (
        <span className={`absolute top-4 left-4 z-10 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 ${data.badge === 'sale' ? 'bg-[#6B8F71]' : 'bg-[#C8A86B]'}`}>
          {data.badge === 'sale' ? home.catalog.badges.sale : home.catalog.badges.new}
        </span>
      )}
      {discountPct && (
        <span className="absolute top-4 right-4 z-10 bg-[#C4704F] text-white text-sm font-bold px-2 py-1">
          −{discountPct}%
        </span>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
      <SiteHeader t={home.header} nav={common.nav} />

      <main className="flex-1 pt-[var(--header-h)]">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="text-xs text-[#9C8A7E] flex items-center gap-2">
            <Link href="/" className="hover:text-[#C4704F] transition-colors">cookware market</Link>
            <span>›</span>
            <Link href="/#catalog" className="hover:text-[#C4704F] transition-colors">{home.catalog.title}</Link>
            <span>›</span>
            <span className="text-[#1A1410]">{name}</span>
          </nav>
        </div>

        {/* Product detail */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Slider */}
            <ProductImageSlider images={images} alt={name} badge={badge} />

            {/* Info */}
            <div className="py-4">
              <p className="text-xs uppercase tracking-widest text-[#9C8A7E] mb-2">{material}</p>
              <h1 className="text-2xl md:text-3xl font-light text-[#1A1410] mb-4 leading-snug">{name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <Stars rating={avgRating} />
                <span className="text-base font-semibold text-[#1A1410]">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-[#9C8A7E]">({data.reviews})</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-semibold text-[#1A1410]">€{data.price}</span>
                {data.oldPrice && (
                  <span className="text-lg text-[#9C8A7E] line-through">€{data.oldPrice}</span>
                )}
              </div>

              {description && (
                <p className="text-[#6B5B4E] leading-relaxed mb-6">{description}</p>
              )}

              {/* Features */}
              {features.length > 0 && (
                <ul className="mb-8 space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#6B5B4E]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <AddToCartButton
                item={{ id: data.id, name, price: data.price, image: images[0] ?? '' }}
                label={home.catalog.addToCart}
              />

              {/* Guarantees strip */}
              <div className="mt-8 pt-6 border-t border-[#E8DDD4] grid grid-cols-2 gap-4 text-xs text-[#6B5B4E]">
                {home.guarantees.items.slice(0, 2).map(item => (
                  <div key={item.title} className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item.title}</span>
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
                <h2 className="text-xl font-light text-[#1A1410]">{common.reviews.title}</h2>
                <span className="text-sm text-[#9C8A7E] mb-0.5">
                  {common.reviews.basedOn.replace('{count}', String(reviews.length))}
                </span>
              </div>

              {/* Summary bar */}
              <div className="flex items-center gap-4 mb-8 p-5 bg-white border border-[#E8DDD4] w-fit">
                <span className="text-4xl font-light text-[#1A1410]">{avgRating.toFixed(1)}</span>
                <div>
                  <Stars rating={avgRating} size={20} />
                  <p className="text-xs text-[#9C8A7E] mt-1">{common.reviews.average}</p>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review, i) => (
                  <ReviewCard key={i} review={review} />
                ))}
              </div>
            </section>
          )}

          {/* Back */}
          <div className="mt-12">
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-2 text-sm text-[#C4704F] border border-[#C4704F] px-6 py-3 hover:bg-[#C4704F] hover:text-white transition-colors"
            >
              ← {home.catalog.title}
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter t={home.footer} />
    </div>
  );
}
