import { toPlainText } from '@portabletext/toolkit';
import type { PortableTextBlock } from '@portabletext/types';
import type { PortableTextValue } from '@/sanity/types';
import { buildHeadingId } from './slug';

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
};

export const buildToc = (body: PortableTextValue = []): TocEntry[] => {
  const headingBlocks = body
    .filter((block): block is PortableTextBlock => block._type === 'block')
    .filter((block) => block.style === 'h2' || block.style === 'h3');

  return headingBlocks
    .map((block) => {
      const text = toPlainText([block]);
      const level: TocEntry['level'] = block.style === 'h2' ? 2 : 3;
      return {
        id: buildHeadingId(text, block._key),
        text,
        level
      };
    })
    .filter((entry) => entry.text);
};
