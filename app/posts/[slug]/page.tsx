import { getPostData, getAllPostSlugs } from '@/lib/posts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import styles from './post.module.css';

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

export default async function Post({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← ホームに戻る
        </Link>
        <h1 className="text-3xl font-bold mb-2">{postData.title}</h1>
        <div className={styles.articleMeta}>
          <time>
            {format(new Date(postData.created_at), 'yyyy年MM月dd日', { locale: ja })}
          </time>
        </div>
      </header>
      
      <article 
        className={styles.article}
        dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
      />
    </div>
  );
}