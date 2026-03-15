'use client';

interface SearchButtonProps {
    onClick: () => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200"
            aria-label="搜索文章"
        >
            <svg
                className="w-4 h-4"
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
            <span className="hidden lg:inline">搜索</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-600 rounded">
                <span className="text-xs">⌘</span>K
            </kbd>
        </button>
    );
}
