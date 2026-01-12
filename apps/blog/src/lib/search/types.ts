export type SearchDoc = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt: string;
  tags: string[];
  category?: string;
};

export type ParsedSearchQuery = {
  text: string;
  includeTags: string[];
  excludeTags: string[];
  category: string | null;
};
