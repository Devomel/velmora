import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMessages, fmtPrice, IS_RO } from '@/lib/i18n';
import { getProductById, PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import { getProductReviews } from '@/lib/reviews';
import SiteHeader from '@/app/sections/SiteHeader';
import SiteFooter from '@/app/sections/SiteFooter';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import ProductSpecsList from './ProductSpecsList';
import SimilarProducts from './SimilarProducts';
import ReviewsSection from './ReviewsSection';
import ViewItemTracker from '@/components/ViewItemTracker';
import CountdownTimer from '@/components/CountdownTimer';
import Tabs from '@/components/Tabs';
import { featureIcon } from '@/lib/feature-icon';
import RichText from '@/components/RichText';

const GUARANTEE_ICONS = [
  <svg key="return" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>,
  <svg key="payment" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>,
  <svg key="delivery" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>,
  <svg key="cert" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>,
];

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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { home, common } = await getMessages();
  const data = getProductById(Number(id));
  if (!data) notFound();

  const idx = data.id - 1;
  type SpecRow = [string, string];
  const locale = home.catalog.products[idx] as {
    name: string; material: string; description?: string; features?: string[];
    longDescription?: string[]; contents?: string[]; gift?: string; tagline?: string;
    specs?: {
      detailsLabel: string; materialsLabel: string; highlightsLabel: string;
      details: SpecRow[]; materials: SpecRow[]; highlights: SpecRow[];
    };
  };
  const name = locale?.name ?? '';
  const material = locale?.material ?? '';
  const description = locale?.description ?? '';
  const features = locale?.features ?? [];
  const longDescription = locale?.longDescription ?? [];
  const setContents = locale?.contents ?? [];
  const gift = locale?.gift ?? '';
  const tagline = locale?.tagline ?? '';
  const categoryEmoji = data.categoryKey === 'pans' ? '🍳' : data.categoryKey === 'pots' ? '🍲' : data.categoryKey === 'knives' ? '🔪' : '✨';

  const images = getProductImages(data.articleKey, data.categoryKey);
  const discountPct = data.oldPrice ? Math.round((1 - data.price / data.oldPrice) * 100) : null;

  const reviews = getProductReviews(data.articleKey);
  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : data.rating;

  const similarItems = PRODUCT_DATA
    .filter(p => p.categoryKey === data.categoryKey && p.id !== data.id)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      name: home.catalog.products[p.id - 1]?.name ?? '',
      image: getProductImages(p.articleKey, p.categoryKey)[0] ?? '',
      price: p.price,
      priceLei: p.priceLei,
      oldPrice: p.oldPrice,
      oldPriceLei: p.oldPriceLei,
      rating: p.rating,
      reviews: p.reviews,
    }));

  const badge = (
    <>
      {data.badge && (
        <span className={`absolute top-4 left-4 z-10 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm ${data.badge === 'sale' ? 'bg-[#6B8F71]' : 'bg-[#C8A86B]'}`}>
          {data.badge === 'sale' ? home.catalog.badges.sale : home.catalog.badges.new}
        </span>
      )}
      {discountPct && (
        <span className="absolute top-4 right-4 z-10 bg-[#C4704F] text-white text-sm font-bold px-2 py-1 rounded-sm">
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-xs text-[#7D6C5E] flex items-center gap-2">
            <Link href="/" className="hover:text-[#C4704F] transition-colors">cookware market</Link>
            <span>›</span>
            <Link href="/#catalog" className="hover:text-[#C4704F] transition-colors">{home.catalog.title}</Link>
            <span>›</span>
            <span className="text-[#1A1410]">{name}</span>
          </nav>
        </div>

        {/* Product detail */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Gallery */}
            <div className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
              <ProductGallery images={images} alt={name} badge={badge} />
            </div>

            {/* Info */}
            <div className="py-4">
              <p className="text-xs uppercase tracking-widest text-[#7D6C5E] mb-2">{material}</p>
              <h1 className="text-2xl md:text-3xl font-light text-[#1A1410] mb-4 leading-snug">{name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <Stars rating={avgRating} />
                <span className="text-base font-semibold text-[#1A1410]">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-[#7D6C5E]">({data.reviews})</span>
              </div>

              {/* Buy box */}
              <div className="bg-white border border-[#E8DDD4] shadow-sm p-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold text-[#1A1410]">{fmtPrice(data.price, data.priceLei)}</span>
                  {data.oldPrice && (
                    <span className="text-lg text-[#7D6C5E] line-through">{fmtPrice(data.oldPrice, data.oldPriceLei)}</span>
                  )}
                </div>

                {data.oldPrice && (
                  <p className="text-sm font-semibold text-[#6B8F71] mb-4">
                    −{discountPct}% · {fmtPrice(data.oldPrice - data.price, data.oldPriceLei - data.priceLei)} {home.catalog.youSave}
                  </p>
                )}

                <div className="flex items-center gap-3 mb-6 text-sm">
                  <span className="inline-flex items-center gap-1.5 bg-[#6B8F71]/10 text-[#6B8F71] font-medium px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B8F71]" />
                    {home.catalog.inStock}
                  </span>
                  <span className="text-[#7D6C5E]">{home.catalog.sku} {data.articleKey}</span>
                </div>

                <ViewItemTracker articleKey={data.articleKey} name={name} price={IS_RO ? data.priceLei : data.price} />
                <AddToCartButton
                  item={{ id: data.id, articleKey: data.articleKey, name, price: IS_RO ? data.priceLei : data.price, image: images[0] ?? '' }}
                  label={home.catalog.addToCart}
                />

                {data.oldPrice && (
                  <div className="mt-6">
                    <CountdownTimer
                      label={home.promoTimer.label}
                      hours={home.promoTimer.hours}
                      minutes={home.promoTimer.minutes}
                      seconds={home.promoTimer.seconds}
                    />
                  </div>
                )}
              </div>

              {/* Guarantees grid */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {home.guarantees.items.map((item, i) => (
                  <div key={item.title} className="flex items-center gap-3 bg-white border border-[#E8DDD4] px-3 py-3 text-xs text-[#5A4A3D]">
                    <span className="text-[#C4704F] flex-shrink-0 w-8 h-8 rounded-full bg-[#C4704F]/10 flex items-center justify-center [&>svg]:w-[18px] [&>svg]:h-[18px]">
                      {GUARANTEE_ICONS[i]}
                    </span>
                    <span className="font-medium text-[#1A1410]">{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Tabs: specs / description / reviews */}
              <div className="mt-10 pt-8 border-t border-[#E8DDD4]">
                <Tabs
                  tabs={[
                    {
                      label: home.catalog.tabSpecs,
                      content: locale?.specs ? (
                        <ProductSpecsList
                          specs={locale.specs}
                          contentsLabel={home.catalog.contentsLabel}
                          contents={description}
                          brandLabel={home.catalog.brandLabel}
                          brandValue="Velmora"
                        />
                      ) : null,
                    },
                    {
                      label: home.catalog.tabDescription,
                      content: (
                        <div>
                          <div className="flex items-start gap-2 mb-4">
                            <span className="text-2xl leading-none flex-shrink-0">{categoryEmoji}</span>
                            <h3 className="text-xl font-semibold text-[#1A1410] leading-snug pt-0.5">{name}</h3>
                          </div>

                          <div className="space-y-4">
                            {longDescription.map((paragraph, i) => (
                              <p key={i} className="text-[#5A4A3D] leading-relaxed">
                                <RichText text={paragraph} />
                              </p>
                            ))}
                          </div>

                          {setContents.length > 0 && (
                            <div className="mt-7 pt-6 border-t border-[#E8DDD4]">
                              <h4 className="text-lg font-semibold text-[#1A1410] mb-3">
                                {home.catalog.setIncludesLabel}
                              </h4>
                              <ul className="space-y-2">
                                {setContents.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-[#5A4A3D]">
                                    <span className="text-[#7D6C5E] flex-shrink-0">–</span>
                                    <RichText text={item} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {features.length > 0 && (
                            <div className="mt-7 pt-6 border-t border-[#E8DDD4]">
                              <h4 className="text-lg font-semibold text-[#1A1410] mb-3">
                                {home.catalog.advantagesLabel}
                              </h4>
                              <ul className="space-y-3">
                                {features.map((f, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm">
                                    <span className="text-lg leading-none flex-shrink-0">{featureIcon(f)}</span>
                                    <span className="text-[#5A4A3D] pt-0.5"><RichText text={f} /></span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {gift && (
                            <div className="mt-7 pt-6 border-t border-[#E8DDD4]">
                              <h4 className="text-lg font-semibold text-[#1A1410] mb-3">
                                {home.catalog.giftLabel}
                              </h4>
                              <p className="flex items-start gap-2 text-sm text-[#5A4A3D]">
                                <span className="text-lg leading-none flex-shrink-0">🎁</span>
                                <RichText text={gift} />
                              </p>
                            </div>
                          )}

                          {tagline && (
                            <p className="mt-7 pt-6 border-t border-[#E8DDD4] text-sm font-semibold text-[#1A1410]">
                              {tagline}
                            </p>
                          )}
                        </div>
                      ),
                    },
                    {
                      label: home.catalog.tabReviews,
                      badge: reviews.length,
                      content: <ReviewsSection reviews={reviews} avgRating={avgRating} t={common.reviews} />,
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <SimilarProducts title={home.catalog.similarLabel} items={similarItems} />

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
