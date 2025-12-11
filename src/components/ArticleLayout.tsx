import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import ArticleActions from './ArticleActions';
import ArticleContent from './ArticleContent';
import '@/styles/article.css';

interface ArticleLayoutProps {
  title: string;
  date: string;
  tags: string[] | undefined;
  content: string;
}

export default function ArticleLayout({
  title,
  date,
  tags,
  content,
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton={true} pageType="article" />

      <main className="container mx-auto px-0">
        <div className="border-l-2 border-r-2 border-black mx-4">
          <article className="max-w-4xl mx-auto">
            <div className="border-b-2 border-black">
              <div className="p-8">
                <div className="border-b border-black pb-4 mb-6">
                  <time className="text-xs font-mono uppercase">{date}</time>
                  {tags && tags.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="text-xs font-mono px-2 py-1 border border-black hover:bg-black hover:text-white transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-bold leading-tight">{title}</h1>
              </div>
            </div>

            <div className="p-8">
              <ArticleContent content={content} charsPerSecond={150} />
            </div>

            <ArticleActions title={title} />

            <div className="border-black">
              <div className="p-8 flex justify-between items-center">
                <Link
                  href="/"
                  className="text-sm font-mono uppercase hover:bg-black hover:text-white px-3 py-2 border border-black transition-colors"
                >
                  ← RETURN TO INDEX
                </Link>
                <div className="text-xs font-mono">END OF ARTICLE</div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer variant="article" />
    </div>
  );
}
