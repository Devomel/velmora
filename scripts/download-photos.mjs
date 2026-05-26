/**
 * Downloads product photos from Google Drive into products/photos/.
 *
 * Google Drive folder structure expected:
 *   <root folder>
 *     └── <article>/          ← subfolder named by article number
 *           ├── <article>.png          ← main photo (kept as-is)
 *           ├── <article>_під.png      ← underside photo (kept as-is)
 *           └── anything-else.png     ← renamed to <article>_2.png, _3.png, …
 *
 * Drive is always the source of truth — existing local files are replaced when
 * the Drive folder changes (tracked via modifiedTime cache).
 *
 * Required env vars:
 *   GOOGLE_DRIVE_FOLDER_ID       — ID of the root Drive folder
 *
 * Auth (one of, checked in order):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — full service-account JSON as a string (CI/secrets)
 *   GOOGLE_SERVICE_ACCOUNT_KEY   — path to JSON file (default: google-service-account.json)
 *
 * Flags:
 *   --force   Ignore cache and re-download everything
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

// Load .env.local if present (prebuild/predev runs outside Next.js)
if (fs.existsSync('.env.local')) {
   for (const line of fs.readFileSync('.env.local', 'utf-8').split('\n')) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m) process.env[m[1].trim()] ??= m[2].trim();
   }
}

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const DEST_DIR = 'products/photos';
const CACHE_FILE = 'products/.drive-photo-cache.json';
const FORCE = process.argv.includes('--force');

if (!ROOT_FOLDER_ID) {
   console.log('download-photos: GOOGLE_DRIVE_FOLDER_ID not set — skipping.');
   process.exit(0);
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function buildAuth() {
   if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return new google.auth.GoogleAuth({
         credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
         scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });
   }
   return new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ?? 'google-service-account.json',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
   });
}

const drive = google.drive({ version: 'v3', auth: buildAuth() });

// ── Cache ─────────────────────────────────────────────────────────────────────
function loadCache() {
   try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')); } catch { return {}; }
}
function saveCache(cache) {
   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// ── Drive helpers ─────────────────────────────────────────────────────────────
const MAIN_SUFFIXES = ['_под'];

function isMainStem(stem, article) {
   if (stem === article) return true;
   return MAIN_SUFFIXES.some(s => stem === article + s);
}

async function listChildren(parentId, mimeTypeFilter) {
   const all = [];
   let pageToken;
   do {
      const q = mimeTypeFilter
         ? `'${parentId}' in parents and mimeType = '${mimeTypeFilter}' and trashed = false`
         : `'${parentId}' in parents and trashed = false`;
      const res = await drive.files.list({
         q,
         fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
         pageSize: 1000,
         pageToken,
      });
      all.push(...(res.data.files ?? []));
      pageToken = res.data.nextPageToken;
   } while (pageToken);
   return all;
}

async function downloadFile(fileId, destPath) {
   const res = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
   );
   await pipeline(res.data, fs.createWriteStream(destPath));
}

// ── Core logic ────────────────────────────────────────────────────────────────
function deleteExistingArticleFiles(article) {
   const entries = fs.readdirSync(DEST_DIR, { withFileTypes: true });
   const files = entries.filter(e => {
      if (!e.isFile()) return false;
      const stem = e.name.replace(/\.[^.]+$/, '');
      return stem === article || stem.startsWith(article + '_');
   });
   for (const e of files) fs.rmSync(path.join(DEST_DIR, e.name));
   return files.length;
}

async function processProductFolder(folder, cache) {
   const article = folder.name;
   const cachedMtime = cache[folder.id];

   if (!FORCE && cachedMtime === folder.modifiedTime) {
      // Check that local files still exist
      const anyLocal = fs.readdirSync(DEST_DIR).some(f => {
         const stem = f.replace(/\.[^.]+$/, '');
         return stem === article || stem.startsWith(article + '_');
      });
      if (anyLocal) return { downloaded: 0, skipped: true };
   }

   deleteExistingArticleFiles(article);

   const files = await listChildren(folder.id);
   const images = files.filter(
      f => /\.(png|jpe?g|webp)$/i.test(f.name) || f.mimeType?.startsWith('image/'),
   );

   const mainPhotos = images.filter(img =>
      isMainStem(img.name.replace(/\.[^.]+$/, ''), article),
   );
   const otherPhotos = images.filter(
      img => !isMainStem(img.name.replace(/\.[^.]+$/, ''), article),
   );

   let downloaded = 0;

   for (const photo of mainPhotos) {
      const stem = photo.name.replace(/\.[^.]+$/, '');
      const ext = path.extname(photo.name);
      await downloadFile(photo.id, path.join(DEST_DIR, stem + ext));
      downloaded++;
   }

   let num = 2;
   for (const photo of otherPhotos) {
      const ext = path.extname(photo.name);
      await downloadFile(photo.id, path.join(DEST_DIR, `${article}_${num}${ext}`));
      downloaded++;
      num++;
   }

   cache[folder.id] = folder.modifiedTime;
   return { downloaded, skipped: false };
}

// ── Entry point ───────────────────────────────────────────────────────────────
fs.mkdirSync(DEST_DIR, { recursive: true });

const cache = FORCE ? {} : loadCache();

const folders = await listChildren(ROOT_FOLDER_ID, 'application/vnd.google-apps.folder');
console.log(`download-photos: found ${folders.length} product folders.`);

let totalDownloaded = 0;
let totalSkipped = 0;

for (const folder of folders) {
   const { downloaded, skipped } = await processProductFolder(folder, cache);
   if (downloaded > 0) console.log(`  ${folder.name}: downloaded ${downloaded} file(s)`);
   totalDownloaded += downloaded;
   totalSkipped += skipped ? 1 : 0;
}

saveCache(cache);

console.log(
   `download-photos: done — ${totalDownloaded} downloaded, ${totalSkipped} folders unchanged (cached).`,
);
