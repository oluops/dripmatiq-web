import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      // Tag pages duplicate content discoverable from /blog/ — exclude from sitemap to save crawl budget.
      filter: (page) => !/\/blog\/tag\//.test(page),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        if (item.url === 'https://dripmatiq.app/' || item.url === 'https://dripmatiq.app') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        if (/\/blog\/[^/]+\/?$/.test(item.url)) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        if (item.url.endsWith('/blog/') || item.url.endsWith('/blog')) {
          return { ...item, priority: 0.9, changefreq: 'daily' };
        }
        return item;
      },
    }),
  ],
  site: 'https://dripmatiq.app',
});
