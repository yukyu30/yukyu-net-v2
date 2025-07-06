import Link from 'next/link';
import { getSortedPostsData, POSTS_PER_PAGE } from '@/lib/posts';
import PostList from '@/components/PostList';
import Pagination from '@/components/Pagination';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const currentPage = parseInt(page);
  
  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }
  
  const allPostsData = getSortedPostsData();
  const totalPages = Math.ceil(allPostsData.length / POSTS_PER_PAGE);
  
  if (currentPage > totalPages) {
    notFound();
  }
  
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = allPostsData.slice(startIndex, endIndex);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Yukyu Blog
          </Link>
        </h1>
        <p className="text-gray-600">技術とライフスタイルのブログ</p>
      </header>
      
      <main>
        <PostList 
          posts={currentPosts} 
          title={`記事一覧 (ページ ${currentPage}/${totalPages})`}
        />
        
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </main>
    </div>
  );
}