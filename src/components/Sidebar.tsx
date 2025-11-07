'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Post } from '@/service/posts';

interface TagWithPosts {
  tag: string;
  posts: Post[];
}

interface SidebarProps {
  taggedPosts: TagWithPosts[];
}

export default function Sidebar({ taggedPosts }: SidebarProps) {
  const pathname = usePathname();
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTag = (tag: string) => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tag)) {
      newExpanded.delete(tag);
    } else {
      newExpanded.add(tag);
    }
    setExpandedTags(newExpanded);
  };

  const isActive = (path: string) => pathname === path;

  const sidebarContent = (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
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
          标签分类
        </h2>

        <nav className="space-y-1">
          {taggedPosts.map(({ tag, posts }) => (
            <div key={tag} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              <button
                onClick={() => toggleTag(tag)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <span className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">#</span>
                  {tag}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({posts.length})
                  </span>
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedTags.has(tag) ? 'rotate-90' : ''
                  }`}
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
              </button>

              {expandedTags.has(tag) && (
                <div className="ml-4 mt-1 mb-2 space-y-1">
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                        isActive(`/posts/${post.slug}`)
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="line-clamp-2">{post.matter.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 block mt-1">
                        {new Date(post.matter.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${isSidebarOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
