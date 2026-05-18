export type ProductData = {
   id: number;
   articleKey: string;
   price: number;
   oldPrice?: number;
   rating: number;
   reviews: number;
   badge?: 'sale' | 'new';
   categoryKey: string;
};

export const PRODUCT_DATA: ProductData[] = [
   { id: 1, articleKey: '55-333-477', price: 1531, oldPrice: 1914, rating: 5, reviews: 55, badge: 'sale', categoryKey: 'pans' },
   { id: 2, articleKey: '55-333-527', price: 1123, oldPrice: 1404, rating: 5, reviews: 78, badge: 'sale', categoryKey: 'pans' },
   { id: 3, articleKey: '28546', price: 2417, oldPrice: 3022, rating: 4, reviews: 101, badge: 'sale', categoryKey: 'pans' },
   { id: 4, articleKey: '55-333-675', price: 2699, oldPrice: 3374, rating: 5, reviews: 124, badge: 'sale', categoryKey: 'pots' },
   { id: 5, articleKey: '55-333-644', price: 5477, oldPrice: 6847, rating: 5, reviews: 27, badge: 'sale', categoryKey: 'pots' },
   { id: 6, articleKey: '28473', price: 3381, oldPrice: 4227, rating: 4, reviews: 50, badge: 'sale', categoryKey: 'pots' },
   { id: 7, articleKey: '28567', price: 3631, oldPrice: 4539, rating: 5, reviews: 73, badge: 'sale', categoryKey: 'pots' },
   { id: 8, articleKey: '55-333-554', price: 4365, oldPrice: 5457, rating: 5, reviews: 96, badge: 'sale', categoryKey: 'pots' },
   { id: 9, articleKey: '28460', price: 6712, oldPrice: 8390, rating: 4, reviews: 119, badge: 'sale', categoryKey: 'pots' },
   { id: 10, articleKey: '55-333-535', price: 1958, oldPrice: 2448, rating: 5, reviews: 22, badge: 'sale', categoryKey: 'pots' },
   { id: 11, articleKey: '28480', price: 1156, oldPrice: 1445, rating: 5, reviews: 45, badge: 'sale', categoryKey: 'pots' },
   { id: 12, articleKey: '55-333-419', price: 2535, oldPrice: 3169, rating: 4, reviews: 68, badge: 'sale', categoryKey: 'pots' },
   { id: 13, articleKey: '55-333-462', price: 4630, oldPrice: 5788, rating: 5, reviews: 91, badge: 'sale', categoryKey: 'pots' },
   { id: 14, articleKey: '28827', price: 1486, oldPrice: 1858, rating: 5, reviews: 114, badge: 'sale', categoryKey: 'pots' },
   { id: 15, articleKey: '55-333-641', price: 2642, oldPrice: 3303, rating: 4, reviews: 17, badge: 'sale', categoryKey: 'pots' },
   { id: 16, articleKey: '55-333-571', price: 2421, oldPrice: 3027, rating: 5, reviews: 40, badge: 'sale', categoryKey: 'pots' },
   { id: 17, articleKey: '55-333-387', price: 2012, oldPrice: 2515, rating: 5, reviews: 63, badge: 'sale', categoryKey: 'pots' },
   { id: 18, articleKey: '28483', price: 2104, oldPrice: 2630, rating: 4, reviews: 86, badge: 'sale', categoryKey: 'pots' },
   { id: 19, articleKey: '55-333-621', price: 4024, oldPrice: 5030, rating: 5, reviews: 109, badge: 'sale', categoryKey: 'pots' },
   { id: 20, articleKey: '28471', price: 2035, oldPrice: 2544, rating: 5, reviews: 132, badge: 'sale', categoryKey: 'pots' },
   { id: 21, articleKey: '28528', price: 1677, oldPrice: 2097, rating: 4, reviews: 35, badge: 'sale', categoryKey: 'pots' },
   { id: 22, articleKey: '55-333-464', price: 3439, oldPrice: 4299, rating: 5, reviews: 58, badge: 'sale', categoryKey: 'pots' },
   { id: 23, articleKey: '28718', price: 6203, oldPrice: 7754, rating: 5, reviews: 81, badge: 'sale', categoryKey: 'pots' },
   { id: 24, articleKey: '28719', price: 5233, oldPrice: 6542, rating: 4, reviews: 104, badge: 'sale', categoryKey: 'pots' },
   { id: 25, articleKey: '28729', price: 2015, oldPrice: 2519, rating: 5, reviews: 127, badge: 'sale', categoryKey: 'pots' },
   { id: 26, articleKey: '55-333-374', price: 1990, oldPrice: 2488, rating: 5, reviews: 30, badge: 'sale', categoryKey: 'pots' },
   { id: 27, articleKey: '55-333-400', price: 2323, oldPrice: 2904, rating: 4, reviews: 53, badge: 'sale', categoryKey: 'pots' },
   { id: 28, articleKey: '55-333-410', price: 2506, oldPrice: 3133, rating: 5, reviews: 76, badge: 'sale', categoryKey: 'accessories' },
   { id: 29, articleKey: '55-333-418', price: 2365, oldPrice: 2957, rating: 5, reviews: 99, badge: 'sale', categoryKey: 'accessories' },
   { id: 30, articleKey: '55-333-635', price: 3097, oldPrice: 3872, rating: 4, reviews: 122, badge: 'sale', categoryKey: 'accessories' },
   { id: 31, articleKey: '55-333-562', price: 2345, oldPrice: 2932, rating: 5, reviews: 25, badge: 'sale', categoryKey: 'accessories' },
   { id: 32, articleKey: '28252', price: 3273, oldPrice: 4092, rating: 5, reviews: 48, badge: 'sale', categoryKey: 'accessories' },
   { id: 33, articleKey: '55-333-676', price: 1499, oldPrice: 1874, rating: 4, reviews: 71, badge: 'sale', categoryKey: 'accessories' },
   { id: 34, articleKey: '55-333-351', price: 1575, oldPrice: 1969, rating: 5, reviews: 94, badge: 'sale', categoryKey: 'accessories' },
   { id: 35, articleKey: '55-333-524', price: 1500, oldPrice: 1875, rating: 5, reviews: 117, badge: 'sale', categoryKey: 'accessories' },
   { id: 36, articleKey: 'кераміка_1', price: 2999, oldPrice: 3749, rating: 4, reviews: 20, badge: 'sale', categoryKey: 'sets' },
   { id: 37, articleKey: 'кераміка_2', price: 2999, oldPrice: 3749, rating: 5, reviews: 43, badge: 'sale', categoryKey: 'sets' },
];

export function getProductById(id: number): ProductData | null {
   return PRODUCT_DATA.find(p => p.id === id) ?? null;
}

export function getProductImagePath(articleKey: string): string {
   const slug = articleKey
      .replace('кераміка_1', 'keramika_1')
      .replace('кераміка_2', 'keramika_2');
   return `/products/${slug}.webp`;
}
