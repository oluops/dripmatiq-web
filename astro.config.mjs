import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// Build a date map from blog content files for accurate sitemap lastmod
const blogDir = new URL('./src/content/blog/', import.meta.url);
const dateMap = new Map();
for (const file of fs.readdirSync(blogDir)) {
  if (!file.endsWith('.md')) continue;
  const content = fs.readFileSync(new URL(file, blogDir), 'utf-8');
  const match = content.match(/pubDate:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
  if (match) {
    const slug = file.replace('.md', '');
    dateMap.set(slug, new Date(match[1]));
  }
}

export default defineConfig({
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      // Tag pages duplicate content discoverable from /blog/ — exclude from sitemap to save crawl budget.
      filter: (page) => !/\/blog\/tag\//.test(page),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://dripmatiq.app/' || item.url === 'https://dripmatiq.app') {
          return { ...item, priority: 1.0, changefreq: 'daily', lastmod: new Date() };
        }
        // Blog post — use actual publish date
        const blogMatch = item.url.match(/\/blog\/([^/]+)\/?$/);
        if (blogMatch && blogMatch[1] !== '' && dateMap.has(blogMatch[1])) {
          return { ...item, priority: 0.8, changefreq: 'weekly', lastmod: dateMap.get(blogMatch[1]) };
        }
        if (item.url.endsWith('/blog/') || item.url.endsWith('/blog')) {
          return { ...item, priority: 0.9, changefreq: 'daily', lastmod: new Date() };
        }
        return { ...item, lastmod: new Date() };
      },
    }),
  ],
  site: 'https://dripmatiq.app',
});
