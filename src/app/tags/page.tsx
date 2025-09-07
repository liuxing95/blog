import { Metadata } from 'next';
import Link from 'next/link';
import { getTagsWithCounts } from '@/service/posts';

export const metadata: Metadata = {
  title: "标签 - Devin's Blog",
  description: '浏览所有文章标签，按标签分类查看相关内容',
};

export default function TagsPage() {
  const tagsWithCounts = getTagsWithCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">所有标签</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            共 {tagsWithCounts.length} 个标签，点击标签查看相关文章
          </p>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tagsWithCounts.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-200">
                  <span className="text-blue-600 dark:text-blue-400 text-xl font-semibold">#</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
                  {tag.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{tag.count} 篇文章</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Tag Cloud Style */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">标签云</h2>
          <div className="flex flex-wrap gap-3">
            {tagsWithCounts.map((tag) => {
              // Calculate size based on post count
              const maxCount = Math.max(...tagsWithCounts.map((t) => t.count));
              const minSize = 14;
              const maxSize = 24;
              const fontSize = minSize + (tag.count / maxCount) * (maxSize - minSize);

              return (
                <Link
                  key={tag.name}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="inline-block px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 font-medium"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                </Link>
              );
            })}
          </div>
        </div>

        {tagsWithCounts.length === 0 && (
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">暂无标签</p>
          </div>
        )}

        {/* Back to posts */}
        <div className="mt-12 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            查看所有文章
          </Link>
        </div>
      </div>
    </div>
  );
}
