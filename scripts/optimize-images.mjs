import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'products/photos';
const DEST = 'public/products';

const RENAMES = [
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

  if (destStat && destStat.mtimeMs > srcStat.mtimeMs) {
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

      if (destStat && destStat.mtimeMs > srcMtime) { catSkipped++; continue; }

      await sharp(srcPath)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(destPath);

      catConverted++;
    }
  }

  console.log(`category-images: converted ${catConverted}, skipped ${catSkipped} (up to date)`);
}
