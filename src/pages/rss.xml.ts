import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'Dripmatiq Blog',
    description: 'Style tips, wardrobe hacks, and AI-powered outfit advice.',
    site: context.site!,
    items: posts
      .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
      })),
  });
}
