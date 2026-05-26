import fs from 'fs';
import path from 'path';
import { LOCALE } from './i18n';

function toSlug(articleKey: string): string {
   return articleKey
      .replace('кераміка_1', 'keramika_1')
      .replace('кераміка_2', 'keramika_2');
}

export function getProductImages(articleKey: string, categoryKey?: string): string[] {
   const slug = toSlug(articleKey);
   const dir = path.join(process.cwd(), 'public', 'products');

   let files: string[];
   try {
      files = fs.readdirSync(dir);
   } catch {
      return [`/products/${slug}.webp`];
   }

   const matched = files.filter(f => {
      if (!f.toLowerCase().endsWith('.webp')) return false;
      const stem = f.slice(0, -5);
      return stem === slug || stem.startsWith(slug + '_');
   });

   const hasMain = matched.some(f => f.slice(0, -5) === slug);

   const sorted = matched
      .sort((a, b) => {
         const suffixOf = (f: string) => f.slice(0, -5).slice(slug.length);
         const order = (s: string) => {
            if (s === '') return 0;
            if (s === '_під' && !hasMain) return 0;
            const num = s.match(/^_(\d+)$/);
            if (num) return parseInt(num[1], 10);
            return 999;
         };
         return order(suffixOf(a)) - order(suffixOf(b));
      })
      .map(f => `/products/${f}`);

   const result = sorted.length > 0 ? sorted : [`/products/${slug}.webp`];

   if (categoryKey === 'pans') {
      const pansDir = path.join(process.cwd(), 'public', 'products', 'pans-main');
      let pansFiles: string[];
      try {
         pansFiles = fs.readdirSync(pansDir);
      } catch {
         pansFiles = [];
      }
      const localeImages = pansFiles
         .filter(f => f.endsWith('.webp') && f.replace(/_\d+\.webp$/, '.webp') === `${LOCALE}.webp`)
         .sort((a, b) => {
            const numA = a.match(/_(\d+)\.webp$/)?.[1];
            const numB = b.match(/_(\d+)\.webp$/)?.[1];
            return (numA ? parseInt(numA) : 0) - (numB ? parseInt(numB) : 0);
         })
         .map(f => `/products/pans-main/${f}`);
      result.push(...localeImages);
   }

   return result;
}
