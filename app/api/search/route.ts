import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;
export const { staticGET: GET } = createFromSource(source, {
  buildIndex(page) {
    const keywordContent = page.data.keywords.join(' ');
    const structuredData = {
      ...page.data.structuredData,
      contents:
        keywordContent.length > 0
          ? [
              {
                content: keywordContent,
                heading: undefined,
              },
              ...page.data.structuredData.contents,
            ]
          : page.data.structuredData.contents,
    };

    return {
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      structuredData,
      tag: page.data.tags,
      url: page.url,
    };
  },
});
