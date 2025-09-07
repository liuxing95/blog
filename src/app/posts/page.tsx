import Link from 'next/link';
import { getAllPosts, getTagsWithCounts } from '@/service/posts';
import PostCard from '@/components/PostCard';

export default function PostsPage() {
  const posts = getAllPosts();
  const tagsWithCounts = getTagsWithCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">所有文章</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">共 {posts.length} 篇文章</p>
        </div>

        {/* Tags Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">热门标签</h2>
            <Link
              href="/tags"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
            >
              查看全部 →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagsWithCounts.slice(0, 8).map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-75">({tag.count})</span>
              </Link>
            ))}
            {tagsWithCounts.length > 8 && (
              <Link
                href="/tags"
                className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                +{tagsWithCounts.length - 8} 更多
              </Link>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 lg:gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
