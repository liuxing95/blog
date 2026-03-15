'use client';

import Link from 'next/link';
import type { SearchResult } from './useSearch';

interface SearchResultItemProps {
    result: SearchResult;
    isActive: boolean;
}

function highlightText(text: string, indices: readonly [number, number][] | undefined): React.ReactNode {
    if (!indices || indices.length === 0) return text;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const [start, end] of indices) {
        if (start > lastIndex) {
            parts.push(text.slice(lastIndex, start));
        }
        parts.push(
            <mark key={start} className="bg-yellow-200 dark:bg-yellow-800 text-inherit rounded px-0.5">
                {text.slice(start, end + 1)}
            </mark>
        );
        lastIndex = end + 1;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

export default function SearchResultItem({ result, isActive }: SearchResultItemProps) {
    const { item, matches } = result;
    const titleMatch = matches?.find((m) => m.key === 'title');

    return (
        <Link
            href={`/posts/${item.slug}`}
            className={`block px-4 py-3 transition-colors duration-100 ${
                isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
        >
            <div className="font-medium text-gray-900 dark:text-white text-sm">
                {highlightText(item.title, titleMatch?.indices)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {item.excerpt}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
                <time className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(item.date).toLocaleDateString('zh-CN')}
                </time>
                {item.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </Link>
    );
}
