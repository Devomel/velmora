'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HomeT } from '@/lib/i18n';
import type { ProductData } from '@/lib/products';
import { useCart } from '@/components/CartProvider';

type Props = { t: HomeT['catalog']; productImages: Record<string, string>; products: ProductData[] };

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

type Product = ProductData & { name: string; material: string; volume?: string; description: string };

function ProductCard({ product, addToCartLabel, badges, imageSrc }: {
  product: Product;
  addToCartLabel: string;
  badges: { sale: string; new: string };
  imageSrc: string;
}) {
  const { addItem } = useCart();

  return (
    <Link
      href={`/product/${product.id}`}
      className="bg-white border border-[#E8DDD4] flex flex-col group hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative bg-white overflow-hidden" style={{ height: '220px' }}>
        <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-300">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain p-3"
          />
        </div>
        {product.badge && (
          <span className={`absolute top-2 left-2 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${product.badge === 'sale' ? 'bg-[#6B8F71]' : 'bg-[#C8A86B]'}`}>
            {product.badge === 'sale' ? badges.sale : badges.new}
          </span>
        )}
        {product.oldPrice && (
          <span className="absolute top-2 right-2 bg-[#C4704F] text-white text-[10px] font-bold px-1.5 py-0.5">
            −{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[#9C8A7E] mb-1">
          {product.material}{product.volume ? ` · ${product.volume}` : ''}
        </p>
        <h3 className="text-sm font-medium text-[#1A1410] mb-2 leading-snug flex-1">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-[#9C8A7E]">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-semibold text-[#1A1410]">€{product.price}</span>
          {product.oldPrice && (
            <span className="text-xs text-[#9C8A7E] line-through">€{product.oldPrice}</span>
          )}
        </div>

        <button
          onClick={e => { e.preventDefault(); addItem({ id: product.id, name: product.name, price: product.price, image: '' }); }}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-[#1A1410] hover:bg-[#C4704F] text-white py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          {addToCartLabel}
        </button>
      </div>
    </Link>
  );
}

export default function CatalogSection({ t, productImages, products: productData }: Props) {
  const [activeCategoryKey, setActiveCategoryKey] = useState('all');
  const [priceIdx, setPriceIdx] = useState(0);
  const [minRating, setMinRating] = useState(0);

  const sortedPrices = productData.map(p => p.price).sort((a, b) => a - b);
  const p33 = sortedPrices[Math.floor(sortedPrices.length / 3)];
  const p66 = sortedPrices[Math.floor(sortedPrices.length * 2 / 3)];
  const PRICE_RANGES = [
    { min: 0,   max: Infinity },
    { min: 0,   max: p33 },
    { min: p33, max: p66 },
    { min: p66, max: Infinity },
  ];

  const { min, max } = PRICE_RANGES[priceIdx];

  const products: Product[] = productData.map((data, i) => ({
    ...data,
    name: t.products[i].name,
    material: t.products[i].material,
    volume: (t.products[i] as { volume?: string }).volume,
    description: (t.products[i] as { description?: string }).description ?? '',
  }));

  const filtered = products.filter(p =>
    (activeCategoryKey === 'all' || p.categoryKey === activeCategoryKey) &&
    p.price >= min && p.price <= max &&
    p.rating >= minRating
  );

  const categoryEntries = Object.entries(t.categoryMap) as [string, string][];
  const ratingOptions = [
    { value: 0, label: t.ratingAll },
    { value: 4, label: t.ratingFrom4 },
    { value: 5, label: t.rating5 },
  ];

  return (
    <section id="catalog" className="py-20 md:py-24 bg-[#FDFAF7]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-3">{t.title}</h2>
          <p className="text-[#6B5B4E] max-w-md mx-auto">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="flex flex-wrap gap-2">
            {categoryEntries.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategoryKey(key)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                  activeCategoryKey === key
                    ? 'bg-[#C4704F] border-[#C4704F] text-white'
                    : 'border-[#E8DDD4] text-[#6B5B4E] hover:border-[#C4704F] hover:text-[#C4704F]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto flex-wrap">
            <select
              value={priceIdx}
              onChange={e => setPriceIdx(Number(e.target.value))}
              className="border border-[#E8DDD4] text-xs text-[#6B5B4E] px-3 py-1.5 focus:border-[#C4704F] outline-none bg-white"
            >
              {t.priceFilters.map((label, i) => (
                <option key={i} value={i}>{label}</option>
              ))}
            </select>

            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="border border-[#E8DDD4] text-xs text-[#6B5B4E] px-3 py-1.5 focus:border-[#C4704F] outline-none bg-white"
            >
              {ratingOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} addToCartLabel={t.addToCart} badges={t.badges} imageSrc={productImages[p.articleKey]} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#9C8A7E]">{t.empty}</div>
        )}

        <div className="text-center mt-10">
          <button className="border border-[#C4704F] text-[#C4704F] hover:bg-[#C4704F] hover:text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors">
            {t.loadMore}
          </button>
        </div>
      </div>
    </section>
  );
}
