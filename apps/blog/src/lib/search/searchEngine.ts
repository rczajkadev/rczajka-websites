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

/**
 * The search index is generated at build time by scripts/generate-search-index.mjs.
 * Draft visibility is enforced there; the client only loads static JSON files.
 */
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
  return [...docs].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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

    if (includeTags.length && !includeTags.every((tag) => docTags.includes(tag))) {
      return false;
    }
    if (excludeTags.length && excludeTags.some((tag) => docTags.includes(tag))) {
      return false;
    }
    if (category && docCategory !== category) {
      return false;
    }

    return true;
  });
};

export { filterResults, loadSearchIndex, resolveBaseResults, sortDocsByDate };
