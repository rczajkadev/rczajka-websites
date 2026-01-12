import Link from 'next/link';
import { formatDate } from '@/lib/format';
import type { SearchDoc } from '@/lib/search';

type PostSummaryCardProps = {
  post: SearchDoc;
};

export const PostSummaryCard = ({ post }: PostSummaryCardProps) => {
  return (
    <article className="group relative rounded-3xl border border-white/10 bg-neutral-900/50 p-6 transition hover:border-white/30 focus-within:border-white/40">
      <Link
        href={`/posts/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60"
      >
        <span className="sr-only">{post.title}</span>
      </Link>
      <div className="relative pointer-events-none">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-neutral-500">
          <span>{formatDate(post.publishedAt)}</span>
          {post.category ? (
            <Link
              href={`/categories/${encodeURIComponent(post.category)}`}
              className="relative z-20 pointer-events-auto transition hover:text-white"
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
                className="relative z-20 pointer-events-auto rounded-full border border-white/10 px-3 py-1 transition hover:border-white/30 hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};
