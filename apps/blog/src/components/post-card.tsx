import Link from 'next/link';
import { formatDate } from '@/lib/format';
import type { Post } from '@/sanity/types';
import { Badge } from './ui/badge';

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <article className="group relative rounded-3xl border border-white/10 bg-neutral-900/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:border-white/30 focus-within:border-white/40">
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
        <h3 className="mt-4 text-2xl font-semibold text-white">{post.title}</h3>
        {post.excerpt ? (
          <p className="mt-3 text-sm leading-6 text-neutral-300">{post.excerpt}</p>
        ) : null}
        {post.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};
