import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const siteUrl = 'https://dripmatiq.app';

  let body = `# Dripmatiq — Full Content Dump for LLMs\n\n`;
  body += `> Dripmatiq scans your wardrobe with computer vision, learns your taste, and builds daily outfits you'll actually wear. Built for people who own enough clothes already.\n\n`;
  body += `Site: ${siteUrl}\n`;
  body += `Generated: ${new Date().toISOString()}\n`;
  body += `Posts included: ${posts.length}\n\n`;
  body += `---\n\n`;

  for (const p of posts) {
    body += `# ${p.data.title}\n\n`;
    body += `URL: ${siteUrl}/blog/${p.slug}/\n`;
    body += `Published: ${p.data.pubDate.toISOString().slice(0, 10)}\n`;
    body += `Tags: ${p.data.tags.join(', ')}\n`;
    body += `Description: ${p.data.description}\n\n`;
    body += `${p.body}\n\n`;
    body += `---\n\n`;
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
