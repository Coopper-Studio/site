import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

const blogFrontmatterSchema = frontmatterSchema.extend({
  category: z.enum(['studio', 'product-thinking']),
  status: z.enum(['published', 'evergreen']).default('published'),
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
});

export const docs = defineDocs({
  dir: 'content/blogs',
  docs: {
    schema: blogFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
