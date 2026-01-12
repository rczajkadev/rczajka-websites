import type { SearchDoc } from '@/lib/search';
import { PostSummaryCard } from './post-summary-card';

type PostsListProps = {
  posts: SearchDoc[];
};

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostSummaryCard key={post.id} post={post} />
      ))}
    </div>
  );
};
