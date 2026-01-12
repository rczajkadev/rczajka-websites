import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { buildToc } from '@/lib/table-of-contents';
import { addCodeHighlights, PortableTextRenderer } from '@/sanity/portable-text';
import { getAllPosts, getAllSlugs, getPostBySlug } from '@/sanity/posts';
import { PostCard } from '@/components/post-card';

export const dynamic = 'error';
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

const getRelatedPosts = (currentSlug: string, posts: Awaited<ReturnType<typeof getAllPosts>>) => {
  const current = posts.find((post) => post.slug === currentSlug);
  if (!current) {
    return [];
  }

  const currentTags = new Set(current.tags ?? []);

  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;
      if (post.category && current.category && post.category === current.category) {
        score += 2;
      }
      if (post.tags?.length && currentTags.size > 0) {
        post.tags.forEach((tag) => {
          if (currentTags.has(tag)) {
            score += 3;
          }
        });
      }
      return { post, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime();
    })
    .slice(0, 4)
    .map((entry) => entry.post);
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const highlightedBody = await addCodeHighlights(post.body);
  const toc = buildToc(highlightedBody);

  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  const relatedPosts = getRelatedPosts(post.slug, allPosts);

  return (
    <article className="space-y-12">
      <Link
        href="/"
        className="inline-flex text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-white"
      >
        Back to posts
      </Link>
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
          <span>{formatDate(post.publishedAt)}</span>
          {post.updatedAt ? <span>Updated {formatDate(post.updatedAt)}</span> : null}
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">{post.title}</h1>
        <div className="flex flex-wrap gap-2">
          {post.category ? (
            <Link href={`/categories/${encodeURIComponent(post.category)}`}>
              <Badge>{post.category}</Badge>
            </Link>
          ) : null}
          {post.tags?.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              <Badge>{tag}</Badge>
            </Link>
          ))}
        </div>
        {post.excerpt ? <p className="max-w-2xl text-lg text-neutral-300">{post.excerpt}</p> : null}
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <div>
          {toc.length ? (
            <details className="mb-8 rounded-2xl border border-white/10 bg-neutral-900/60 p-5 lg:hidden">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.3em] text-neutral-400">
                Table of contents
              </summary>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                {toc.map((entry) => (
                  <li key={entry.id} className={entry.level === 3 ? 'pl-3' : ''}>
                    <a href={`#${entry.id}`} className="transition hover:text-white">
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          <PortableTextRenderer value={highlightedBody} />
        </div>

        {toc.length ? (
          <aside className="sticky top-24 hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-5 lg:block">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Contents</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {toc.map((entry) => (
                <li key={entry.id} className={entry.level === 3 ? 'pl-3' : ''}>
                  <a href={`#${entry.id}`} className="transition hover:text-white">
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.slug}`}
            className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 transition hover:border-white/30"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Previous</p>
            <p className="mt-3 text-lg font-semibold text-white">{prevPost.title}</p>
          </Link>
        ) : null}
        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 transition hover:border-white/30"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Next</p>
            <p className="mt-3 text-lg font-semibold text-white">{nextPost.title}</p>
          </Link>
        ) : null}
      </section>

      {relatedPosts.length ? (
        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Related</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">You might also like</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedPosts.map((related) => (
              <PostCard key={related._id} post={related} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
