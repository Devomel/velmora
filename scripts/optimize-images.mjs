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
