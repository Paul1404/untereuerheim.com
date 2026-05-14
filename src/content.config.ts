import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const chronik = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/chronik" }),
  schema: ({ image }) =>
    z.object({
      year: z.union([z.number(), z.string()]),
      sortKey: z.number(),
      title: z.string(),
      description: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
    }),
});

export const collections = { chronik };
