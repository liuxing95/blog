'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  chart?: string;
  children?: string;
}

/**
 * Mermaid component for rendering diagrams
 * Works with both Next.js preview and Vercel deployment
 * Uses client-side rendering to avoid SSR issues
 */
export const Mermaid = ({ chart, children }: MermaidProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // Get the chart content from either prop
  const chartContent = chart || children || '';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !chartContent) return;

    const renderDiagram = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default;

        // Initialize mermaid with custom config
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'var(--font-geist-sans, sans-serif)',
        });

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chartContent);

        setSvg(renderedSvg);
        setError('');
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chartContent, isMounted]);

  // Show loading state before mount
  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        style={{ minHeight: '200px' }}
      >
        <span className="text-gray-500 dark:text-gray-400">Preparing diagram...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        style={{ minHeight: '200px' }}
      >
        <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Diagram Error</p>
        <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
        <pre className="mt-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded max-w-full overflow-x-auto">
          {chartContent}
        </pre>
      </div>
    );
  }

  // Show loading state while rendering
  if (!svg) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        style={{ minHeight: '200px' }}
      >
        <span className="text-gray-500 dark:text-gray-400">Rendering diagram...</span>
      </div>
    );
  }

  // Render the SVG
  return (
    <div
      ref={ref}
      className="mermaid-diagram my-6 flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
