import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMessages } from '@/lib/i18n';
import { getProductById, PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import L1AddToCartButton from './L1AddToCartButton';
import L1Footer from '../../components/L1Footer';
import ProductImageSlider from '@/components/ProductImageSlider';

const LOGO_TEXT = 'Emerald Craft';

export async function generateStaticParams() {
  return PRODUCT_DATA.map(p => ({ id: String(p.id) }));
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i <= rating ? '#D97706' : 'none'} stroke="#D97706" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default async function L1ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { land1 } = await getMessages();
  const data = getProductById(Number(id));
  if (!data) notFound();

  const idx = data.id - 1;
  const locale = land1.catalog.products[idx] as {
    name: string; material: string; desc?: string; features?: string[];
  };
  const name = locale?.name ?? '';
  const material = locale?.material ?? '';
  const desc = locale?.desc ?? '';
  const features = locale?.features ?? [];

  const images = getProductImages(data.articleKey);
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
              <Stars rating={data.rating} />
              <span className="text-sm text-[#6B7280]">({data.reviews})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#FECACA]">
              <span className="text-4xl font-light text-[#111827]">€{data.price}</span>
              {data.oldPrice && (
                <>
                  <span className="text-lg text-[#6B7280] line-through">€{data.oldPrice}</span>
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

            <L1AddToCartButton item={{ id: data.id, name, price: data.price, image: images[0] ?? '' }} label={land1.catalog.addToCart} />

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
                      <span className="text-base font-semibold text-[#111827]">€{p.price}</span>
                      {p.oldPrice && <span className="text-xs text-[#6B7280] line-through">€{p.oldPrice}</span>}
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
