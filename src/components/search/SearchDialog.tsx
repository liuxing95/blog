'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useSearch } from './useSearch';
import SearchResultItem from './SearchResultItem';

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { query, setQuery, results, isLoading, loadIndex } = useSearch();
    const [activeIndex, setActiveIndex] = useState(-1);

    // Open/close dialog
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            loadIndex();
            dialog.showModal();
            // Focus input after animation
            requestAnimationFrame(() => inputRef.current?.focus());
        } else {
            dialog.close();
            setQuery('');
            setActiveIndex(-1);
        }
    }, [isOpen, loadIndex, setQuery]);

    // Handle native dialog close (ESC key)
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => onClose();
        dialog.addEventListener('close', handleClose);
        return () => dialog.removeEventListener('close', handleClose);
    }, [onClose]);

    // Reset active index when results change
    useEffect(() => {
        setActiveIndex(results.length > 0 ? 0 : -1);
    }, [results]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
            } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
                e.preventDefault();
                const slug = results[activeIndex].item.slug;
                onClose();
                window.location.href = `/posts/${slug}`;
            }
        },
        [results, activeIndex, onClose]
    );

    // Click backdrop to close
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent<HTMLDialogElement>) => {
            if (e.target === dialogRef.current) {
                onClose();
            }
        },
        [onClose]
    );

    return (
        <dialog
            ref={dialogRef}
            className="search-dialog w-full max-w-lg mx-auto mt-[15vh] p-0 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-hidden"
            onClick={handleBackdropClick}
        >
            <div className="flex flex-col max-h-[70vh]">
                {/* Search input */}
                <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
                    <svg
                        className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="搜索文章..."
                        className="w-full px-3 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-base"
                    />
                    <button
                        onClick={onClose}
                        className="shrink-0 px-2 py-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded font-mono"
                    >
                        ESC
                    </button>
                </div>

                {/* Results */}
                <div className="overflow-y-auto flex-1">
                    {isLoading && (
                        <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                            加载搜索索引...
                        </div>
                    )}

                    {!isLoading && query.length >= 2 && results.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                            未找到相关文章
                        </div>
                    )}

                    {!isLoading && query.length > 0 && query.length < 2 && (
                        <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                            请输入至少 2 个字符
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="py-2 divide-y divide-gray-100 dark:divide-gray-700/50">
                            {results.map((result, index) => (
                                <div key={result.item.slug} onClick={onClose}>
                                    <SearchResultItem
                                        result={result}
                                        isActive={index === activeIndex}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && query.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                            输入关键词搜索文章
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">↑↓</kbd>
                        导航
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">↵</kbd>
                        打开
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">esc</kbd>
                        关闭
                    </span>
                </div>
            </div>
        </dialog>
    );
}
