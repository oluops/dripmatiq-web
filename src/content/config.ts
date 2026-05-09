import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    tags: z.array(z.string()),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    excerpt: z.string().min(50).max(300).optional(),
    author: z.string().default('Olu'),
    // Optional FAQ schema — array of {q, a}
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .optional(),
    // Optional HowTo schema — array of step strings (or {name, text})
    howto: z
      .object({
        name: z.string(),
        steps: z.array(
          z.union([
            z.string(),
            z.object({ name: z.string(), text: z.string() }),
          ])
        ),
      })
      .optional(),
  }),
});

export const collections = { blog };
