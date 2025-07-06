import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Yukyu Blog</h1>
        <p className="text-gray-600">技術とライフスタイルのブログ</p>
      </header>
      
      <main>
        <section>
          <h2 className="text-2xl font-semibold mb-6">最新の記事</h2>
          <div className="space-y-6">
            {allPostsData.map(({ slug, created_at, title }) => (
              <article key={slug} className="border-b pb-6 last:border-0">
                <Link href={`/posts/${slug}`} className="group">
                  <h3 className="text-xl font-medium mb-2 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <time className="text-sm text-gray-600">
                    {format(new Date(created_at), 'yyyy年MM月dd日', { locale: ja })}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
