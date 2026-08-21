import Link from 'next/link';
import { fmtPrice } from '@/lib/i18n';

type SimilarItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  priceLei: number;
  oldPrice: number;
  oldPriceLei: number;
  rating: number;
  reviews: number;
};

function Stars({ rating }: { rating: number }) {
  const uid = `sim${Math.round(rating * 10)}`;
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        const partial = fill > 0 && fill < 1;
        const clipId = `cp-${uid}-${i}`;
        return (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24">
            {partial && (
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width={24 * fill} height="24" />
                </clipPath>
              </defs>
            )}
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#E8DDD4" />
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

export default function SimilarProducts({ title, items }: { title: string; items: SimilarItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[#E8DDD4]">
      <h2 className="text-xl font-light text-[#1A1410] mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="bg-white border border-[#E8DDD4] rounded-lg overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative bg-white overflow-hidden aspect-square">
              <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-300">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-3" />
              </div>
              {item.oldPrice > 0 && (
                <span className="absolute top-2 right-2 bg-[#C4704F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  −{Math.round((1 - item.price / item.oldPrice) * 100)}%
                </span>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-xs font-medium text-[#1A1410] mb-2 leading-snug line-clamp-2">{item.name}</h3>
              <div className="mt-auto">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Stars rating={item.rating} />
                  <span className="text-[10px] text-[#7D6C5E]">({item.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1A1410]">{fmtPrice(item.price, item.priceLei)}</span>
                  {item.oldPrice > 0 && (
                    <span className="text-[11px] text-[#7D6C5E] line-through">{fmtPrice(item.oldPrice, item.oldPriceLei)}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
