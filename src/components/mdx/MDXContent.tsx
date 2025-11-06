import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx-components';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface MDXContentProps {
  source: string;
}

interface MDXError extends Error {
  line?: number;
  column?: number;
  position?: {
    start?: { line?: number; column?: number };
    end?: { line?: number; column?: number };
  };
  source?: string;
  reason?: string;
}

function extractErrorInfo(error: unknown): {
  message: string;
  line?: number;
  column?: number;
  reason?: string;
  source?: string;
} {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  const mdxError = error as MDXError;
  let line = mdxError.line;
  let column = mdxError.column;
  let source = mdxError.source;

  // Try to extract line/column from position object
  if (!line && mdxError.position?.start?.line) {
    line = mdxError.position.start.line;
    column = mdxError.position.start.column;
  }

  // Try to extract from error message - multiple patterns
  if (!line) {
    // Pattern 1: "line 123, column 45"
    const pattern1 = error.message.match(/line[:\s]+(\d+)(?:.*column[:\s]+(\d+))?/i);
    if (pattern1) {
      line = parseInt(pattern1[1], 10);
      if (pattern1[2]) column = parseInt(pattern1[2], 10);
    }

    // Pattern 2: "at line 123:45"
    const pattern2 = error.message.match(/at line[:\s]+(\d+):(\d+)/i);
    if (pattern2) {
      line = parseInt(pattern2[1], 10);
      column = parseInt(pattern2[2], 10);
    }

    // Pattern 3: "123:45" (line:column format)
    const pattern3 = error.message.match(/(\d+):(\d+)/);
    if (pattern3 && !line) {
      line = parseInt(pattern3[1], 10);
      column = parseInt(pattern3[2], 10);
    }
  }

  // Try to extract the problematic character/token from message
  if (!source) {
    const charMatch = error.message.match(/character\s+`([^`]+)`/i);
    const tokenMatch = error.message.match(/Unexpected\s+([^\s,]+)/i);
    if (charMatch) source = charMatch[1];
    else if (tokenMatch) source = tokenMatch[1];
  }

  // Log full error for debugging
  console.error('MDX Error Details:', {
    message: error.message,
    line,
    column,
    source,
    stack: error.stack,
    fullError: error,
  });

  return {
    message: error.message,
    line,
    column,
    reason: mdxError.reason || error.message,
    source,
  };
}

function getContextLines(source: string, errorLine?: number, context = 3): string {
  if (!errorLine) return '';

  const lines = source.split('\n');
  const start = Math.max(0, errorLine - context - 1);
  const end = Math.min(lines.length, errorLine + context);

  return lines
    .slice(start, end)
    .map((line, index) => {
      const lineNum = start + index + 1;
      const isErrorLine = lineNum === errorLine;
      const prefix = isErrorLine ? '→ ' : '  ';
      const lineNumStr = String(lineNum).padStart(4, ' ');
      return `${prefix}${lineNumStr} | ${line}`;
    })
    .join('\n');
}

export async function MDXContent({ source }: MDXContentProps) {
  try {
    return (
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkDirective],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor-link'],
                  },
                },
              ],
            ],
          },
        }}
      />
    );
  } catch (error) {
    const errorInfo = extractErrorInfo(error);
    const contextLines = getContextLines(source, errorInfo.line);

    return (
      <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-r-lg">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              MDX Compilation Error
            </h3>

            {(errorInfo.line || errorInfo.column) && (
              <p className="text-red-700 dark:text-red-400 font-mono text-sm mb-2">
                {errorInfo.line && `Line ${errorInfo.line}`}
                {errorInfo.line && errorInfo.column && ', '}
                {errorInfo.column && `Column ${errorInfo.column}`}
              </p>
            )}

            <div className="bg-red-100 dark:bg-red-900/40 rounded p-3 mb-4">
              <p className="text-red-800 dark:text-red-300 text-sm font-medium mb-2">Error Message:</p>
              <p className="text-red-700 dark:text-red-400 text-sm whitespace-pre-wrap">
                {errorInfo.reason || errorInfo.message}
              </p>
              {errorInfo.source && (
                <p className="text-red-600 dark:text-red-500 text-xs mt-2 font-mono">
                  Problem: {errorInfo.source}
                </p>
              )}
            </div>

            {contextLines ? (
              <div className="bg-gray-900 dark:bg-gray-950 rounded p-4 overflow-x-auto mb-4">
                <p className="text-gray-400 text-xs mb-2 font-mono">Source context:</p>
                <pre className="text-gray-200 text-sm font-mono leading-relaxed">{contextLines}</pre>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3 mb-4">
                <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                  ⚠️ Unable to extract exact line number from error.
                </p>
                <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-1">
                  Check browser console for detailed error information.
                </p>
              </div>
            )}

            <div className="mt-4 text-sm text-red-700 dark:text-red-400">
              <p className="font-medium mb-1">Common issues:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Unclosed JSX tags or components</li>
                <li>Invalid characters in component names (use letters, digits, $, or _)</li>
                <li>Missing imports for custom components</li>
                <li>Incorrect JSX syntax in MDX</li>
              </ul>
              <a
                href="https://mdxjs.com/docs/troubleshooting-mdx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
              >
                View MDX troubleshooting guide
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
