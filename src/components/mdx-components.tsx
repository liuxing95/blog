import { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

export const mdxComponents: MDXComponents = {
  // 自定义标题组件
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-6">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">{children}</h4>
  ),

  // 自定义段落
  p: ({ children }) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>
  ),

  // 自定义链接
  a: ({ href, children, ...props }) => {
    if (href?.startsWith('http')) {
      return (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href || ''}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // 自定义列表
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  // 自定义代码块
  code: ({ children, className }) => {
    const isInline = !className;

    if (isInline) {
      return (
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      );
    }

    return (
      <div className="relative mb-6">
        <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={className}>{children}</code>
        </pre>
      </div>
    );
  },

  pre: ({ children }) => (
    <div className="relative mb-6">
      <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
        {children}
      </pre>
    </div>
  ),

  // 自定义引用块
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
      <div className="text-gray-700 dark:text-gray-300 italic">{children}</div>
    </blockquote>
  ),

  // 自定义图片
  img: ({ src, alt, ...props }) => (
    <Image
      src={src || ''}
      alt={alt || ''}
      width={800}
      height={400}
      className="rounded-lg shadow-lg w-full h-auto"
      {...props}
    />
  ),

  // 自定义表格
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
  th: ({ children }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
      {children}
    </td>
  ),

  // 自定义水平线
  hr: () => <hr className="my-8 border-t border-gray-200 dark:border-gray-700" />,

  // 自定义强调文本
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
  ),

  em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
};
