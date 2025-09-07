import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllTags, getPostsByTag } from '@/service/posts';
import PostCard from '@/components/PostCard';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `${decodedTag} - Liu Xing's Blog`,
    description: `查看所有关于 "${decodedTag}" 的文章，共 ${posts.length} 篇`,
    keywords: [decodedTag, '标签', '文章分类', 'Liu Xing', '博客'],
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const allTags = getAllTags();

  if (posts.length === 0) {
    notFound();
  }

  // Get related tags (tags that appear together with current tag)
  const relatedTags = new Set<string>();
  posts.forEach((post) => {
    post.matter.tags.forEach((postTag) => {
      if (postTag !== decodedTag) {
        relatedTags.add(postTag);
      }
    });
  });

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
                href="/tags"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                标签
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 dark:text-white font-medium">{decodedTag}</span>
            </div>
          </nav>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                <span className="text-blue-600 dark:text-blue-400">#</span>
                {decodedTag}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                共找到 {posts.length} 篇相关文章
              </p>
            </div>
          </div>

          {/* Related Tags */}
          {relatedTags.size > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关标签</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(relatedTags)
                  .slice(0, 10)
                  .map((relatedTag) => (
                    <Link
                      key={relatedTag}
                      href={`/tags/${encodeURIComponent(relatedTag)}`}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
                    >
                      {relatedTag}
                    </Link>
                  ))}
              </div>
            </div>
          )}
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
              href="/tags"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              查看所有标签
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
