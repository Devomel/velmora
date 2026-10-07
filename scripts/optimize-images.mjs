import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'products/photos';
const DEST = 'public/products';

const RENAMES = [
  [/^кераміка_1_[а-яіїєА-ЯІЇЄ]+/, 'keramika_1'],
  [/^кераміка_2_[а-яіїєА-ЯІЇЄ]+/, 'keramika_2'],
  [/^кераміка_1/, 'keramika_1'],
  [/^кераміка_2/, 'keramika_2'],
];

function toSlug(stem) {
  let s = stem;
  for (const [pattern, replacement] of RENAMES) {
    s = s.replace(pattern, replacement);
  }
  return s;
}

const FORCE = process.argv.includes('--force');

fs.mkdirSync(DEST, { recursive: true });

const entries = fs.readdirSync(SRC, { withFileTypes: true });
const images = entries.filter(e => e.isFile() && /\.(png|jpe?g)$/i.test(e.name));

let converted = 0;
let skipped = 0;

for (const entry of images) {
  const srcPath = path.join(SRC, entry.name);
  const stem = entry.name.replace(/\.[^.]+$/, '');
  const destPath = path.join(DEST, toSlug(stem) + '.webp');

  const srcStat = fs.statSync(srcPath);
  const destStat = fs.existsSync(destPath) ? fs.statSync(destPath) : null;

  if (!FORCE && destStat && destStat.mtimeMs > srcStat.mtimeMs) {
    skipped++;
    continue;
  }

  await sharp(srcPath)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destPath);

  converted++;
}

console.log(`optimize-images: converted ${converted}, skipped ${skipped} (up to date)`);

// ---- Category images from velmora_categories.csv ----
const CSV_PATH = 'products/velmora_categories.csv';
const CATEGORY_SOURCES = [
  'products/photos/основні для каструль/каструлі_2.png',  // col 0 — каструлі
  'products/photos/основні для сковорідок/ск_2.png',       // col 1 — пательні
];

function articleKeyFromFilename(filename) {
  const stem = filename.replace(/\.\.?(?:png|jpe?g)$/i, '');
  return stem.replace(/_(?:\d+|під|под)$/, '');
}

if (fs.existsSync(CSV_PATH)) {
  const csvStat = fs.statSync(CSV_PATH);
  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = csvText.trim().split('\n').slice(1); // skip header row

  const keysByCol = [new Set(), new Set()];

  for (const row of rows) {
    const cells = row.split(',');
    for (const colIdx of [0, 1]) {
      const cell = (cells[colIdx] ?? '').trim();
      if (cell) keysByCol[colIdx].add(toSlug(articleKeyFromFilename(cell)));
    }
  }

  let catConverted = 0, catSkipped = 0;

  for (let colIdx = 0; colIdx < 2; colIdx++) {
    const srcPath = CATEGORY_SOURCES[colIdx];
    if (!fs.existsSync(srcPath)) continue;
    const srcMtime = Math.max(fs.statSync(srcPath).mtimeMs, csvStat.mtimeMs);

    for (const key of keysByCol[colIdx]) {
      const destPath = path.join(DEST, `${key}_4.webp`);
      const destStat = fs.existsSync(destPath) ? fs.statSync(destPath) : null;

      if (!FORCE && destStat && destStat.mtimeMs > srcMtime) { catSkipped++; continue; }

      await sharp(srcPath)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(destPath);

      catConverted++;
    }
  }

  console.log(`category-images: converted ${catConverted}, skipped ${catSkipped} (up to date)`);
}

// ---- Small copies for catalog cards, thumbnails and cart (see lib/image-variants.ts) ----
// Cards are ~170px wide on phones, so 480px covers 3x screens at a quarter of the bytes
const SMALL_DEST = path.join(DEST, 'sm');
const SMALL_SIZE = 480;

function listWebp(dir, rel = '') {
  return fs.readdirSync(path.join(dir, rel), { withFileTypes: true }).flatMap(e => {
    const relPath = path.join(rel, e.name);
    if (e.isDirectory()) return relPath === 'sm' ? [] : listWebp(dir, relPath);
    return e.name.endsWith('.webp') ? [relPath] : [];
  });
}

let smConverted = 0, smSkipped = 0;

for (const rel of listWebp(DEST)) {
  const srcPath = path.join(DEST, rel);
  const destPath = path.join(SMALL_DEST, rel);
  const destStat = fs.existsSync(destPath) ? fs.statSync(destPath) : null;

  if (!FORCE && destStat && destStat.mtimeMs > fs.statSync(srcPath).mtimeMs) { smSkipped++; continue; }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  await sharp(srcPath)
    .resize(SMALL_SIZE, SMALL_SIZE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(destPath);

  smConverted++;
}

console.log(`small-images: converted ${smConverted}, skipped ${smSkipped} (up to date)`);

// ---- Hero banner: WebP instead of a 1 MB PNG ----
const HERO_SRC = 'public/hero-banner.png';
const HERO_DEST = 'public/hero-banner.webp';

if (fs.existsSync(HERO_SRC)) {
  const heroStat = fs.existsSync(HERO_DEST) ? fs.statSync(HERO_DEST) : null;
  if (FORCE || !heroStat || heroStat.mtimeMs <= fs.statSync(HERO_SRC).mtimeMs) {
    await sharp(HERO_SRC).webp({ quality: 82 }).toFile(HERO_DEST);
    console.log('hero-banner: converted');
  }
}
