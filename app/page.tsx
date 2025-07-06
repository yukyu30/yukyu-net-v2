import { getSortedPostsData, POSTS_PER_PAGE } from '@/lib/posts';
import PostList from '@/components/PostList';
import Pagination from '@/components/Pagination';

export default function Home() {
  const allPostsData = getSortedPostsData();
  const totalPages = Math.ceil(allPostsData.length / POSTS_PER_PAGE);
  const currentPosts = allPostsData.slice(0, POSTS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Yukyu Blog</h1>
        <p className="text-gray-600">技術とライフスタイルのブログ</p>
      </header>
      
      <main>
        <PostList posts={currentPosts} />
        
        {totalPages > 1 && (
          <Pagination currentPage={1} totalPages={totalPages} />
        )}
      </main>
    </div>
  );
}
