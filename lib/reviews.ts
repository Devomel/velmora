import fs from 'fs';
import path from 'path';
import { LOCALE } from './i18n';

export type Review = {
  author: string;
  rating: number;
  date: string;
  text: string;
};

function readReviewsFile(): Record<string, Review[]> {
  try {
    const filePath = path.join(process.cwd(), 'locales', LOCALE, 'reviews.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

export function getProductReviews(articleKey: string): Review[] {
  return readReviewsFile()[articleKey] ?? [];
}

export function loadAllReviewCounts(): Map<string, number> {
  const data = readReviewsFile();
  return new Map(Object.entries(data).map(([key, arr]) => [key, arr.length]));
}

export function loadAverageRatings(): Map<string, number> {
  const data = readReviewsFile();
  return new Map(
    Object.entries(data)
      .filter(([, arr]) => arr.length > 0)
      .map(([key, arr]) => [
        key,
        Math.round(arr.reduce((s, r) => s + r.rating, 0) / arr.length * 10) / 10,
      ])
  );
}
