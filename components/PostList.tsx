import { PostData } from '@/lib/posts';
import PostListItem from './PostListItem';

interface PostListProps {
  posts: PostData[];
  title?: string;
}

export default function PostList({ posts, title = '最新の記事' }: PostListProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}