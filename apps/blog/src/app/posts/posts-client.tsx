'use client';

import { PaginationControls } from '@/components/posts/pagination-controls';
import { PostsList } from '@/components/posts/posts-list';
import { ResultsSummary } from '@/components/posts/results-summary';
import { SearchInput } from '@/components/posts/search-input';
import { SearchStatus } from '@/components/posts/search-status';
import { Button } from '@/components/ui/button';
import { usePostsQueryParams } from '@/hooks/usePostsQueryParams';
import { usePostsSearch } from '@/hooks/usePostsSearch';

export default function PostsClient() {
  const { query, setQuery, page, setPage } = usePostsQueryParams();
  const { loading, results, totalResults, totalPages, currentPage } = usePostsSearch({
    query,
    page
  });

  const hasQuery = query.trim().length > 0;

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
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

      <ResultsSummary
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <SearchStatus loading={loading} isEmpty={!loading && results.length === 0} />

      <PostsList posts={results} />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setPage((prev) => Math.max(1, prev - 1))}
        onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
      />
    </section>
  );
}
