'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HomeT } from '@/lib/i18n';
import type { ProductData } from '@/lib/products';
import { useCart } from '@/components/CartProvider';

type AddItemFn = (item: { id: number; name: string; price: number; image: string }) => void;
type Props = { t: HomeT['catalog']; productImages: Record<string, string>; products: ProductData[]; productLinkPrefix?: string; priceOnly?: boolean; onAddItem?: AddItemFn };

function Stars({ rating }: { rating: number }) {
   const uid = `s${Math.round(rating * 10)}`;
   return (
      <span className="inline-flex gap-0.5">
         {[1, 2, 3, 4, 5].map(i => {
            const fill = Math.min(1, Math.max(0, rating - (i - 1)));
            const partial = fill > 0 && fill < 1;
            const clipId = `cp-${uid}-${i}`;
            return (
               <svg key={i} width="14" height="14" viewBox="0 0 24 24">
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

function Chevron({ active }: { active: boolean }) {
   return (
      <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
         <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke={active ? '#C4704F' : '#9C8A7E'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      </div>
   );
}

type Product = ProductData & { name: string; material: string; volume?: string; description: string };

function ProductCard({ product, addToCartLabel, badges, imageSrc, productLinkPrefix, addItem }: {
   product: Product;
   addToCartLabel: string;
   badges: { sale: string; new: string };
   imageSrc: string;
   productLinkPrefix: string;
   addItem: AddItemFn;
}) {

   return (
      <Link
         href={`${productLinkPrefix}${product.id}`}
         className="bg-white border border-[#E8DDD4] flex flex-col group hover:shadow-md transition-shadow duration-200"
      >
         <div className="relative bg-white overflow-hidden aspect-square">
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
            <h3 className="text-sm font-medium text-[#1A1410] mb-2 leading-snug line-clamp-2">{product.name}</h3>

            <div className="mt-auto">
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
                  onClick={e => { e.preventDefault(); addItem({ id: product.id, name: product.name, price: product.price, image: imageSrc }); }}
                  className="w-full flex items-center justify-center bg-[#C4704F] hover:bg-[#B5633F] text-white py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
               >
                  {addToCartLabel}
               </button>
            </div>
         </div>
      </Link>
   );
}

export default function CatalogSection({ t, productImages, products: productData, productLinkPrefix = '/product/', priceOnly = false, onAddItem }: Props) {
   const { addItem: defaultAddItem } = useCart();
   const addItem = onAddItem ?? defaultAddItem;
   const [activeCategoryKey, setActiveCategoryKey] = useState('all');
   const [priceIdx, setPriceIdx] = useState(0);
   const [minRating, setMinRating] = useState(0);
   const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

   const sortedPrices = productData.map(p => p.price).sort((a, b) => a - b);
   const p33 = sortedPrices[Math.floor(sortedPrices.length / 3)];
   const p66 = sortedPrices[Math.floor(sortedPrices.length * 2 / 3)];
   const PRICE_RANGES = [
      { min: 0, max: Infinity },
      { min: 0, max: p33 },
      { min: p33, max: p66 },
      { min: p66, max: Infinity },
   ];

   const { min, max } = PRICE_RANGES[priceIdx];

   const products: Product[] = productData.map((data) => ({
      ...data,
      name: t.products[data.id - 1].name,
      material: t.products[data.id - 1].material,
      volume: (t.products[data.id - 1] as { volume?: string }).volume,
      description: (t.products[data.id - 1] as { description?: string }).description ?? '',
   }));

   const filtered = products
      .filter(p =>
         (activeCategoryKey === 'all' || p.categoryKey === activeCategoryKey) &&
         p.price >= min && p.price <= max &&
         p.rating >= minRating
      )
      .sort((a, b) =>
         sortOrder === 'asc' ? a.price - b.price :
         sortOrder === 'desc' ? b.price - a.price : 0
      );

   const categoryEntries = Object.entries(t.categoryMap) as [string, string][];
   const ratingOptions = [
      { value: 0, label: t.ratingAll },
      { value: 4, label: t.ratingFrom4 },
      { value: 5, label: t.rating5 },
   ];

   return (
      <section id="catalog" className="pt-8 pb-20 md:pt-10 md:pb-24 bg-[#FDFAF7]">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
               <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{t.badge}</span>
               <h2 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-3">{t.title}</h2>
               <p className="text-[#6B5B4E] max-w-md mx-auto">{t.subtitle}</p>
            </div>

            {/* Mobile dropdowns */}
            <div className="flex gap-3 mb-6 md:hidden">
               {priceOnly
                  ? <div className="relative flex-1">
                       <select
                          value={priceIdx}
                          onChange={e => setPriceIdx(Number(e.target.value))}
                          className={`w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium border bg-[#FDFAF7] text-[#1A1410] cursor-pointer focus:outline-none transition-colors ${priceIdx !== 0 ? 'border-[#C4704F]' : 'border-[#E8DDD4]'}`}
                       >
                          {t.priceFilters.map((label, i) => (
                             <option key={i} value={i}>{label}</option>
                          ))}
                       </select>
                       <Chevron active={priceIdx !== 0} />
                    </div>
                  : <>
                       <div className="relative flex-1">
                          <select
                             value={activeCategoryKey}
                             onChange={e => setActiveCategoryKey(e.target.value)}
                             className={`w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium border bg-[#FDFAF7] text-[#1A1410] cursor-pointer focus:outline-none transition-colors ${activeCategoryKey !== 'all' ? 'border-[#C4704F]' : 'border-[#E8DDD4]'}`}
                          >
                             {categoryEntries.map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                             ))}
                          </select>
                          <Chevron active={activeCategoryKey !== 'all'} />
                       </div>
                       <div className="relative">
                          <select
                             value={sortOrder}
                             onChange={e => setSortOrder(e.target.value as 'default' | 'asc' | 'desc')}
                             className={`w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium border bg-[#FDFAF7] text-[#1A1410] cursor-pointer focus:outline-none transition-colors ${sortOrder !== 'default' ? 'border-[#C4704F]' : 'border-[#E8DDD4]'}`}
                          >
                             <option value="default">{t.sortDefault}</option>
                             <option value="asc">{t.sortAsc}</option>
                             <option value="desc">{t.sortDesc}</option>
                          </select>
                          <Chevron active={sortOrder !== 'default'} />
                       </div>
                    </>
               }
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex flex-wrap gap-2 mb-6">
               {priceOnly
                  ? t.priceFilters.map((label, i) => (
                       <button
                          key={i}
                          onClick={() => setPriceIdx(i)}
                          className={`px-3 py-1.5 text-xs font-medium border transition-colors ${priceIdx === i
                             ? 'bg-[#C4704F] border-[#C4704F] text-white'
                             : 'border-[#E8DDD4] text-[#6B5B4E] hover:border-[#C4704F] hover:text-[#C4704F]'
                             }`}
                       >
                          {label}
                       </button>
                    ))
                  : <>
                       <div className="flex flex-wrap gap-2 flex-1">
                          {categoryEntries.map(([key, label]) => (
                             <button
                                key={key}
                                onClick={() => setActiveCategoryKey(key)}
                                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${activeCategoryKey === key
                                   ? 'bg-[#C4704F] border-[#C4704F] text-white'
                                   : 'border-[#E8DDD4] text-[#6B5B4E] hover:border-[#C4704F] hover:text-[#C4704F]'
                                   }`}
                             >
                                {label}
                             </button>
                          ))}
                       </div>
                       <div className="flex gap-2">
                          {(['default', 'asc', 'desc'] as const).map(order => (
                             <button
                                key={order}
                                onClick={() => setSortOrder(order)}
                                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${sortOrder === order
                                   ? 'bg-[#1A1410] border-[#1A1410] text-white'
                                   : 'border-[#E8DDD4] text-[#6B5B4E] hover:border-[#1A1410] hover:text-[#1A1410]'
                                   }`}
                             >
                                {order === 'default' ? t.sortDefault : order === 'asc' ? t.sortAsc : t.sortDesc}
                             </button>
                          ))}
                       </div>
                    </>
               }
            </div>

            {filtered.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filtered.map(p => (
                     <ProductCard key={p.id} product={p} addToCartLabel={t.addToCart} badges={t.badges} imageSrc={productImages[p.articleKey]} productLinkPrefix={productLinkPrefix} addItem={addItem} />
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
