import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const cutoff = Date.now() - 1000 * 60 * 60 * 48; // 48 hours
  const recent = posts.filter((p) => p.data.pubDate.valueOf() >= cutoff);

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const urls = recent
    .map((p) => {
      const loc = `https://dripmatiq.app/blog/${p.slug}/`;
      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Dripmatiq Blog</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${p.data.pubDate.toISOString()}</news:publication_date>
      <news:title>${escape(p.data.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
