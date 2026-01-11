import { notFound } from 'next/navigation';
import { PostCard } from '@/components/post-card';
import { getAllPosts, getAllTags } from '@/sanity/posts';

export const dynamic = 'error';
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getAllPosts();
  const taggedPosts = posts.filter((post) => post.tags?.includes(decodedTag));

  if (taggedPosts.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Tag</p>
        <h1 className="text-4xl font-semibold text-white">{decodedTag}</h1>
        <p className="text-sm text-neutral-300">{taggedPosts.length} posts</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {taggedPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
