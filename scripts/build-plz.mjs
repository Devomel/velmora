/**
 * Builds the German PLZ → city lookup used by checkout to fill in "Stadt".
 * Source: GeoNames postal codes (CC BY 4.0, credited on the checkout page).
 *
 *   curl -O https://download.geonames.org/export/zip/DE.zip && unzip DE.zip DE.txt
 *   node scripts/build-plz.mjs DE.txt
 *
 * Output: public/plz-de.json — { "10115": "Berlin", "99998": ["Körner", "Mühlhausen/Thüringen"] }
 * A string means one town per PLZ (filled in automatically), an array means
 * several (offered as suggestions).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/plz-de.json');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/build-plz.mjs <path to GeoNames DE.txt>');
  process.exit(1);
}

// "Berlin, Stadt" / "Kreisfreie Stadt Dresden" / "Hamburg, Freie und Hansestadt" → city name
function cityFromDistrict(admin3) {
  return admin3
    .replace(/^Kreisfreie Stadt /, '')
    .replace(/, (Stadt|Freie und Hansestadt|Freie Hansestadt)$/, '');
}

const byPlz = new Map();
for (const line of fs.readFileSync(src, 'utf8').split('\n')) {
  const f = line.split('\t');
  if (f.length < 12) continue;
  const [, plz, place, , , , , admin3, , , , accuracy] = f;
  // Rows without accuracy are company PLZ (Großkunden) and sub-districts, not delivery towns
  if (!accuracy) continue;
  // "Berlin Kreuzberg" → "Berlin": DHL expects the city, not the district
  const city = cityFromDistrict(admin3);
  const name = place.startsWith(`${city} `) ? city : place;
  if (!byPlz.has(plz)) byPlz.set(plz, new Set());
  byPlz.get(plz).add(name);
}

const out = {};
for (const plz of [...byPlz.keys()].sort()) {
  const names = [...byPlz.get(plz)].sort((a, b) => a.localeCompare(b, 'de'));
  out[plz] = names.length === 1 ? names[0] : names;
}

fs.writeFileSync(OUT, JSON.stringify(out));
const multi = Object.values(out).filter(v => Array.isArray(v)).length;
console.log(`✓ ${Object.keys(out).length} PLZ (${multi} with several towns) → ${path.relative(ROOT, OUT)}`);
