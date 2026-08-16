/**
 * Copy Vite dist/ into the Apache-served frontend root.
 * Keeps assets/fonts and assets/image; prunes stale hashed Vite bundles.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const assetsDir = path.join(root, 'assets');

const PRESERVE_ASSET_DIRS = new Set(['fonts', 'image']);

function fail(message) {
  console.error(`[publish-dist] ${message}`);
  process.exit(1);
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

if (!fs.existsSync(dist)) {
  fail(`Missing ${dist}. Run vite build first.`);
}

const distIndex = path.join(dist, 'index.html');
if (!fs.existsSync(distIndex)) {
  fail('dist/index.html not found.');
}

fs.copyFileSync(distIndex, path.join(root, 'index.html'));
console.log('[publish-dist] Wrote index.html');

const distAssets = path.join(dist, 'assets');
const newAssetNames = new Set();

if (fs.existsSync(distAssets)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  for (const entry of listFiles(distAssets)) {
    if (!entry.isFile()) continue;
    newAssetNames.add(entry.name);
    copyFile(path.join(distAssets, entry.name), path.join(assetsDir, entry.name));
  }
  console.log(`[publish-dist] Copied ${newAssetNames.size} file(s) into assets/`);
}

// Prune stale Vite-hashed bundles at assets/ root (not fonts/image).
for (const entry of listFiles(assetsDir)) {
  if (entry.isDirectory()) {
    if (!PRESERVE_ASSET_DIRS.has(entry.name)) {
      // Leave unknown dirs alone.
    }
    continue;
  }
  if (!entry.isFile()) continue;
  if (newAssetNames.has(entry.name)) continue;

  const name = entry.name;
  // Typical Vite outputs: index-AbCdEf12.js, index-AbCdEf12.css, etc.
  const looksHashed =
    /\.(js|css|map)$/i.test(name) &&
    (/-[A-Za-z0-9_-]{6,}\.(js|css|map)$/i.test(name) || /^index-.*\.(js|css)$/i.test(name));

  if (looksHashed) {
    fs.unlinkSync(path.join(assetsDir, name));
    console.log(`[publish-dist] Removed stale ${name}`);
  }
}

// Root static files emitted by Vite (from public/ or build).
for (const entry of listFiles(dist)) {
  if (!entry.isFile()) continue;
  if (entry.name === 'index.html') continue;
  copyFile(path.join(dist, entry.name), path.join(root, entry.name));
  console.log(`[publish-dist] Wrote ${entry.name}`);
}

console.log('[publish-dist] Done.');
