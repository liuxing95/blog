'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  // Extract language from className (format: "language-xxx")
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // Only apply syntax highlighting for ts, js, tsx, jsx, json
  const supportedLanguages = ['typescript', 'javascript', 'ts', 'js', 'tsx', 'jsx', 'json'];
  const shouldHighlight = supportedLanguages.includes(language);

  if (!shouldHighlight) {
    // Return plain code block for unsupported languages
    return (
      <div className="relative mb-6">
        <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
          <code className={className}>{children}</code>
        </pre>
      </div>
    );
  }

  // Map short names to full names
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    tsx: 'typescript',
    jsx: 'javascript',
  };

  const displayLanguage = languageMap[language] || language;

  return (
    <div className="relative mb-6">
      <SyntaxHighlighter
        language={displayLanguage}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={false}
      >
        {String(children).trim()}
      </SyntaxHighlighter>
    </div>
  );
}
