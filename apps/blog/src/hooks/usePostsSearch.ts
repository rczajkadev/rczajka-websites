'use client';

import { useEffect, useMemo, useState } from 'react';
import type MiniSearch from 'minisearch';
import { POSTS_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import { paginate } from '@/lib/pagination';
import { parseSearchQuery } from '@/lib/search/queryParser';
import {
  filterResults,
  loadSearchIndex,
  resolveBaseResults,
  sortDocsByDate
} from '@/lib/search/searchEngine';
import type { SearchDoc } from '@/lib/search/types';
import { useDebouncedValue } from './useDebouncedValue';

type UsePostsSearchParams = {
  query: string;
  page: number;
  pageSize?: number;
};

export const usePostsSearch = ({ query, page, pageSize = POSTS_PAGE_SIZE }: UsePostsSearchParams) => {
  const [miniSearch, setMiniSearch] = useState<MiniSearch | null>(null);
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { miniSearch: loadedIndex, docs: loadedDocs } = await loadSearchIndex();
        if (!active) {
          return;
        }
        setMiniSearch(loadedIndex);
        setDocs(loadedDocs);
      } catch (error) {
        console.error('Failed to load search index', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const docsById = useMemo(() => {
    return new Map(docs.map((doc) => [doc.id, doc]));
  }, [docs]);

  const sortedDocs = useMemo(() => sortDocsByDate(docs), [docs]);
  const parsedQuery = useMemo(() => parseSearchQuery(debouncedQuery), [debouncedQuery]);

  const baseResults = useMemo(() => {
    return resolveBaseResults(miniSearch, docsById, sortedDocs, parsedQuery.text);
  }, [miniSearch, docsById, sortedDocs, parsedQuery.text]);

  const filteredResults = useMemo(() => {
    return filterResults(baseResults, parsedQuery);
  }, [baseResults, parsedQuery]);

  const { pageItems, totalItems, totalPages, currentPage } = useMemo(() => {
    return paginate(filteredResults, page, pageSize);
  }, [filteredResults, page, pageSize]);

  return {
    loading,
    results: pageItems,
    totalResults: totalItems,
    totalPages,
    currentPage
  };
};
