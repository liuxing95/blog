import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllSeries, getPostsBySeries } from '@/service/posts';
import PostCard from '@/components/PostCard';

interface SeriesPageProps {
  params: Promise<{ series: string }>;
}

export async function generateStaticParams() {
  const series = getAllSeries();
  return series.map((seriesName) => ({
    series: encodeURIComponent(seriesName),
  }));
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { series } = await params;
  const decodedSeries = decodeURIComponent(series);
  const posts = getPostsBySeries(decodedSeries);

  if (posts.length === 0) {
    return {
      title: 'Series Not Found',
    };
  }

  return {
    title: `${decodedSeries} - Devin's Blog`,
    description: `查看 "${decodedSeries}" 系列的所有文章，共 ${posts.length} 篇`,
    keywords: [decodedSeries, '系列', '文章分类', 'Devin', '博客'],
  };
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { series } = await params;
  const decodedSeries = decodeURIComponent(series);
  const posts = getPostsBySeries(decodedSeries);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <nav className="mb-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                首页
              </Link>
              <span className="mx-2">/</span>
              <Link
                href="/series"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                系列
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {decodedSeries}
              </span>
            </div>
          </nav>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
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
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {decodedSeries}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  共 {posts.length} 篇文章 • 按发布时间排序
                </p>
              </div>
            </div>
          </div>

          {/* Series Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              系列目录
            </h2>
            <div className="space-y-3">
              {posts.map((post, index) => (
                <div key={post.slug} className="flex items-center group">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex-1 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                  >
                    {post.matter.title}
                  </Link>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.matter.date).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Posts */}
        <div className="grid gap-8 lg:gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/series"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              查看所有系列
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                href="/posts"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                所有文章
              </Link>
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                回到首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}