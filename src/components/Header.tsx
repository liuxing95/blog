'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { SeriesWithCount } from '@/service/posts';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSeriesOpen, setIsSeriesOpen] = useState(false);
  const [series, setSeries] = useState<SeriesWithCount[]>([]);

  useEffect(() => {
    // Load series data from API
    const fetchSeries = async () => {
      try {
        const response = await fetch('/api/series');
        if (response.ok) {
          const seriesData = await response.json();
          setSeries(seriesData);
        } else {
          console.warn('Failed to fetch series data');
          setSeries([]);
        }
      } catch (error) {
        console.warn('Error fetching series data:', error);
        setSeries([]);
      }
    };

    fetchSeries();
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Devin&apos;s Blog
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                首页
              </Link>
              <Link
                href="/posts"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                文章
              </Link>
              <Link
                href="/tags"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                标签
              </Link>
              
              {/* Series Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSeriesOpen(!isSeriesOpen)}
                  className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  系列
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${isSeriesOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isSeriesOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        href="/series"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setIsSeriesOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <span>所有系列</span>
                          <span className="text-xs text-gray-500">({series.length})</span>
                        </div>
                      </Link>
                      
                      {series.length > 0 && <hr className="my-1 border-gray-200 dark:border-gray-600" />}
                      
                      {series.slice(0, 5).map((seriesItem) => (
                        <Link
                          key={seriesItem.name}
                          href={`/series/${encodeURIComponent(seriesItem.name)}`}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => setIsSeriesOpen(false)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{seriesItem.name}</span>
                            <span className="text-xs text-gray-500">({seriesItem.count})</span>
                          </div>
                        </Link>
                      ))}
                      
                      {series.length > 5 && (
                        <Link
                          href="/series"
                          className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-600"
                          onClick={() => setIsSeriesOpen(false)}
                        >
                          查看更多系列...
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Link
                href="/about"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                关于
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-50 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">打开主菜单</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/posts"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                文章
              </Link>
              <Link
                href="/tags"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                标签
              </Link>
              <Link
                href="/series"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                系列
              </Link>
              <Link
                href="/about"
                className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                关于
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}