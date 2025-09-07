import { Metadata } from 'next';
import Link from 'next/link';
import { getSeriesWithCounts } from '@/service/posts';

export const metadata: Metadata = {
  title: '系列 - Liu Xing\'s Blog',
  description: '浏览所有文章系列，按系列分类查看相关内容',
};

export default function SeriesPage() {
  const seriesWithCounts = getSeriesWithCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            所有系列
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            共 {seriesWithCounts.length} 个系列，点击系列查看相关文章
          </p>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesWithCounts.map((series) => (
            <Link
              key={series.name}
              href={`/series/${encodeURIComponent(series.name)}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
                    {series.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {series.count} 篇文章
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-200">
                  <svg 
                    className="w-6 h-6 text-blue-600 dark:text-blue-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                    />
                  </svg>
                </div>
              </div>

              {/* Preview of first few posts */}
              <div className="space-y-2">
                {series.posts.slice(0, 3).map((post) => (
                  <div key={post.slug} className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {post.matter.title}
                  </div>
                ))}
                {series.posts.length > 3 && (
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    还有 {series.posts.length - 3} 篇文章...
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 font-medium">
                查看系列
                <svg
                  className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {seriesWithCounts.length === 0 && (
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              暂无系列
            </p>
          </div>
        )}

        {/* Back to posts */}
        <div className="mt-12 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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