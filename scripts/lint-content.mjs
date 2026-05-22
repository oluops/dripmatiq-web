#!/usr/bin/env node
// Lint blog markdown for common mistakes that render literally on the page.
// Runs as part of `npm run prebuild`. Exits 1 on any error.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'blog');

// Patterns: [regex, label, severity]
const RULES = [
  [/\{:[^}]*\}/g, 'kramdown attribute syntax (use plain markdown)', 'error'],
  [/\{%[\s\S]*?%\}/g, 'Liquid/Jekyll tag (not supported by Astro)', 'error'],
  [/\]\(\s*\)/g, 'empty link target', 'error'],
  [/\]\(#?\)/g, 'placeholder link', 'error'],
  [/\bhttp:\/\/(?!localhost)/g, 'insecure http:// URL (use https://)', 'warn'],
  [/\bTODO:?\b|\bFIXME:?\b|\bXXX:?\b/g, 'TODO/FIXME marker left in content', 'warn'],
  [/[\u201C\u201D]/g, 'curly double-quote inside frontmatter (allowed in body)', 'skip-body'],
  [/\]\([^)]*\s+["']?[a-z]+=/g, 'attributes inside link parens (use HTML <a>)', 'error'],
];

let errors = 0, warnings = 0;
const files = (await readdir(root)).filter((f) => f.endsWith('.md'));

for (const file of files) {
  const path = join(root, file);
  const raw = await readFile(path, 'utf8');
  // Split frontmatter
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const body = m ? m[2] : raw;

  for (const [pattern, label, severity] of RULES) {
    const target = severity === 'skip-body' ? (m ? m[1] : '') : body;
    const matches = [...target.matchAll(pattern)];
    if (!matches.length) continue;
    const sev = severity === 'skip-body' ? 'warn' : severity;
    const tag = sev === 'error' ? '✗ ERROR' : '⚠ WARN ';
    for (const match of matches) {
      const before = target.slice(0, match.index);
      const line = before.split('\n').length;
      const snippet = match[0].slice(0, 60).replace(/\n/g, ' ');
      console.log(`${tag} ${file}:${line}  ${label}\n         > ${snippet}`);
      sev === 'error' ? errors++ : warnings++;
    }
  }
}

// Check hero images exist for every blog post
const publicRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
for (const file of files) {
  const path = join(root, file);
  const raw = await readFile(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  const fm = m[1];
  const heroMatch = fm.match(/heroImage:\s*["']?([^"'\n]+)["']?/);
  if (!heroMatch) {
    console.log(`✗ ERROR ${file}:1  missing heroImage in frontmatter`);
    errors++;
    continue;
  }
  const heroPath = join(publicRoot, heroMatch[1]);
  try {
    await stat(heroPath);
  } catch {
    console.log(`✗ ERROR ${file}:1  heroImage file not found: ${heroMatch[1]}`);
    errors++;
  }
}

console.log(`\nlint-content: ${errors} error(s), ${warnings} warning(s)`);
if (errors > 0) process.exit(1);
