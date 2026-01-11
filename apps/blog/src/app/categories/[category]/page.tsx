import { notFound } from 'next/navigation';
import { PostCard } from '@/components/post-card';
import { getAllCategories, getAllPosts } from '@/sanity/posts';

export const dynamic = 'error';
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ category }));
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = await getAllPosts();
  const categoryPosts = posts.filter((post) => post.category === decodedCategory);

  if (categoryPosts.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Category</p>
        <h1 className="text-4xl font-semibold text-white">{decodedCategory}</h1>
        <p className="text-sm text-neutral-300">{categoryPosts.length} posts</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {categoryPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
