import { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';
import Admonition, { Note, Tip, Info, Warning, Danger } from '@/extensions/admonitions/Admonitions';
import Mermaid from './mdx/Mermaid';
import CodeBlock from './mdx/CodeBlock';

export const mdxComponents: MDXComponents = {
  // 自定义标题组件
  h1: ({ children, id, ...props }) => (
    <h1
      id={id}
      className="text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0 scroll-mt-20"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="text-3xl font-semibold text-gray-900 dark:text-white mb-4 mt-8 scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-6 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4
      id={id}
      className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6 scroll-mt-20"
      {...props}
    >
      {children}
    </h4>
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

    // Check if this is a mermaid code block
    if (className === 'language-mermaid') {
      return <Mermaid>{String(children).trim()}</Mermaid>;
    }

    if (isInline) {
      return (
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      );
    }

    // Use CodeBlock for syntax highlighting
    return <CodeBlock className={className}>{String(children)}</CodeBlock>;
  },

  pre: ({ children }) => {
    // Check if children is a Mermaid component
    // When code component returns <Mermaid>, the pre receives it as children
    const isMermaid =
      children &&
      typeof children === 'object' &&
      'props' in children &&
      typeof children.props === 'object' &&
      children.props !== null &&
      'className' in children.props &&
      typeof children.props.className === 'string' &&
      children.props.className.includes('language-mermaid');

    // If it's a Mermaid diagram, just render the children without the pre wrapper
    if (isMermaid) {
      return (
        <div className="relative mb-6">
          <pre className="bg-white dark:bg-white text-gray-100 p-4 rounded-lg overflow-x-auto">
            {children}
          </pre>
        </div>
      );
    }

    return (
      <div className="relative mb-6">
        <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
          {children}
        </pre>
      </div>
    );
  },

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

  mermaid: Mermaid,
  Mermaid,
  // Admonition 组件支持
  Admonition,
  Note,
  Tip,
  Info,
  Warning,
  Danger,
};
