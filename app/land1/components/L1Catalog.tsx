'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useL1Cart } from './L1CartProvider';
import type { ProductData } from '@/lib/products';

type ProductLocale = { name: string; material: string; desc: string };

type CatalogT = {
  badge: string; title: string; subtitle: string;
  filterLabel: string; sortLabel: string; addToCart: string; loadMore: string; empty: string;
  badges: { sale: string; new: string };
  categories: Record<string, string>;
  sort: { default: string; priceAsc: string; priceDesc: string; rating: string };
  products: ProductLocale[];
};

type Props = { t: CatalogT; data: ProductData[]; productImages: Record<string, string> };
type SortKey = 'default' | 'priceAsc' | 'priceDesc' | 'rating';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= rating ? '#D97706' : 'none'} stroke="#D97706" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const PAGE_SIZE = 8;

export default function L1Catalog({ t, data, productImages }: Props) {
  const { addItem } = useL1Cart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [page, setPage] = useState(1);
  const [added, setAdded] = useState<number | null>(null);

  const categoryKeys = ['all', ...Object.keys(t.categories).filter(k => k !== 'all')];

  const filtered = useMemo(() => {
    let list = data.map(p => ({ ...p, locale: t.products[p.id - 1] }));
    if (activeCategory !== 'all') list = list.filter(p => p.categoryKey === activeCategory);
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
    <section id="catalog" className="bg-[#FEF2F2] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[#DC2626] text-xs uppercase tracking-widest">{t.badge}</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#111827] mt-3 mb-2">{t.title}</h2>
          <p className="text-[#6B7280] text-sm">{t.subtitle}</p>
        </div>

        {/* Filter + Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 border border-[#FECACA]">
          <div className="flex-1">
            <span className="text-xs text-[#6B7280] uppercase tracking-wider mb-2 block">{t.filterLabel}</span>
            <div className="flex flex-wrap gap-2">
              {categoryKeys.map(key => (
                <button
                  key={key}
                  onClick={() => { setActiveCategory(key); setPage(1); }}
                  className={`px-3 py-1.5 text-xs border transition-colors ${
                    activeCategory === key
                      ? 'bg-[#DC2626] border-[#DC2626] text-white'
                      : 'border-[#FECACA] text-[#374151] bg-white hover:border-[#DC2626]'
                  }`}
                >
                  {t.categories[key] ?? key}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:w-48">
            <span className="text-xs text-[#6B7280] uppercase tracking-wider mb-2 block">{t.sortLabel}</span>
            <select
              value={sortKey}
              onChange={e => { setSortKey(e.target.value as SortKey); setPage(1); }}
              className="w-full border border-[#FECACA] bg-white text-sm text-[#111827] px-3 py-2 focus:border-[#DC2626] outline-none"
            >
              <option value="default">{t.sort.default}</option>
              <option value="priceAsc">{t.sort.priceAsc}</option>
              <option value="priceDesc">{t.sort.priceDesc}</option>
              <option value="rating">{t.sort.rating}</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="text-center text-[#6B7280] py-16">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map(p => {
              const isAdded = added === p.id;
              return (
                <div key={p.id} className="bg-white border border-[#FECACA] hover:border-[#DC2626] hover:shadow-lg transition-all duration-200 flex flex-col">
                  <Link href={`/land1/product/${p.id}`} className="relative block overflow-hidden bg-white group" style={{ height: '220px' }}>
                    {p.badge && (
                      <span className="absolute top-3 left-3 z-10 bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                        {t.badges[p.badge]}
                      </span>
                    )}
                    <img
                      src={productImages[p.articleKey]}
                      alt={p.locale?.name ?? ''}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">{p.locale.material}</div>
                    <Link href={`/land1/product/${p.id}`} className="hover:text-[#DC2626] transition-colors">
                      <h3 className="text-sm font-medium text-[#111827] mb-1 leading-tight">{p.locale.name}</h3>
                    </Link>
                    <p className="text-xs text-[#6B7280] leading-relaxed mb-3 flex-1">{p.locale.desc}</p>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Stars rating={p.rating} />
                      <span className="text-[11px] text-[#6B7280]">({p.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-[#111827]">€{p.price}</span>
                        {p.oldPrice && <span className="text-xs text-[#6B7280] line-through ml-1.5">€{p.oldPrice}</span>}
                      </div>
                      <button
                        onClick={() => handleAdd(p)}
                        className={`px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                          isAdded ? 'bg-[#B91C1C] text-white' : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
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

        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setPage(p => p + 1)}
              className="border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-10 py-3 text-sm uppercase tracking-wider transition-colors"
            >
              {t.loadMore}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
