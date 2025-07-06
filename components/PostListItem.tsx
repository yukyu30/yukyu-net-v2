import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { PostData } from '@/lib/posts';

interface PostListItemProps {
  post: PostData;
}

export default function PostListItem({ post }: PostListItemProps) {
  const { slug, title, created_at, excerpt } = post;

  return (
    <article className="border-b pb-6 last:border-0">
      <Link href={`/posts/${slug}`} className="group block">
        <h3 className="text-xl font-medium mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-gray-700 mb-2 text-sm truncate">
            {excerpt}
          </p>
        )}
        <time className="text-sm text-gray-600">
          {format(new Date(created_at), 'yyyy年MM月dd日', { locale: ja })}
        </time>
      </Link>
    </article>
  );
}