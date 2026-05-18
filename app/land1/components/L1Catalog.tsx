'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useL1Cart } from './L1CartProvider';
import type { ProductData } from '@/lib/products';
import { getProductImagePath } from '@/lib/products';

type ProductLocale = {
  name: string;
  material: string;
  desc: string;
};

type CatalogT = {
  badge: string;
  title: string;
  subtitle: string;
  filterLabel: string;
  sortLabel: string;
  addToCart: string;
  loadMore: string;
  empty: string;
  badges: { sale: string; new: string };
  categories: Record<string, string>;
  sort: { default: string; priceAsc: string; priceDesc: string; rating: string };
  products: ProductLocale[];
};

type Props = {
  t: CatalogT;
  data: ProductData[];
};

type SortKey = 'default' | 'priceAsc' | 'priceDesc' | 'rating';

const CATEGORY_BG: Record<string, string> = {
  pans: 'from-[#3D2B1A] to-[#8B5A2B]',
  pots: 'from-[#1A2B3D] to-[#2D5A7A]',
  accessories: 'from-[#1A3D2B] to-[#2D6A4F]',
  sets: 'from-[#2B1A3D] to-[#6B4F8F]',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  pans: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#95D5B2" strokeWidth="1">
      <circle cx="10" cy="13" r="7" />
      <path d="M17 13h4M10 6V3" />
    </svg>
  ),
  pots: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#95D5B2" strokeWidth="1">
      <path d="M4 8h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
      <path d="M2 8h20M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M6 8V6M18 8V6" />
    </svg>
  ),
  accessories: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#95D5B2" strokeWidth="1">
      <path d="M6 3h1l5 9-2 2-1-1" />
      <path d="M14 3h1l1 5-1 1-1-1" />
      <path d="M4 20h16" />
    </svg>
  ),
  sets: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#95D5B2" strokeWidth="1">
      <circle cx="8" cy="14" r="5" />
      <circle cx="16" cy="14" r="5" />
      <path d="M8 9V4M16 9V4" />
    </svg>
  ),
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i <= rating ? '#C9A84C' : 'none'}
          stroke="#C9A84C"
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const PAGE_SIZE = 8;

export default function L1Catalog({ t, data }: Props) {
  const { addItem } = useL1Cart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [page, setPage] = useState(1);
  const [added, setAdded] = useState<number | null>(null);

  const categoryKeys = ['all', ...Object.keys(t.categories).filter(k => k !== 'all')];

  const filtered = useMemo(() => {
    let list = data.map((p, i) => ({ ...p, locale: t.products[i] }));
    if (activeCategory !== 'all') {
      list = list.filter(p => p.categoryKey === activeCategory);
    }
    switch (sortKey) {
      case 'priceAsc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'priceDesc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
    }
    return list;
  }, [data, activeCategory, sortKey, t.products]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const handleAdd = (p: typeof filtered[0]) => {
    addItem({ id: p.id, name: p.locale.name, price: p.price, image: '' });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <section id="catalog" className="bg-[#F3EFE5] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="text-[#52B788] text-xs uppercase tracking-widest">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1A2520] mt-3 mb-2">{t.title}</h2>
          <p className="text-[#6B8070] text-sm">{t.subtitle}</p>
        </div>

        {/* Filters + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category filter */}
          <div className="flex-1">
            <span className="text-xs text-[#6B8070] uppercase tracking-wider mb-2 block">{t.filterLabel}</span>
            <div className="flex flex-wrap gap-2">
              {categoryKeys.map(key => (
                <button
                  key={key}
                  onClick={() => { setActiveCategory(key); setPage(1); }}
                  className={`px-3 py-1.5 text-xs border transition-colors ${
                    activeCategory === key
                      ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                      : 'border-[#D8E8DC] text-[#3D5448] bg-white hover:border-[#52B788]'
                  }`}
                >
                  {t.categories[key] ?? key}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <span className="text-xs text-[#6B8070] uppercase tracking-wider mb-2 block">{t.sortLabel}</span>
            <select
              value={sortKey}
              onChange={e => { setSortKey(e.target.value as SortKey); setPage(1); }}
              className="w-full border border-[#D8E8DC] bg-white text-sm text-[#1A2520] px-3 py-2 focus:border-[#52B788] outline-none"
            >
              <option value="default">{t.sort.default}</option>
              <option value="priceAsc">{t.sort.priceAsc}</option>
              <option value="priceDesc">{t.sort.priceDesc}</option>
              <option value="rating">{t.sort.rating}</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        {visible.length === 0 ? (
          <p className="text-center text-[#6B8070] py-16">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map(p => {
              const bg = CATEGORY_BG[p.categoryKey] ?? 'from-[#1A3D2B] to-[#2D6A4F]';
              const icon = CATEGORY_ICONS[p.categoryKey];
              const isAdded = added === p.id;

              return (
                <div
                  key={p.id}
                  className="bg-white border border-[#D8E8DC] hover:border-[#52B788] hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  {/* Image */}
                  <Link href={`/land1/product/${p.id}`} className="relative block overflow-hidden bg-white" style={{ height: '220px' }}>
                    {p.badge && (
                      <span className="absolute top-3 left-3 z-10 bg-[#C9A84C] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                        {t.badges[p.badge]}
                      </span>
                    )}
                    <img
                      src={getProductImagePath(p.articleKey)}
                      alt={p.locale.name}
                      className="w-full h-full object-contain p-3"
                    />
                  </Link>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[10px] text-[#6B8070] uppercase tracking-wider mb-1">{p.locale.material}</div>
                    <Link href={`/land1/product/${p.id}`} className="hover:text-[#2D6A4F] transition-colors">
                      <h3 className="text-sm font-medium text-[#1A2520] mb-1 leading-tight">{p.locale.name}</h3>
                    </Link>
                    <p className="text-xs text-[#6B8070] leading-relaxed mb-3 flex-1">{p.locale.desc}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <StarRating rating={p.rating} />
                      <span className="text-[11px] text-[#6B8070]">({p.reviews})</span>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-[#1A2520]">€{p.price}</span>
                        {p.oldPrice && (
                          <span className="text-xs text-[#6B8070] line-through ml-1.5">€{p.oldPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAdd(p)}
                        className={`px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                          isAdded
                            ? 'bg-[#2D6A4F] text-white'
                            : 'bg-[#52B788] hover:bg-[#2D6A4F] text-white'
                        }`}
                      >
                        {isAdded ? '✓' : t.addToCart}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setPage(p => p + 1)}
              className="border border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white px-10 py-3 text-sm uppercase tracking-wider transition-colors"
            >
              {t.loadMore}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
