import fs from 'fs';
import path from 'path';
import { loadAllReviewCounts, loadAverageRatings } from './reviews';
import { POT_ARTICLE_KEYS, PAN_ARTICLE_KEYS } from './categories';

export type ProductData = {
   id: number;
   articleKey: string;
   price: number;
   oldPrice: number;
   priceLei: number;
   oldPriceLei: number;
   rating: number;
   reviews: number;
   badge?: 'sale' | 'new';
   categoryKey: string;
};

type Meta = Omit<ProductData, 'price' | 'oldPrice' | 'priceLei' | 'oldPriceLei' | 'categoryKey'>;

const potSet = new Set(POT_ARTICLE_KEYS);
const panSet = new Set(PAN_ARTICLE_KEYS);

function categoryKeyFor(articleKey: string): string {
   if (panSet.has(articleKey)) return 'pans';
   if (potSet.has(articleKey)) return 'pots';
   return 'other';
}

const STATIC_META: Meta[] = [
   { id: 1,  articleKey: '55-333-477', rating: 5, reviews: 55,  badge: 'sale' },
   { id: 2,  articleKey: '55-333-527', rating: 5, reviews: 78,  badge: 'sale' },
   { id: 3,  articleKey: '28546',      rating: 4, reviews: 101, badge: 'sale' },
   { id: 4,  articleKey: '55-333-675', rating: 5, reviews: 124, badge: 'sale' },
   { id: 5,  articleKey: '55-333-644', rating: 5, reviews: 27,  badge: 'sale' },
   { id: 6,  articleKey: '28473',      rating: 4, reviews: 50,  badge: 'sale' },
   { id: 7,  articleKey: '28567',      rating: 5, reviews: 73,  badge: 'sale' },
   { id: 8,  articleKey: '55-333-554', rating: 5, reviews: 96,  badge: 'sale' },
   { id: 9,  articleKey: '28460',      rating: 4, reviews: 119, badge: 'sale' },
   { id: 10, articleKey: '55-333-535', rating: 5, reviews: 22,  badge: 'sale' },
   { id: 11, articleKey: '28480',      rating: 5, reviews: 45,  badge: 'sale' },
   { id: 12, articleKey: '55-333-419', rating: 4, reviews: 68,  badge: 'sale' },
   { id: 13, articleKey: '55-333-462', rating: 5, reviews: 91,  badge: 'sale' },
   { id: 14, articleKey: '28827',      rating: 5, reviews: 114, badge: 'sale' },
   { id: 15, articleKey: '55-333-641', rating: 4, reviews: 17,  badge: 'sale' },
   { id: 16, articleKey: '55-333-571', rating: 5, reviews: 40,  badge: 'sale' },
   { id: 17, articleKey: '55-333-387', rating: 5, reviews: 63,  badge: 'sale' },
   { id: 18, articleKey: '28483',      rating: 4, reviews: 86,  badge: 'sale' },
   { id: 19, articleKey: '55-333-621', rating: 5, reviews: 109, badge: 'sale' },
   { id: 20, articleKey: '28471',      rating: 5, reviews: 132, badge: 'sale' },
   { id: 21, articleKey: '28528',      rating: 4, reviews: 35,  badge: 'sale' },
   { id: 22, articleKey: '55-333-464', rating: 5, reviews: 58,  badge: 'sale' },
   { id: 23, articleKey: '28718',      rating: 5, reviews: 81,  badge: 'sale' },
   { id: 24, articleKey: '28719',      rating: 4, reviews: 104, badge: 'sale' },
   { id: 25, articleKey: '28729',      rating: 5, reviews: 127, badge: 'sale' },
   { id: 26, articleKey: '55-333-374', rating: 5, reviews: 30,  badge: 'sale' },
   { id: 27, articleKey: '55-333-400', rating: 4, reviews: 53,  badge: 'sale' },
   { id: 28, articleKey: '55-333-410', rating: 5, reviews: 76,  badge: 'sale' },
   { id: 29, articleKey: '55-333-418', rating: 5, reviews: 99,  badge: 'sale' },
   { id: 30, articleKey: '55-333-635', rating: 4, reviews: 122, badge: 'sale' },
   { id: 31, articleKey: '55-333-562', rating: 5, reviews: 25,  badge: 'sale' },
   { id: 32, articleKey: '28252',      rating: 5, reviews: 48,  badge: 'sale' },
   { id: 33, articleKey: '55-333-676', rating: 4, reviews: 71,  badge: 'sale' },
   { id: 34, articleKey: '55-333-351', rating: 5, reviews: 94,  badge: 'sale' },
   { id: 35, articleKey: '55-333-524', rating: 5, reviews: 117, badge: 'sale' },
   { id: 36, articleKey: 'кераміка_1', rating: 4, reviews: 20,  badge: 'sale' },
   { id: 37, articleKey: 'кераміка_2', rating: 5, reviews: 43,  badge: 'sale' },
];

type PriceRow = { price: number; oldPrice: number; priceLei: number; oldPriceLei: number };

function loadCsvPrices(): Map<string, PriceRow> {
   const csvPath = path.join(process.cwd(), 'products', 'Text_content_translated.csv');
   const content = fs.readFileSync(csvPath, 'utf-8').replace(/^﻿/, '');
   const prices = new Map<string, PriceRow>();
   for (const line of content.split('\n').slice(1)) {
      if (!line.trim()) continue;
      const parts = line.split(',');
      const lang = parts[0]?.trim();
      const article = parts[2]?.trim();
      const price    = parseInt(parts[3]?.trim() ?? '', 10);
      const oldPrice = parseInt(parts[4]?.trim() ?? '', 10);
      const priceLei    = parseInt(parts[5]?.trim() ?? '', 10);
      const oldPriceLei = parseInt(parts[6]?.trim() ?? '', 10);
      if (lang === 'uk' && article && !isNaN(price) && price > 0) {
         prices.set(article, { price, oldPrice, priceLei, oldPriceLei });
      }
   }
   return prices;
}

const csvPrices = loadCsvPrices();
const reviewCounts = loadAllReviewCounts();
const avgRatings = loadAverageRatings();

export const PRODUCT_DATA: ProductData[] = STATIC_META.map(meta => {
   const row = csvPrices.get(meta.articleKey);
   return {
      ...meta,
      categoryKey: categoryKeyFor(meta.articleKey),
      price:       row?.price       ?? 0,
      oldPrice:    row?.oldPrice    ?? 0,
      priceLei:    row?.priceLei    ?? 0,
      oldPriceLei: row?.oldPriceLei ?? 0,
      reviews: reviewCounts.get(meta.articleKey) ?? meta.reviews,
      rating:  avgRatings.get(meta.articleKey)   ?? meta.rating,
   };
});

export function getProductById(id: number): ProductData | null {
   return PRODUCT_DATA.find(p => p.id === id) ?? null;
}

export function getProductImagePath(articleKey: string): string {
   const slug = articleKey
      .replace('кераміка_1', 'keramika_1')
      .replace('кераміка_2', 'keramika_2');
   return `/products/${slug}.webp`;
}
