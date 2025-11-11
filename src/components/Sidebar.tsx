'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Post } from '@/service/posts';

interface TagNode {
  name: string;
  children: Map<string, TagNode>;
  posts: Post[];
  level: number;
}

interface SidebarProps {
  tagTree: TagNode;
}

export default function Sidebar({ tagTree }: SidebarProps) {
  const pathname = usePathname();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleNode = (nodePath: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodePath)) {
      newExpanded.delete(nodePath);
    } else {
      newExpanded.add(nodePath);
    }
    setExpandedNodes(newExpanded);
  };

  const isActive = (path: string) => pathname === path;

  // Recursive function to render tag tree
  const renderTagNode = (node: TagNode, parentPath: string = '') => {
    const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expandedNodes.has(nodePath);
    const hasChildren = node.children.size > 0;
    const hasPosts = node.posts.length > 0;
    const totalCount = node.posts.length + Array.from(node.children.values()).reduce((sum, child) => sum + child.posts.length, 0);

    // Calculate indentation based on level
    const indentClass = node.level === 0 ? '' : `ml-${Math.min(node.level * 4, 12)}`;

    return (
      <div key={nodePath} className={indentClass}>
        {/* Tag Node Header */}
        {node.name && (
          <button
            onClick={() => toggleNode(nodePath)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              node.level === 0
                ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center">
              <svg
                className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
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
              <span className={node.level === 0 ? 'font-semibold' : ''}>
                {node.name}
              </span>
              {totalCount > 0 && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({totalCount})
                </span>
              )}
            </span>
          </button>
        )}

        {/* Expanded Content */}
        {(isExpanded || node.level === 0) && (
          <div className={node.level > 0 ? 'ml-6 mt-1 space-y-1' : 'space-y-1'}>
            {/* Direct Posts */}
            {hasPosts && isExpanded && (
              <div className="space-y-1">
                {node.posts.map((post) => (
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
                    <div className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="line-clamp-2">{post.matter.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(post.matter.date).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Child Nodes */}
            {hasChildren && (
              <div className="space-y-1">
                {Array.from(node.children.entries())
                  .sort(([nameA, nodeA], [nameB, nodeB]) => {
                    // Sort by total post count (descending), then by name
                    const countA = nodeA.posts.length + Array.from(nodeA.children.values()).reduce((sum, child) => sum + child.posts.length, 0);
                    const countB = nodeB.posts.length + Array.from(nodeB.children.values()).reduce((sum, child) => sum + child.posts.length, 0);
                    if (countB !== countA) return countB - countA;
                    return nameA.localeCompare(nameB, 'zh-CN');
                  })
                  .map(([childName, childNode]) => renderTagNode(childNode, nodePath))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          文章目录
        </h2>

        <nav className="space-y-1">
          {Array.from(tagTree.children.entries())
            .sort(([nameA, nodeA], [nameB, nodeB]) => {
              // Sort root level by total post count (descending), then by name
              const countA = nodeA.posts.length + Array.from(nodeA.children.values()).reduce((sum, child) => sum + child.posts.length, 0);
              const countB = nodeB.posts.length + Array.from(nodeB.children.values()).reduce((sum, child) => sum + child.posts.length, 0);
              if (countB !== countA) return countB - countA;
              return nameA.localeCompare(nameB, 'zh-CN');
            })
            .map(([childName, childNode]) => renderTagNode(childNode))}
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
