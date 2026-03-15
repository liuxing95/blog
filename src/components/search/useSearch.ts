'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js';

export interface SearchItem {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    date: string;
    series?: string;
    content: string;
}

export type SearchResult = FuseResult<SearchItem>;

const fuseOptions: IFuseOptions<SearchItem> = {
    keys: [
        { name: 'title', weight: 0.4 },
        { name: 'excerpt', weight: 0.25 },
        { name: 'tags', weight: 0.2 },
        { name: 'content', weight: 0.15 },
    ],
    threshold: 0.3,
    minMatchCharLength: 2,
    includeMatches: true,
    ignoreLocation: true,
};

export function useSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fuseRef = useRef<Fuse<SearchItem> | null>(null);
    const indexLoadedRef = useRef(false);

    const loadIndex = useCallback(async () => {
        if (indexLoadedRef.current) return;
        setIsLoading(true);
        try {
            const res = await fetch('/search-index.json');
            const data: SearchItem[] = await res.json();
            fuseRef.current = new Fuse(data, fuseOptions);
            indexLoadedRef.current = true;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!fuseRef.current || query.length < 2) {
            setResults([]);
            return;
        }
        const results = fuseRef.current.search(query, { limit: 10 });
        setResults(results);
    }, [query]);

    return { query, setQuery, results, isLoading, loadIndex };
}
