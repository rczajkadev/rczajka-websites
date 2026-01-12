import MiniSearch from 'minisearch';
import type { ParsedSearchQuery, SearchDoc } from './types';
import { normalizeValue } from './queryParser';

const indexOptions = {
  idField: 'id',
  fields: ['title', 'content', 'tags', 'category'],
  storeFields: ['id', 'slug', 'title', 'excerpt', 'publishedAt', 'tags', 'category']
};

const searchOptions = {
  prefix: true,
  fuzzy: 0.2,
  boost: {
    title: 3,
    tags: 2,
    category: 2
  }
};

export type SearchIndex = {
  miniSearch: MiniSearch;
  docs: SearchDoc[];
};

const loadSearchIndex = async (): Promise<SearchIndex> => {
  const [indexResponse, docsResponse] = await Promise.all([
    fetch('/search-index.json'),
    fetch('/search-docs.json')
  ]);

  const [indexJson, docsJson] = await Promise.all([indexResponse.text(), docsResponse.json()]);

  const miniSearch = MiniSearch.loadJSON(indexJson, indexOptions);
  return { miniSearch, docs: docsJson as SearchDoc[] };
};

const sortDocsByDate = (docs: SearchDoc[]) => {
  const getPublishedAt = (doc: SearchDoc) => new Date(doc.publishedAt).getTime();
  return [...docs].sort((a, b) => getPublishedAt(b) - getPublishedAt(a));
};

const resolveBaseResults = (
  miniSearch: MiniSearch | null,
  docsById: Map<string, SearchDoc>,
  sortedDocs: SearchDoc[],
  queryText: string
) => {
  if (!miniSearch || !queryText) {
    return sortedDocs;
  }

  const results = miniSearch.search(queryText, searchOptions);

  return results
    .map((result) => docsById.get(result.id as string))
    .filter(Boolean) as SearchDoc[];
};

const filterResults = (docs: SearchDoc[], parsedQuery: ParsedSearchQuery) => {
  const { includeTags, excludeTags, category } = parsedQuery;

  if (includeTags.length === 0 && excludeTags.length === 0 && !category) {
    return docs;
  }

  return docs.filter((doc) => {
    const docTags = (doc.tags ?? []).map(normalizeValue).filter(Boolean);
    const docCategory = normalizeValue(doc.category ?? '');

    const docIncludesTag = (tag: string) => docTags.includes(tag);

    const hasAllIncludedTags = includeTags.length === 0 || includeTags.every(docIncludesTag);
    const hasNoExcludedTags = excludeTags.length === 0 || !excludeTags.some(docIncludesTag);
    const matchesCategory = !category || docCategory === category;

    return hasAllIncludedTags && hasNoExcludedTags && matchesCategory;
  });
};

export { filterResults, loadSearchIndex, resolveBaseResults, sortDocsByDate };
