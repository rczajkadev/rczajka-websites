'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import MiniSearch from 'minisearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/format';

type SearchDoc = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt: string;
  tags: string[];
  category?: string;
};

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

const PAGE_SIZE = 10;

const normalizeValue = (value: string) => value.trim().toLowerCase();

const parsePageParam = (value: string | null) => {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseQuery = (input: string) => {
  const tokens = input.split(/\s+/).filter(Boolean);
  const includeTags: string[] = [];
  const excludeTags: string[] = [];
  let category: string | null = null;
  const textTokens: string[] = [];

  tokens.forEach((token) => {
    const lower = token.toLowerCase();
    if (lower.startsWith('-tag:')) {
      const value = normalizeValue(token.slice(5));
      if (value) {
        excludeTags.push(value);
      }
      return;
    }
    if (lower.startsWith('tag:')) {
      const value = normalizeValue(token.slice(4));
      if (value) {
        includeTags.push(value);
      }
      return;
    }
    if (lower.startsWith('cat:')) {
      const value = normalizeValue(token.slice(4));
      if (value) {
        category = value;
      }
      return;
    }
    textTokens.push(token);
  });

  return {
    text: textTokens.join(' '),
    includeTags: Array.from(new Set(includeTags)),
    excludeTags: Array.from(new Set(excludeTags)),
    category
  };
};

export default function PostsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlPage = parsePageParam(searchParams.get('page'));

  const [miniSearch, setMiniSearch] = useState<MiniSearch | null>(null);
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState('');
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

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);

    return () => window.clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [indexResponse, docsResponse] = await Promise.all([
          fetch('/search-index.json'),
          fetch('/search-docs.json')
        ]);

        const [indexJson, docsJson] = await Promise.all([
          indexResponse.text(),
          docsResponse.json()
        ]);

        if (!active) {
          return;
        }

        const searchIndex = MiniSearch.loadJSON(indexJson, indexOptions);
        setMiniSearch(searchIndex);
        setDocs(docsJson as SearchDoc[]);
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

  const sortedDocs = useMemo(() => {
    return [...docs].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [docs]);
  const parsedQuery = useMemo(() => parseQuery(debouncedQuery), [debouncedQuery]);

  const baseResults = useMemo(() => {
    if (!miniSearch || !parsedQuery.text) {
      return sortedDocs;
    }

    const results = miniSearch.search(parsedQuery.text, searchOptions);
    return results
      .map((result) => docsById.get(result.id as string))
      .filter(Boolean) as SearchDoc[];
  }, [miniSearch, parsedQuery.text, docsById, sortedDocs]);

  const filteredResults = useMemo(() => {
    const { includeTags, excludeTags, category } = parsedQuery;
    if (includeTags.length === 0 && excludeTags.length === 0 && !category) {
      return baseResults;
    }

    return baseResults.filter((doc) => {
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
  }, [baseResults, parsedQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasQuery = query.trim().length > 0;

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <Input
          id="search"
          placeholder="Search... (tip: tag:design cat:product -tag:old)"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
      </div>

      {hasQuery ? (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setPage(1);
            }}
          >
            Clear search
          </Button>
        </div>
      ) : null}

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-500">
        <span>{filteredResults.length} results</span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 text-sm text-neutral-400">
          Loading search index...
        </div>
      ) : null}

      {!loading && paginatedResults.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 text-sm text-neutral-400">
          No posts match the current filters.
        </div>
      ) : null}

      <div className="space-y-6">
        {paginatedResults.map((post) => (
          <article
            key={post.id}
            className="group relative rounded-3xl border border-white/10 bg-neutral-900/50 p-6 transition hover:border-white/30 focus-within:border-white/40"
          >
            <Link
              href={`/posts/${post.slug}`}
              aria-label={`Read ${post.title}`}
              className="absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60"
            >
              <span className="sr-only">{post.title}</span>
            </Link>
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                <span>{formatDate(post.publishedAt)}</span>
                {post.category ? (
                  <Link
                    href={`/categories/${encodeURIComponent(post.category)}`}
                    className="relative z-20 transition hover:text-white"
                  >
                    {post.category}
                  </Link>
                ) : null}
              </div>
              <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
              {post.excerpt ? (
                <p className="mt-3 text-sm leading-6 text-neutral-300">{post.excerpt}</p>
              ) : null}
              {post.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="relative z-20 rounded-full border border-white/10 px-3 py-1 transition hover:border-white/30 hover:text-white"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
