import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMessages } from '@/lib/i18n';
import { getProductById, PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import SiteHeader from '@/app/sections/SiteHeader';
import SiteFooter from '@/app/sections/SiteFooter';
import AddToCartButton from './AddToCartButton';
import ProductImageSlider from '@/components/ProductImageSlider';
import ProductSpecsTables from './ProductSpecsTables';

export async function generateStaticParams() {
  return PRODUCT_DATA.map(p => ({ id: String(p.id) }));
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= rating ? '#C8A86B' : '#E8DDD4'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { home } = await getMessages();
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
      <SiteHeader t={home.header} />

      <main className="flex-1">
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
                <Stars rating={data.rating} />
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
