import { Suspense } from 'react';
import PostsClient from './posts/posts-client';

export const dynamic = 'error';
export const revalidate = false;

export default function Home() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-white">All posts</h1>
        <p className="max-w-2xl text-sm text-neutral-300">
          Search across titles, content, tags, and categories. Filters stay entirely client-side
          and are backed by a static MiniSearch index built at compile time.
        </p>
      </header>
      <Suspense fallback={<div className="text-sm text-neutral-400">Loading posts...</div>}>
        <PostsClient />
      </Suspense>
    </div>
  );
}
