'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const parsePageParam = (value: string | null) => {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export const usePostsQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlPage = parsePageParam(searchParams.get('page'));

  const [query, setQuery] = useState(urlQuery);
  const [page, setPage] = useState(urlPage);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }

    const next = params.toString();
    const current = searchParams.toString();

    if (next !== current) {
      const url = next ? `${pathname}?${next}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [query, page, router, pathname, searchParams]);

  return { query, setQuery, page, setPage };
};
