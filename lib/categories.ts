import fs from 'fs';
import path from 'path';

const SUFFIX_RE = /(_(?:\d+|під|под))\.?$/;

function articleKeyFromFilename(filename: string): string {
  const stem = filename.replace(/\.\.?(?:png|jpe?g|webp)$/i, '');
  return stem.replace(SUFFIX_RE, '');
}

function parseCategories(): { pots: string[]; pans: string[]; other: string[]; knives: string[] } {
  const csvPath = path.join(process.cwd(), 'products/velmora_categories.csv');
  const text = fs.readFileSync(csvPath, 'utf-8');
  const rows = text.trim().split('\n').slice(1);

  const pots = new Set<string>();
  const pans = new Set<string>();
  const other = new Set<string>();
  const knives = new Set<string>();

  for (const row of rows) {
    const cells = row.split(',');
    if (cells[0]?.trim()) pots.add(articleKeyFromFilename(cells[0].trim()));
    if (cells[1]?.trim()) pans.add(articleKeyFromFilename(cells[1].trim()));
    if (cells[2]?.trim()) other.add(articleKeyFromFilename(cells[2].trim()));
    if (cells[3]?.trim()) knives.add(articleKeyFromFilename(cells[3].trim()));
  }

  return { pots: [...pots], pans: [...pans], other: [...other], knives: [...knives] };
}

export const { pots: POT_ARTICLE_KEYS, pans: PAN_ARTICLE_KEYS, other: OTHER_ARTICLE_KEYS, knives: KNIFE_ARTICLE_KEYS } = parseCategories();
