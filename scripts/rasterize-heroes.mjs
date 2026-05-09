#!/usr/bin/env node
// Rasterize blog hero SVGs to 1200x630 JPG for Google Image Search + social fallbacks.
// Idempotent: skips JPGs newer than their source SVG.
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'blog');
const dirs = await readdir(root, { withFileTypes: true });
let made = 0, skipped = 0;
for (const d of dirs) {
  if (!d.isDirectory()) continue;
  const svg = join(root, d.name, 'hero.svg');
  const jpg = join(root, d.name, 'hero.jpg');
  if (!existsSync(svg)) continue;
  if (existsSync(jpg)) {
    const [s, j] = await Promise.all([stat(svg), stat(jpg)]);
    if (j.mtimeMs >= s.mtimeMs) { skipped++; continue; }
  }
  await sharp(svg, { density: 192 })
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(jpg);
  made++;
  console.log('rasterized', d.name);
}
console.log(`done: ${made} created, ${skipped} up-to-date`);
