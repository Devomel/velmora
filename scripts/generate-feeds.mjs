/**
 * Generates Meta/Facebook product feed (RSS 2.0 + Google Shopping namespace)
 * per subdomain. Run: node scripts/generate-feeds.mjs
 *
 * Output: public/feeds/{locale}.xml
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

// ── Subdomain → locale + domain config ───────────────────────────────────
// `locale` refers to the locales/{locale}/home.json translation file
const FEEDS = {
  de: { domain: 'https://de.cookware-market.com', locale: 'de', currency: 'EUR', useLei: false },
  at: { domain: 'https://at.cookware-market.com', locale: 'de', currency: 'EUR', useLei: false },
  no: { domain: 'https://no.cookware-market.com', locale: 'no', currency: 'EUR', useLei: false },
  ro: { domain: 'https://ro.cookware-market.com', locale: 'ro', currency: 'RON', useLei: true  },
  eu: { domain: 'https://eu.cookware-market.com', locale: 'ru', currency: 'EUR', useLei: false },
};

// ── Product article keys in order (matches home.json catalog.products[]) ──
const ARTICLE_KEYS = [
  '55-333-477', '55-333-527', '28546',      '55-333-675', '55-333-644',
  '28473',      '28567',      '55-333-554', '28460',      '55-333-535',
  '28480',      '55-333-419', '55-333-462', '28827',      '55-333-641',
  '55-333-571', '55-333-387', '28483',      '55-333-621', '28471',
  '28528',      '55-333-464', '28718',      '28719',      '28729',
  '55-333-374', '55-333-400', '55-333-410', '55-333-418', '55-333-635',
  '55-333-562', '28252',      '55-333-676', '55-333-351', '55-333-524',
  'кераміка_1', 'кераміка_2',
];

// ── Load prices from CSV ───────────────────────────────────────────────────
function loadPrices() {
  const csvPath = path.join(ROOT, 'products', 'Text_content_translated.csv');
  const lines = fs.readFileSync(csvPath, 'utf-8').replace(/^﻿/, '').split('\n');
  const prices = new Map(); // articleKey → { price, oldPrice, priceLei, oldPriceLei }

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const parts = line.split(',');
    const lang       = parts[0]?.trim();
    const article    = parts[2]?.trim();
    const price      = parseInt(parts[3]?.trim() ?? '', 10);
    const oldPrice   = parseInt(parts[4]?.trim() ?? '', 10);
    const priceLei   = parseInt(parts[5]?.trim() ?? '', 10);
    const oldPriceLei = parseInt(parts[6]?.trim() ?? '', 10);
    if (lang === 'uk' && article && !isNaN(price) && price > 0) {
      prices.set(article, { price, oldPrice, priceLei, oldPriceLei });
    }
  }
  return prices;
}

// ── Resolve image filename (Cyrillic → Latin) ─────────────────────────────
function imageSlug(articleKey) {
  return articleKey
    .replace('кераміка_1', 'keramika_1')
    .replace('кераміка_2', 'keramika_2');
}

// ── XML escape ────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Generate one feed ─────────────────────────────────────────────────────
function generateFeed(subdomain, config, prices) {
  const home = require(path.join(ROOT, 'locales', config.locale, 'home.json'));
  const products = home.catalog.products; // array of 37, same order as ARTICLE_KEYS

  const items = ARTICLE_KEYS.map((articleKey, i) => {
    const product  = products[i];
    const priceRow = prices.get(articleKey) ?? { price: 0, oldPrice: 0, priceLei: 0, oldPriceLei: 0 };

    const currentPrice = config.useLei ? priceRow.priceLei   : priceRow.price;
    const originalPrice = config.useLei ? priceRow.oldPriceLei : priceRow.oldPrice;
    const currency = config.currency;
    const productId = i + 1; // matches route /product/[id]/

    const slug   = imageSlug(articleKey);
    const imgUrl = `${config.domain}/products/${slug}.webp`;
    const link   = `${config.domain}/product/${productId}/`;

    const description = [product.description, ...(product.features ?? [])].join('. ');

    const lines = [
      `    <item>`,
      `      <g:id>${esc(articleKey)}</g:id>`,
      `      <g:title>${esc(product.name)}</g:title>`,
      `      <g:description>${esc(description)}</g:description>`,
      `      <g:link>${esc(link)}</g:link>`,
      `      <g:image_link>${esc(imgUrl)}</g:image_link>`,
      `      <g:condition>new</g:condition>`,
      `      <g:availability>in stock</g:availability>`,
      `      <g:price>${currentPrice}.00 ${currency}</g:price>`,
    ];

    if (originalPrice > currentPrice) {
      lines.push(`      <g:sale_price>${currentPrice}.00 ${currency}</g:sale_price>`);
      lines.push(`      <g:original_price>${originalPrice}.00 ${currency}</g:original_price>`);
    }

    lines.push(`      <g:brand>Velmora</g:brand>`);
    lines.push(`      <g:mpn>${esc(articleKey)}</g:mpn>`);
    lines.push(`      <g:google_product_category>638</g:google_product_category>`); // Cookware
    lines.push(`    </item>`);

    return lines.join('\n');
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
    `  <channel>`,
    `    <title>Velmora Cookware – ${subdomain.toUpperCase()}</title>`,
    `    <link>${config.domain}/</link>`,
    `    <description>Velmora cookware catalog</description>`,
    ...items,
    `  </channel>`,
    `</rss>`,
  ].join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────
const outDir = path.join(ROOT, 'public', 'feeds');
fs.mkdirSync(outDir, { recursive: true });

const prices = loadPrices();

for (const [subdomain, config] of Object.entries(FEEDS)) {
  const xml = generateFeed(subdomain, config, prices);
  const outPath = path.join(outDir, `${subdomain}.xml`);
  fs.writeFileSync(outPath, xml, 'utf-8');
  console.log(`✓  ${subdomain}  →  public/feeds/${subdomain}.xml  (locale: ${config.locale}, ${xml.length} bytes)`);
}
