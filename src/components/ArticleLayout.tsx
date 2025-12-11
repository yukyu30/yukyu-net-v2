import Link from 'next/link';
import MenuBar from './MenuBar';
import StatusBar from './StatusBar';
import WindowFrame from './WindowFrame';
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
    <div className="min-h-screen bg-black flex flex-col">
      {/* メニューバー */}
      <MenuBar />

      {/* メインウィンドウ */}
      <main className="flex-1 p-4">
        <WindowFrame title={title}>
          {/* メタ情報 */}
          <div className="border-b border-green-400 px-6 py-4">
            <time className="text-xs font-mono text-green-600 uppercase">{date}</time>
            {tags && tags.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="text-xs font-mono px-2 py-1 border border-green-400 hover:bg-green-400 hover:text-black transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 記事タイトル */}
          <div className="border-b border-green-400 px-6 py-4">
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          </div>

          {/* 記事本文 */}
          <div className="px-6 py-6">
            <ArticleContent content={content} charsPerSecond={150} />
          </div>

          {/* アクション */}
          <ArticleActions title={title} />

          {/* 戻るリンク */}
          <div className="border-t border-green-400 px-6 py-4 flex justify-between items-center">
            <Link
              href="/"
              className="text-sm font-mono uppercase hover:bg-green-400 hover:text-black px-3 py-2 border border-green-400 transition-colors"
            >
              &lt;- RETURN TO INDEX
            </Link>
            <div className="text-xs font-mono text-green-600">END OF FILE</div>
          </div>
        </WindowFrame>
      </main>

      {/* ステータスバー */}
      <StatusBar status="VIEWING ARTICLE" />
    </div>
  );
}
