import type { PortableTextBlock } from '@portabletext/types';

export type PortableTextValue = Array<
  | PortableTextBlock
  | {
      _type: string;
      _key?: string;
      [key: string]: unknown;
    }
>;

export type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  body: PortableTextValue;
};

export type PostSlug = {
  slug: string;
};
