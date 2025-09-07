import Link from 'next/link';
import { Post } from '@/service/posts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { slug, matter } = post;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <Link href={`/posts/${slug}`} className="group">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
            {matter.title}
          </h2>
        </Link>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <time dateTime={matter.date}>
            {new Date(matter.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span className="mx-2">•</span>
          <span>{matter.author}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{matter.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {matter.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              {tag}
            </Link>
          ))}
        </div>

        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          阅读更多
          <svg
            className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
