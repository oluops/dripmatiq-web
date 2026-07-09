#!/usr/bin/env node
// Generate Instagram Reel pack from Dripmatiq blog post.
// Output: reel.svg, reel-cover.jpg, feed.svg, feed.jpg, caption.md, reel-script.md, reel.json, reel.srt
// Usage: node scripts/generate-instagram-reel-pack.mjs --slug <slug>

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const BLOG_DIR = join(PROJECT_ROOT, 'src', 'content', 'blog');
const OUTPUT_ROOT = join(PROJECT_ROOT, 'public', 'instagram');

function parseArgs() {
  const args = process.argv.slice(2);
  const slugIdx = args.indexOf('--slug');
  if (slugIdx === -1 || slugIdx + 1 >= args.length) {
    console.error('Usage: node generate-instagram-reel-pack.mjs --slug <slug>');
    process.exit(1);
  }
  return args[slugIdx + 1];
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, body: content };
  const fm = match[1];
  const data = {};
  fm.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith('[') && value.endsWith(']')) {
      try { value = JSON.parse(value); } catch { }
    }
    data[key] = value;
  });
  const body = content.slice(match[0].length).trim();
  return { data, body };
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1).trim() + '…' : str;
}

function generateReelScript(frontmatter, body) {
  const title = frontmatter.title || 'Untitled';
  const excerpt = frontmatter.excerpt || '';
  const tags = frontmatter.tags || [];

  const hook = `Stop scrambling every morning. ${title} changes everything.`;
  const problem = 'You have a full closet but 7 AM panic is real. Weather? Meeting? Shoes still damp? You react instead of decide.';
  const solution = 'Plan once on Sunday. Match 7 outfits to real weather + calendar. Open app each morning → 30 seconds → dressed.';
  const steps = [
    'Log 30–50 core pieces in natural light',
    'Tag by temp, occasion, comfort, shoe type',
    'Build 5–7 reusable outfit formulas',
    'Sunday: check forecast + calendar → generate 7 looks + 2 backups',
    'Friday 5-min review: wore/loved/swapped/skipped → system gets smarter'
  ];
  const ai = 'AI is a retrieval engine. Tag well → prompt once → 7 weather-matched outfits in 30 seconds. Prompt template in the post.';
  const cta = 'Full workflow + prompt template at link in bio. Dripmatiq helps you log, plan, and dress without buying more.';

  return `# Reel Script: ${title}

## Hook (0–3s)
${hook}

## Problem (3–8s)
${problem}

## Solution (8–18s)
${solution}

## Steps (18–40s)
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## AI Accelerator (40–50s)
${ai}

## CTA (50–60s)
${cta}

---
Tags: ${tags.join(', ')}
Excerpt: ${excerpt}
`;
}

function generateCaption(frontmatter, body) {
  const title = frontmatter.title || 'Untitled';
  const slug = frontmatter.slug || '';
  const tags = frontmatter.tags || [];

  const hashtags = [
    '#ootd', '#fashion', '#style', '#outfitplanning', '#wardrobe',
    '#ai', '#styling', '#productivity', '#capsulewardrobe', '#dripmatiq'
  ].join(' ');

  const base = `Mornings don't have to be a style emergency. ${title}

Plan once on Sunday. Match 7 outfits to real weather + your actual calendar. Open the app each morning → 30 seconds → dressed. No scrolling. No trying on three things. No regret.

The system: log 30–50 core pieces → tag for daily decisions (temp, occasion, comfort, shoe type) → build reusable formulas → weekly plan in 10 min → Friday review makes next week smarter.

AI isn't magic — it's retrieval. When your closet is tagged, one prompt generates 7 weather-matched looks. Prompt template in the full post.

Full read → link in bio (dripmatiq.app/blog/${slug}?utm_source=instagram&utm_medium=social&utm_campaign=${slug})

${hashtags}`;

  return base.slice(0, 2200);
}

function generateReelSVG(frontmatter) {
  const title = frontmatter.title || 'Untitled';
  const lines = splitTitle(title, 38);
  const subtitle = 'Plan Once. Dress in Seconds.';

  const textLines = lines.map((line, i) => 
    `<text x="92" y="${360 + i * 84}" font-family="Georgia, Times New Roman, serif" font-size="68" font-weight="700" fill="#F7F4EC" letter-spacing="0.3">${escapeXml(line)}</text>`
  ).join('\n');

  const subtitleY = 360 + lines.length * 84 + 40;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" role="img" aria-label="Instagram Reel cover for Dripmatiq blog post">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070B14"/>
      <stop offset="55%" stop-color="#0B1324"/>
      <stop offset="100%" stop-color="#121D35"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="16%" r="75%">
      <stop offset="0%" stop-color="#4E3F1A" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F2D27A"/>
      <stop offset="100%" stop-color="#D4AF37"/>
    </linearGradient>
  </defs>

  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect width="1080" height="1920" fill="url(#glow)"/>

  <rect x="0" y="0" width="1080" height="16" fill="url(#goldline)"/>
  <rect x="0" y="1800" width="1080" height="120" fill="#0E111B" opacity="0.92"/>

  <text x="92" y="130" font-family="Georgia, Times New Roman, serif" font-size="34" font-weight="700" fill="#F2D27A" letter-spacing="3">DRIPMATIQ JOURNAL</text>
  <line x1="92" y1="162" x2="988" y2="162" stroke="url(#goldline)" stroke-width="3" stroke-linecap="round"/>

  ${textLines}

  <text x="92" y="${subtitleY}" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="700" fill="#F2D27A" letter-spacing="0.4">${escapeXml(subtitle)}</text>

  <text x="92" y="1868" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600" fill="#B8C0D8" letter-spacing="2.5">DRIPMATIQ.APP</text>
</svg>`;
}

function generateFeedSVG(frontmatter) {
  const title = frontmatter.title || 'Untitled';
  const lines = splitTitle(title, 34);
  const subtitle = 'Plan Once. Dress in Seconds.';

  const textLines = lines.map((line, i) => 
    `<text x="92" y="${250 + i * 72}" font-family="Georgia, Times New Roman, serif" font-size="60" font-weight="700" fill="#F7F4EC" letter-spacing="0.3">${escapeXml(line)}</text>`
  ).join('\n');

  const subtitleY = 250 + lines.length * 72 + 30;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-label="Instagram feed creative for Dripmatiq blog post">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070B14"/>
      <stop offset="55%" stop-color="#0B1324"/>
      <stop offset="100%" stop-color="#121D35"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="16%" r="75%">
      <stop offset="0%" stop-color="#4E3F1A" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F2D27A"/>
      <stop offset="100%" stop-color="#D4AF37"/>
    </linearGradient>
  </defs>

  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect width="1080" height="1350" fill="url(#glow)"/>

  <rect x="0" y="0" width="1080" height="16" fill="url(#goldline)"/>
  <rect x="0" y="1230" width="1080" height="120" fill="#0E111B" opacity="0.92"/>

  <text x="92" y="130" font-family="Georgia, Times New Roman, serif" font-size="34" font-weight="700" fill="#F2D27A" letter-spacing="3">DRIPMATIQ JOURNAL</text>
  <line x1="92" y1="162" x2="988" y2="162" stroke="url(#goldline)" stroke-width="3" stroke-linecap="round"/>

  ${textLines}

  <text x="92" y="${subtitleY}" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="700" fill="#F2D27A" letter-spacing="0.4">${escapeXml(subtitle)}</text>

  <text x="92" y="1298" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600" fill="#B8C0D8" letter-spacing="2.5">DRIPMATIQ.APP</text>
</svg>`;
}

function splitTitle(title, maxChars) {
  const words = title.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function escapeXml(str) {
  return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '&apos;');
}

function generateReelJSON(frontmatter) {
  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    pubDate: frontmatter.pubDate,
    author: frontmatter.author,
    tags: frontmatter.tags,
    duration: 60,
    aspectRatio: '9:16',
    format: 'reel',
    coverFile: 'reel-cover.jpg',
    videoFile: 'reel.mp4',
    captionFile: 'caption.md',
    scriptFile: 'reel-script.md',
    srtFile: 'reel.srt',
    feedFile: 'feed.jpg',
    generatedAt: new Date().toISOString()
  };
}

function generateSRT(frontmatter) {
  const title = frontmatter.title || 'Untitled';
  const hook = `Stop scrambling every morning. ${title} changes everything.`;
  const problem = 'You have a full closet but 7 AM panic is real. Weather? Meeting? Shoes still damp? You react instead of decide.';
  const solution = 'Plan once on Sunday. Match 7 outfits to real weather + calendar. Open app each morning → 30 seconds → dressed.';
  const steps = [
    'Log 30–50 core pieces in natural light',
    'Tag by temp, occasion, comfort, shoe type',
    'Build 5–7 reusable outfit formulas',
    'Sunday: check forecast + calendar → generate 7 looks + 2 backups',
    'Friday 5-min review: wore/loved/swapped/skipped → system gets smarter'
  ];
  const ai = 'AI is a retrieval engine. Tag well → prompt once → 7 weather-matched outfits in 30 seconds. Prompt template in the post.';
  const cta = 'Full workflow + prompt template at link in bio. Dripmatiq helps you log, plan, and dress without buying more.';

  const segments = [
    { start: 0, end: 3, text: hook },
    { start: 3, end: 8, text: problem },
    { start: 8, end: 18, text: solution },
    { start: 18, end: 40, text: steps.join(' ') },
    { start: 40, end: 50, text: ai },
    { start: 50, end: 60, text: cta }
  ];

  return segments.map((seg, i) => {
    const formatTime = (sec) => {
      const h = Math.floor(sec / 3600).toString().padStart(2, '0');
      const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      const ms = '000';
      return `${h}:${m}:${s},${ms}`;
    };
    return `${i + 1}\n${formatTime(seg.start)} --> ${formatTime(seg.end)}\n${seg.text}\n`;
  }).join('\n');
}

async function rasterizeSVG(svgPath, jpgPath, width, height) {
  await sharp(Buffer.from(await readFile(svgPath, 'utf8')), { density: 192 })
    .resize(width, height, { fit: 'cover' })
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(jpgPath);
}

async function createVideoFromImages(outputPath, imagePaths, duration = 60) {
  const filterComplex = imagePaths.map((_, i) => {
    const start = (i * duration) / imagePaths.length;
    const end = ((i + 1) * duration) / imagePaths.length;
    return `[${i}:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS[v${i}]`;
  }).join(';') + ';' +
  imagePaths.map((_, i) => `[v${i}]`).join('') + `concat=n=${imagePaths.length}:v=1:a=0[outv]`;

  const inputs = imagePaths.flatMap(p => ['-loop', '1', '-t', String(duration / imagePaths.length), '-i', p]).join(' ');

  try {
    await execFileAsync('ffmpeg', [
      '-y',
      ...imagePaths.flatMap(p => ['-loop', '1', '-t', String(duration / imagePaths.length), '-i', p]),
      '-filter_complex', filterComplex,
      '-map', '[outv]',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      outputPath
    ]);
    return true;
  } catch (e) {
    console.warn('ffmpeg failed, creating placeholder video:', e.message);
    return false;
  }
}

async function main() {
  const slug = parseArgs();
  const blogPath = join(BLOG_DIR, `${slug}.md`);

  let content;
  try {
    content = await readFile(blogPath, 'utf8');
  } catch {
    console.error(`Blog post not found: ${blogPath}`);
    process.exit(1);
  }

  const { data: frontmatter, body } = parseFrontmatter(content);
  if (!frontmatter.slug) frontmatter.slug = slug;

  const outputDir = join(OUTPUT_ROOT, slug);
  await mkdir(outputDir, { recursive: true });

  const reelSVGPath = join(outputDir, 'reel.svg');
  const feedSVGPath = join(outputDir, 'feed.svg');
  const reelCoverPath = join(outputDir, 'reel-cover.jpg');
  const feedJPGPath = join(outputDir, 'feed.jpg');
  const captionPath = join(outputDir, 'caption.md');
  const scriptPath = join(outputDir, 'reel-script.md');
  const jsonPath = join(outputDir, 'reel.json');
  const srtPath = join(outputDir, 'reel.srt');
  const videoPath = join(outputDir, 'reel.mp4');

  const reelSVG = generateReelSVG(frontmatter);
  const feedSVG = generateFeedSVG(frontmatter);
  const caption = generateCaption(frontmatter, body);
  const script = generateReelScript(frontmatter, body);
  const reelJSON = generateReelJSON(frontmatter);
  const srt = generateSRT(frontmatter);

  await Promise.all([
    writeFile(reelSVGPath, reelSVG),
    writeFile(feedSVGPath, feedSVG),
    writeFile(captionPath, caption),
    writeFile(scriptPath, script),
    writeFile(jsonPath, JSON.stringify(reelJSON, null, 2)),
    writeFile(srtPath, srt)
  ]);

  await Promise.all([
    rasterizeSVG(reelSVGPath, reelCoverPath, 1080, 1920),
    rasterizeSVG(feedSVGPath, feedJPGPath, 1080, 1350)
  ]);

  const videoCreated = await createVideoFromImages(videoPath, [reelCoverPath, feedJPGPath], 60);
  if (!videoCreated) {
    await execFileAsync('ffmpeg', [
      '-y', '-f', 'lavfi', '-i', 'color=c=black:s=1080x1920:d=60',
      '-vf', "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='Reel Placeholder':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2",
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', '-r', '30', videoPath
    ]).catch(() => console.warn('Could not create placeholder video'));
  }

  console.log(`Reel pack generated at ${outputDir}`);
  console.log('Files:');
  console.log('  - reel.svg');
  console.log('  - reel-cover.jpg');
  console.log('  - feed.svg');
  console.log('  - feed.jpg');
  console.log('  - caption.md');
  console.log('  - reel-script.md');
  console.log('  - reel.json');
  console.log('  - reel.srt');
  console.log('  - reel.mp4');
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});